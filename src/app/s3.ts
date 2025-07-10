import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import env from "./env";
import {logger} from "./log";

const client = new S3Client({
    region: env.s3.region,
    endpoint: env.s3.endpoint,
    credentials: {
        accessKeyId: env.s3.credentials.accessKeyId,
        secretAccessKey: env.s3.credentials.secretAccessKey,
    },
});

export async function uploadBuildToS3(
    projectId: string,
    tag: string,
    fileName: string,
    fileData: ArrayBuffer,
): Promise<string> {
    const path = `${tag}/${fileName}`;
    const uploadParams = {
        Bucket: projectId,
        Key: path,
        Body: Buffer.from(fileData),
    };

    logger.info(`Start uploading build ${projectId}/${tag} to S3`)
    await client.send(new PutObjectCommand(uploadParams));
    logger.info(`Build ${projectId}/${tag} uploaded successfully to S3 at ${path}`);
    return `https://${projectId}.${env.downloadSource.domain}/${path}`;
}