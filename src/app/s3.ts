import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import env from "./env.ts";
import {logger} from "./log.ts";

const client = new S3Client({
    region: env.s3.region,
    endpoint: env.s3.endpoint,
    credentials: {
        accessKeyId: env.s3.credentials.accessKeyId,
        secretAccessKey: env.s3.credentials.secretAccessKey,
    },
});

export async function uploadBuildToS3(
    projectName: string,
    tag: string,
    fileName: string,
    fileData: ArrayBuffer,
): Promise<string> {
    const path = `${tag}/${fileName}`;
    const uploadParams = {
        Bucket: projectName,
        Key: path,
        Body: Buffer.from(fileData),
    };

    logger.info(`Start uploading build ${projectName}/${tag} to S3`)
    await client.send(new PutObjectCommand(uploadParams));
    logger.info(`Build ${projectName}/${tag} uploaded successfully to S3 at ${path}`);
    return `https://${projectName}.${env.downloadSource.domain}` + path;
}