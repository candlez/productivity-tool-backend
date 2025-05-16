import { app } from "./app.js";
import { db } from "./db.js";

let server;

const startServer = async () => {
    try {
        const connection = await db.getConnection();
        console.log("Connected to database");
        connection.release();
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }

    server = app.listen(process.env.NODE_PORT || 9000, () => {
        console.log(`Servers is listening on port ${process.env.NODE_PORT || 9000}...`);
    });
}

startServer();