import { Router } from "express";
import { db } from "../db.js";

export const testRouter = Router();

testRouter.get("/api/test1", async (req, res) => {
    return res.send("here is the test");
});

testRouter.get("/api/test2", async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const [results] = await connection.query(
            "SELECT * FROM test;"
        );

        return res.send(results);
    } catch (error) {
 
    } finally {
        if (connection) connection.release();
    }
});