import {config} from "dotenv";
import * as process from "node:process";

config();

const env = {
    port: parseInt(process.env.PORT || "32767", 10),
    password: process.env.PASSWORD!!,
    s3: {
        region: process.env.S3_REGION || "rainyun",
        endpoint: process.env.S3_ENDPOINT || "https://cn-nb1.rains3.com",
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID!!,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!!,
        },
    },
    downloadSource: {
        domain: process.env.DOWNLOAD_SOURCE_DOMAIN || "https://cn-nb1.rains3.com",
        name: process.env.DOWNLOAD_SOURCE_NAME || "rainyun",
    },
    logLevel: process.env.LOG_LEVEL || "info",
    api: {
        baseUrl: process.env.API_BASE_URL || "https://api.leavesmc.org/v2",
        token: process.env.API_TOKEN!!,
    },
};

export default env;
