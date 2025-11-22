import type { PoolConnection } from "mysql2/promise";

import { app } from "./app.js";
import { db } from "./db.js";
import { environment } from "./environment.js";
import { logger } from "./logger.js";

let server;

const startServer = async () => {
    logger.info("Starting Server...")

    try {
        const connection: PoolConnection = await db.getConnection();
        logger.info("Connected to database");
        connection.release();
    } catch (error) {
        logger.fatal(error, "Failed to connect to the database:")
        process.exit(1);
    }

    server = app.listen(environment.NODE_PORT, () => {
        logger.info(`Server is listening on port ${environment.NODE_PORT}...`);
    });
}

startServer();