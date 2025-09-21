import { type FieldPacket, type Pool, type PoolConnection, type RowDataPacket } from 'mysql2/promise';
import type { UUID } from 'crypto';

import { toUser, uuidToBuffer, type PredicateUser, type User } from '../types/user.types.js';
import { db } from "../db.js";

/** // TODO write this documentation
 * 
 */
export class UserRepository {
    constructor(private mysql: Pool = db) {}

    public async getAllUsers(): Promise<User[]> {

        const connection: PoolConnection = await this.mysql.getConnection();
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

        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.query<RowDataPacket[]>(
                `SELECT * FROM users WHERE email = ?;`, 
                [email]
            );

            if (rows.length === 0) {
                return null;
            }
            if (rows.length === 1) {
                // typescript doesn't like this for some reason. hence the non null assertion (!)
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


    public async getUserById(id: UUID): Promise<User | null> {

        let connection = await this.mysql.getConnection();
        try {
            const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.query<RowDataPacket[]>(
                `SELECT * FROM users WHERE user_id = ?;`, 
                [uuidToBuffer(id)]
            );

            if (rows.length === 0) {
                return null;
            }
            if (rows.length === 1) {
                // typescript doesn't like this for some reason. hence the non null assertion (!)
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


    public async insertUser(user: User): Promise<void> {

        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            await connection.query(
                `INSERT INTO users (user_id, first_name, last_name, email, pw_hash, created_at)
                 VALUES (?, ?, ?, ?, ?, ?);`,
                [uuidToBuffer(user.id), user.firstName, user.lastName, user.email, user.passwordHash, user.createdAt]
            );
        } catch (error) {
            throw error;
        } finally {
            if (connection) { connection.release(); }
        }
    }


    public async updateUser(id: UUID, user: PredicateUser): Promise<void> {

        let statements: string[] = [];
        const values = [];
        if (user.firstName !== undefined) {
            values.push(user.firstName);
            statements.push("first_name = ?");
        }
        if (user.lastName !== undefined) {
            values.push(user.lastName);
            statements.push("last_name = ?");
        }
        if (user.email !== undefined) {
            values.push(user.email);
            statements.push("email = ?");
        }
        if (user.passwordHash !== undefined) {
            values.push(user.passwordHash);
            statements.push("pw_hash = ?");
        }
        if (values.length === 0) {
            throw new Error("placeholder message");
            // TODO standardize this
        }

        values.push(uuidToBuffer(id));

        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            await connection.query(
                `UPDATE users
                 SET ${statements.join(", ")}
                 WHERE user_id = ?;`,
                values
            );
        } catch (error) {
            throw error;
        } finally {
            if (connection) { connection.release(); }
        }
    }


    public async deleteUser(id: UUID): Promise<void> {

        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            await connection.query(
                `DELETE FROM users
                 WHERE user_id = ?;`,
                [uuidToBuffer(id)]
            );
        } catch (error) {
            throw error;
        } finally {
            if (connection) { connection.release(); }
        }
    }
}
