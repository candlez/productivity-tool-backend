import type { FieldPacket, Pool, PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type { UUID } from "crypto";

import { db } from "../db.js";

import { toHabitEntry, type HabitEntry } from "../types/habitEntry.types.js";
import type { UpdatePredicate, WherePredicate } from "../util/predicate.util.js";
import { uuidToBuffer } from "../util/uuid.util.js";
import { NotFoundError, ValidationError } from "../types/error.types.js";
import { isMySQL2Error } from "../util/error.util.js";
import { ContextService } from "../services/context.service.js";

export class HabitEntryRepository {
    constructor(private mysql: Pool = db) {}

    public async getHabitEntries(predicate: WherePredicate) {
        
        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.execute<RowDataPacket[]>(
                `SELECT * FROM habit_entry
                 WHERE ${predicate.statements.join(" AND ")}`,
                predicate.values
            );
            
            return rows.map(toHabitEntry);
        } finally {
            if (connection) { connection.release(); }
        }
    }


    public async getOneHabitEntry(predicate: WherePredicate): Promise<HabitEntry> {
        
        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.execute<RowDataPacket[]>(
                `SELECT * FROM habit_entry
                 WHERE ${predicate.statements.join(" AND ")}`,
                predicate.values
            );

            if (rows.length === 0) throw new NotFoundError(`Habit Entry not found`);
            if (rows.length === 1 && rows[0] !== undefined) return toHabitEntry(rows[0]);
            throw new Error(`Found more than one habit entry with predicate: ${predicate}`);
        } finally {
            if (connection) { connection.release(); }
        }
    }


    public async insertHabitEntry(habitEntry: HabitEntry): Promise<void> {
        
        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            await connection.execute(
                `INSERT INTO habit_entry (habit_entry_id, habit_id, user_id, entry_date, value)
                 VALUES (?, ?, ?, ?, ?);`,
                [
                    uuidToBuffer(habitEntry.id),
                    uuidToBuffer(habitEntry.habitID), 
                    uuidToBuffer(habitEntry.userID), 
                    habitEntry.entryDate,
                    habitEntry.value
                ]
            );
        } catch (error) {
            if (isMySQL2Error(error)) {
                switch (error.errno) {
                    case 1062: // duplicate entry
                        throw new ValidationError("Habit entry already exists for this date", { cause: error });                        
                }
            }
            throw error;
        } finally {
            if (connection) { connection.release(); }
        }
    }


    public async updateHabitEntry(habitEntryID: UUID, predicate: UpdatePredicate): Promise<void> {

        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            const [result, fields]: [ResultSetHeader, FieldPacket[]] = await connection.execute(
                `UPDATE habit_entry
                 SET ${predicate.statements.join(", ")}
                 WHERE habit_entry_id = ?;`,
                [...predicate.values, uuidToBuffer(habitEntryID)]
            );

            if (result.affectedRows === 0 && result.info.startsWith("Rows matched: 0")) {
                throw new NotFoundError(`Habit Entry not found [ID: ${habitEntryID}]`);             
            }
        } finally {
            if (connection) { connection.release(); }
        }
    }


    public async deleteHabitEntry(habitEntryID: UUID, userID: UUID): Promise<void> {

        const connection: PoolConnection = await this.mysql.getConnection();
        try {
            const [result, fields]: [ResultSetHeader, FieldPacket[]] = await connection.execute(
                `DELETE FROM habit_entry
                 WHERE habit_entry_id = ?
                 AND user_id = ?;`,
                [uuidToBuffer(habitEntryID), uuidToBuffer(userID)]
            );

            if (result.affectedRows === 0) {
                throw new NotFoundError(`Habit Entry not found [ID: ${habitEntryID}]`);
            }
        } finally {
            if (connection) { connection.release(); }
        }
    }
}