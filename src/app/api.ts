import env from "./env";

export async function addDownloadSource(
    projectName: string,
    tag: string,
    url: string,
) {
    const authHeader = `Bearer ${env.api.token}`;
    const body = {
        download_source: env.downloadSource.name,
        project: projectName,
        tag,
        url,
    }
    const params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authentication: authHeader,
        },
        body: JSON.stringify(body),
    };
    await fetch(`${env.api.baseUrl}/commit/build/download_source`, params);
}