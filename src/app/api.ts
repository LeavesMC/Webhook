import env from "./env";

export async function addDownloadSource(
    projectId: string,
    tag: string,
    url: string,
) {
    const authHeader = `Bearer ${env.api.token}`;
    const body = {
        download_source: env.downloadSource.name,
        project: projectId,
        tag,
        url,
    }
    const params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": authHeader,
        },
        body: JSON.stringify(body),
    };
    const response = await fetch(`${env.api.baseUrl}/commit/build/download_source`, params);
    if (!response.ok) {
        throw new Error(`Failed to add download source: ${response.status} ${response.statusText} ${JSON.stringify(await response.json())}`);
    }
}