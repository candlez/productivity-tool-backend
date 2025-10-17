import type { FieldPacket, Pool, PoolConnection, RowDataPacket } from "mysql2/promise";

import { db } from "../db.js";

import { toTheme, type Theme } from "../types/theme.types.js";

/**
 * handles database operations on the themes table
 */
export class ThemeRepository {
    constructor(private mysql: Pool = db) {}

    public async getAllThemes(): Promise<Theme[]> {
        
        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.execute<RowDataPacket[]>(`SELECT * FROM themes;`);
            
            return rows.map(toTheme);
        } catch (error) {
            throw error;
        } finally {
            if (connection) { connection.release(); }
        }
    }
}