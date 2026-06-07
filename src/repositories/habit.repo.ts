import type { FieldPacket, Pool, PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type { UUID } from "crypto";

import { db } from "../db.js";

import type { UpdatePredicate, WherePredicate } from "../util/predicate.util.js";
import { toHabit, type Habit } from "../types/habit.types.js";
import { uuidToBuffer } from "../util/uuid.util.js";
import { isMySQL2Error } from "../util/error.util.js";
import { NotFoundError, ValidationError } from "../types/error.types.js";



export class HabitRepository {
    constructor(private mysql: Pool = db) {}

    public async getHabits(predicate: WherePredicate): Promise<Habit[]> {

        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.execute<RowDataPacket[]>(
                `SELECT * FROM habit
                 WHERE ${predicate.statements.join(" AND ")}`,
                predicate.values
            );
            
            return rows.map(toHabit);
        } finally {
            if (connection) { connection.release(); }
        }
    }

    public async getOneHabit(predicate: WherePredicate) {

        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.execute<RowDataPacket[]>(
                `SELECT * FROM habit
                 WHERE ${predicate.statements.join(" AND ")}`,
                predicate.values
            );

            if (rows.length === 0) throw new NotFoundError(`Habit not found`);
            if (rows.length === 1 && rows[0] !== undefined) return toHabit(rows[0]);
            throw new Error(`Found more than one habit with predicate: ${predicate}`);
        } finally {
            if (connection) { connection.release(); }
        }
    }

    public async insertHabit(habit: Habit) {

        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            await connection.execute(
                `INSERT INTO habit (habit_id, user_id, pillar_id, name, description, active, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?);`,
                [uuidToBuffer(habit.id), uuidToBuffer(habit.userID), uuidToBuffer(habit.pillarID), habit.name, 
                    habit.description, habit.active, habit.createdAt]
            )
        } catch (error) {
            if (isMySQL2Error(error)) {
                switch (error.errno) {
                    case 1062: // duplicate entry
                        throw new ValidationError("Habit name is already taken", { cause: error });                        
                }
            }
            throw error;
        } finally {
            if (connection) { connection.release(); }
        }
    }


    public async updateHabit(habitID: UUID, predicate: UpdatePredicate): Promise<void> {

        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            const [result, fields]: [ResultSetHeader, FieldPacket[]] = await connection.execute(
                `UPDATE habit
                 SET ${predicate.statements.join(", ")}
                 WHERE habit_id = ?;`,
                [...predicate.values, uuidToBuffer(habitID)]
            );

            if (result.affectedRows === 0 && result.info.startsWith("Rows matched: 0")) {
                throw new NotFoundError(`Habit not found [ID: ${habitID}]`);             
            }
        } finally {
            if (connection) { connection.release(); }
        }
    }


    public async deleteHabit(habitID: UUID, userID: UUID): Promise<void> {

        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            const [result, fields]: [ResultSetHeader, FieldPacket[]] = await connection.execute(
                `DELETE FROM habit
                 WHERE habit_id = ?
                 AND user_id = ?;`,
                [uuidToBuffer(habitID), uuidToBuffer(userID)]
            );

            if (result.affectedRows === 0) {
                throw new NotFoundError(`Habit not found [ID: ${habitID}]`);
            }
        } finally {
            if (connection) { connection.release(); }
        }
    }
}