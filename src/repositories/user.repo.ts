import { type FieldPacket, type Pool, type PoolConnection, type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import type { UUID } from 'crypto';

import { db } from "../db.js";

import { toUser, type PredicateUser, type User } from '../types/user.types.js';
import { NotFoundError, ValidationError } from '../types/error.types.js';
import { isMySQL2Error } from '../util/error.util.js';
import { uuidToBuffer } from '../util/uuid.util.js';
import { ContextService } from '../services/context.service.js';

/**
 * handles database operations on the users table
 * should return only objects of type User as mapping is the responsibility of the caller
 */
export class UserRepository {
    constructor(private mysql: Pool = db) {}

    public async getAllUsers(): Promise<User[]> {

        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.execute<RowDataPacket[]>(`SELECT * FROM users;`);
            
            return rows.map(toUser);
        } catch (error) {
            ContextService.getLogger().error(error, `An error occurred getting users`);
            throw error;
        } finally {
            if (connection) { connection.release(); }
        }
    }


    public async getUserByEmail(email: string): Promise<User | null> {

        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.execute<RowDataPacket[]>(
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
            throw new Error(`Found more than one user with email: ${email}`);
        } catch (error) {
            ContextService.getLogger().error(error, `An error occurred getting user [Email: ${email}]`);
            throw error;
        } finally {
            if (connection) { connection.release(); }
        }
    }


    public async getUserById(id: UUID): Promise<User | null> {

        let connection = await this.mysql.getConnection();
        try {
            const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.execute<RowDataPacket[]>(
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
            throw new Error(`Found more than one user with id: ${id}`);
        } catch (error) {
            ContextService.getLogger().error(error, `An error occurred getting user [${id}]`);
            throw error;
        } finally {
            if (connection) { connection.release(); }
        }
    }


    public async insertUser(user: User): Promise<void> {

        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            await connection.execute(
                `INSERT INTO users (user_id, first_name, last_name, email, pw_hash, created_at)
                 VALUES (?, ?, ?, ?, ?, ?);`,
                [uuidToBuffer(user.id), user.firstName, user.lastName, user.email, user.passwordHash, user.createdAt]
            );
        } catch (error) {
            if (isMySQL2Error(error)) {
                switch (error.errno) {
                    case 1062: // duplicate entry
                        throw new ValidationError("Email is already taken", { cause: error });
                }
            }
            ContextService.getLogger().error(error, `An error occurred inserting user [Email: ${user.email}]`);
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
            throw new ValidationError("No values to update.");
        }

        values.push(uuidToBuffer(id));

        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            const [result, fields]: [ResultSetHeader, FieldPacket[]] = await connection.execute(
                `UPDATE users
                 SET ${statements.join(", ")}
                 WHERE user_id = ?;`,
                values
            );

            if (result.affectedRows === 0 && result.info.startsWith("Rows matched: 0")) {
                throw new NotFoundError(`User not found [ID: ${id}]`);             
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            ContextService.getLogger().error(error, `An error occurred updating user [${id}]`);
            throw error;
        } finally {
            if (connection) { connection.release(); }
        }
    }


    public async deleteUser(id: UUID): Promise<void> {

        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            const [result, fields]: [ResultSetHeader, FieldPacket[]] = await connection.execute(
                `DELETE FROM users
                 WHERE user_id = ?;`,
                [uuidToBuffer(id)]
            );

            if (result.affectedRows === 0) {
                throw new NotFoundError(`User not found [ID: ${id}]`);
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            ContextService.getLogger().error(error, `An error occurred deleting user [${id}]`);
            throw error;
        } finally {
            if (connection) { connection.release(); }
        }
    }
}
