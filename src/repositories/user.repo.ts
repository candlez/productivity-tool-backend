import { type FieldPacket, type Pool, type PoolConnection, type QueryResult, type RowDataPacket } from 'mysql2/promise';

import { mapUser, type User } from '../types/user.types.js';
import { db } from "../db.js";

/**
 * 
 */
export class UserRepository {
    constructor(private mysql: Pool = db) {}

    public async getAllUsers(): Promise<User[]> {
        let connection: PoolConnection = await this.mysql.getConnection();

        try {
            const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.query<RowDataPacket[]>(`SELECT user_id, first_name, last_name, email FROM users;`);
            
            return rows.map(mapUser);
        } catch (error) {
            // const errOpts: ErrorOptions = {
            //     cause: error
            // }
            // throw new Error("test", errOpts);

            // not yet sure how error handling will work
            throw error;
        } finally {
            if (connection) { connection.release(); }
        }
    }
}