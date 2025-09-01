import { type FieldPacket, type Pool, type PoolConnection, type QueryResult, type RowDataPacket } from 'mysql2/promise';

import { toUser, uuidToBuffer, type InputUser, type User } from '../types/user.types.js';
import { db } from "../db.js";

/**
 * 
 */
export class UserRepository {
    constructor(private mysql: Pool = db) {}

    public async getAllUsers(): Promise<User[]> {
        let connection: PoolConnection = await this.mysql.getConnection();

        try {
            const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.query<RowDataPacket[]>(`SELECT * FROM users;`);
            
            return rows.map(toUser);
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


    public async insertUser(user: User): Promise<any> {
        let connection: PoolConnection = await this.mysql.getConnection();

        try {
            await connection.query(
                `INSERT INTO users (user_id, first_name, last_name, email, pw_hash, created_at)
                 VALUES (?, ?, ?, ?, ?, ?);`,
                [uuidToBuffer(user.id), user.firstName, user.lastName, user.email, user.passwordHash, user.createdAt]
            );

            return true;
        } catch (error) {
            throw error;
        } finally {
            if (connection) { connection.release(); }
        }
    }
}