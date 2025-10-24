import type { FieldPacket, Pool, PoolConnection, RowDataPacket } from "mysql2/promise";
import type { UUID } from "crypto";

import { db } from "../db.js";

import { toPillar, type Pillar } from "../types/pillar.types.js";
import type { Predicate } from "../util/predicate.util.js";


/**
 * handles database operations on the pillars table
 */
export class PillarRepository {
    constructor(private mysql: Pool = db) {}

    public async getPillars(predicate: Predicate) {
        
        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.execute<RowDataPacket[]>(
                `SELECT * FROM pillars
                 WHERE 1 = 1
                 AND ${predicate.statements.join(" AND ")}`,
                predicate.values
            );
            
            return rows.map(toPillar);
        } catch (error) {
            throw error;
        } finally {
            if (connection) { connection.release(); }
        }
    }


    public async getPillarsByUser(userID: UUID): Promise<Pillar[]> {

        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.execute<RowDataPacket[]>(
                `SELECT * FROM pillars
                 WHERE user_id = ?;`,
                [userID]
            );
            
            return rows.map(toPillar);
        } catch (error) {
            throw error;
        } finally {
            if (connection) { connection.release(); }
        }
    }
}