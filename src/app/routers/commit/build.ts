import router from "../../router.ts";
import {logger} from "../../log.ts";
import {withRetry} from "../../retry.ts";
import {fetchArrayBuffer} from "../../fetch.ts";
import {uploadBuildToS3} from "../../s3.ts";
import {addDownloadSource} from "../../api.ts";
import env from "../../env.ts";

router.on("/commit/build", async (request, response) => {
    const projectName = request.body.project;
    const projectRepo = request.body.repository;
    const versionName = request.body.version;
    const tag = request.body.tag;

    if (request.method !== "POST" || !projectName || !projectRepo || !versionName || !tag) {
        response.status = 400;
        response.response = {
            code: 400,
            error: "Missing some required parameters: project, repository, version, tag"
        };
        return;
    }

    handleRequestAsync(projectName, projectRepo, versionName, tag).then();

    response.status = 200;
    response.response = {code: 200};


    return;
});

async function handleRequestAsync(
    projectName: string,
    projectRepo: string,
    versionName: string,
    tag: string
): Promise<void> {
    try {
        logger.info(`Uploading build ${tag}`);
        await tryHandleRequest(projectName, projectRepo, versionName, tag);
        logger.info("Upload completed");
    } catch (error) {
        logger.error(`Error uploading build: ${error}`);
    }
}

async function tryHandleRequest(
    projectName: string,
    projectRepo: string,
    versionName: string,
    tag: string
): Promise<void> {
    const fileName = `${projectName}-${versionName}.jar`;
    const originUrl = `${projectRepo}/releases/download/${tag}/${fileName}`;
    const buffer = await withRetry(
        () => fetchArrayBuffer(originUrl),
        `fetch build ${tag}`
    );
    const url = await withRetry(
        () => uploadBuildToS3(projectName, tag, fileName, buffer),
        `upload build ${tag} to S3`
    );
    await withRetry(
        () => addDownloadSource(projectName, tag, url),
        `add download source ${env.downloadSource.name} for build ${tag}`
    )
}