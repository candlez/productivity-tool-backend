import { app } from "./app.js";

let server;

const startServer = async () => {

    server = app.listen(process.env.NODE_PORT || 9000, () => {
        console.log(`Servers is listening on port ${process.env.NODE_PORT || 9000}...`);
    });
}

startServer();