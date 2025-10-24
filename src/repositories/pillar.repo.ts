import type { FieldPacket, Pool, PoolConnection, RowDataPacket } from "mysql2/promise";
import type { UUID } from "crypto";

import { db } from "../db.js";

import { toPillar, type Pillar } from "../types/pillar.types.js";
import type { Predicate } from "../util/predicate.util.js";
import { bufferToUUID, uuidToBuffer } from "../util/uuid.util.js";
import { isMySQL2Error } from "../util/error.util.js";


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
                [uuidToBuffer(userID)]
            );
            
            return rows.map(toPillar);
        } catch (error) {
            throw error;
        } finally {
            if (connection) { connection.release(); }
        }
    }


    public async insertPillar(pillar: Pillar): Promise<void> {
        
        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            await connection.execute(
                `INSERT INTO pillars (pillar_id, user_id, name, theme_id, description, max_score, active, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
                [uuidToBuffer(pillar.id), uuidToBuffer(pillar.userID), pillar.name, uuidToBuffer(pillar.themeID),
                    pillar.description, pillar.maxScore, pillar.active, pillar.createdAt]
            );
        } catch (error) {
            throw error;
        } finally {
            if (connection) { connection.release(); }
        }
    }
}