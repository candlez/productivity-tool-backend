import { type FieldPacket, type Pool, type PoolConnection, type RowDataPacket } from 'mysql2/promise';

import { toUser, uuidToBuffer, type User } from '../types/user.types.js';
import { db } from "../db.js";

/** // TODO write this documentation
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


    public async getUserByEmail(email: string): Promise<User | null> {

        let connection: PoolConnection = await this.mysql.getConnection();
        try {
            const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.query<RowDataPacket[]>(
                `SELECT * FROM users WHERE email = ?;`, 
                [email]
            );

            if (rows.length === 0) {
                return null;
            }
            if (rows.length === 1) {
                // TypeScript doesn't like this for some reason. hence the non null assertion (!)
                return toUser(rows[0]!);
            }
            // TODO throw some type of error here
            return null;
        } catch (error) {
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