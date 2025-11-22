import type { FieldPacket, Pool, PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type { UUID } from "crypto";

import { db } from "../db.js";

import { toPillar, type Pillar } from "../types/pillar.types.js";
import type { UpdatePredicate, WherePredicate } from "../util/predicate.util.js";
import { uuidToBuffer } from "../util/uuid.util.js";
import { NotFoundError } from "../types/error.types.js";


/**
 * handles database operations on the pillars table
 */
export class PillarRepository {
    constructor(private mysql: Pool = db) {}

    public async getPillars(predicate: WherePredicate) {
        
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


    public async getOnePillar(predicate: WherePredicate) {
        
        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.execute<RowDataPacket[]>(
                `SELECT * FROM pillars
                 WHERE 1 = 1
                 AND ${predicate.statements.join(" AND ")}`,
                predicate.values
            );

            if (rows.length === 0) throw new NotFoundError(`Pillar not found [Predicate: ${predicate}]`);
            if (rows.length === 1 && rows[0] !== undefined) return toPillar(rows[0]);
            throw new Error(`Found more than one pillar with predicate: ${predicate}`);
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


    public async updatePillar(pillarID: UUID, predicate: UpdatePredicate): Promise<void> {

        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            const [result, fields]: [ResultSetHeader, FieldPacket[]] = await connection.execute(
                `UPDATE pillars
                 SET ${predicate.statements.join(", ")}
                 WHERE pillar_id = ?;`,
                [...predicate.values, pillarID]
            );

            if (result.affectedRows === 0 && result.info.startsWith("Rows matched: 0")) {
                throw new NotFoundError(`Pillar not found [ID: ${pillarID}]`);             
            }
        } catch (error) {
            throw error;
        } finally {
            if (connection) { connection.release(); }
        }
    }


    public async deletePillar(pillarID: UUID): Promise<void> {

        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            const [result, fields]: [ResultSetHeader, FieldPacket[]] = await connection.execute(
                `DELETE FROM pillars
                 WHERE pillar_id = ?;`,
                [uuidToBuffer(pillarID)]
            );

            if (result.affectedRows === 0) {
                throw new NotFoundError(`Pillar not found [ID: ${pillarID}]`);
            }
        } catch (error) {
            throw error;
        } finally {
            if (connection) { connection.release(); }
        }
    }
}