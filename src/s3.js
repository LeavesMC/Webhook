const { infolog, errlog } = require("./logger");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.S3_REGION || "rainyun",
  endpoint: process.env.S3_ENDPOINT || "https://cn-nb1.rains3.com",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey:
      process.env.S3_SECRET_ACCESS_KEY,
  },
  signatureVersion: "v4",
});

async function upload(project, path, url) {
  if (!project || !path || !url) {
    errlog("S3", "Missing parameters.");
    return { success: false, reason: "Missing parameters." };
  }

  const uploadParams = {
    Bucket: project,
    Key: path,
    Body: Buffer.from(await (await fetch(url)).arrayBuffer()),
  };

  try {
    infolog("S3", `Starting upload to ${project}:/${path}`);
    await s3Client.send(new PutObjectCommand(uploadParams));
    infolog("S3", `Successfully uploaded ${path} to S3.`);
    return;
  } catch (error) {
    errlog("S3", `Error uploading ${path} to S3: ${error.message}`);
    return;
  }
}

module.exports = {
  upload,
};
