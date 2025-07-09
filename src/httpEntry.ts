import * as http from "http";
import app from "./app/app";
import env from "./app/env";

const server = http.createServer();

server.on("request", app.httpHandler());

server.listen(env.port, () => {
    console.log("VCLight serve");
    console.log(`> Ready! Available at http://localhost:${env.port}`);
});
