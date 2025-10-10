import type { PoolConnection } from "mysql2/promise";

import { app } from "./app.js";
import { db } from "./db.js";
import { environment } from "./environment.js";

let server;

const startServer = async () => {
    try {
        const connection: PoolConnection = await db.getConnection();
        console.log("Connected to database");
        connection.release();
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }

    server = app.listen(environment.NODE_PORT, () => {
        console.log(`Server is listening on port ${environment.NODE_PORT}...`);
    });
}

startServer();