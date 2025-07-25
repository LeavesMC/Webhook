import router from "../../router";
import {logger} from "../../log";
import {withRetry} from "../../retry";
import {fetchArrayBuffer} from "../../fetch";
import {uploadBuildToS3} from "../../s3";
import {addDownloadSource} from "../../api";
import env from "../../env";

router.on("/commit/build", async (request, response) => {
    const params = request.query["password"];
    if (params !== env.password) {
        response.status = 401;
        response.response = {
            code: 401,
            error: "Unauthorized",
        };
        return;
    }

    const projectId = request.body.project;
    const projectRepo = request.body.repository;
    const versionName = request.body.version;
    const tag = request.body.tag;

    if (request.method !== "POST" || !projectId || !projectRepo || !versionName || !tag) {
        response.status = 400;
        response.response = {
            code: 400,
            error: "Missing some required parameters: project, repository, version, tag"
        };
        return;
    }

    handleRequestAsync(projectId, projectRepo, versionName, tag).then();

    response.status = 200;
    response.response = {code: 200};


    return;
});

async function handleRequestAsync(
    projectId: string,
    projectRepo: string,
    versionName: string,
    tag: string
): Promise<void> {
    try {
        logger.info(`Uploading build ${tag}`);
        await tryHandleRequest(projectId, projectRepo, versionName, tag);
        logger.info("Upload completed");
    } catch (error) {
        logger.error(`Error uploading build: ${error}`);
    }
}

async function tryHandleRequest(
    projectId: string,
    projectRepo: string,
    versionName: string,
    tag: string
): Promise<void> {
    const fileName = `${projectId}-${versionName}.jar`;
    const originUrl = `${projectRepo}/releases/download/${versionName}-${tag}/${fileName}`;
    const buffer = await withRetry(
        () => fetchArrayBuffer(originUrl),
        `fetch build ${tag}`
    );
    const url = await withRetry(
        () => uploadBuildToS3(projectId, tag, fileName, buffer),
        `upload build ${tag} to S3`
    );
    await withRetry(
        () => addDownloadSource(projectId, tag, url),
        `add download source ${env.downloadSource.name} for build ${tag}`
    )
}