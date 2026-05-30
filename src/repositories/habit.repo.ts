import type { FieldPacket, Pool, PoolConnection, RowDataPacket } from "mysql2/promise";
import type { UUID } from "crypto";

import { db } from "../db.js";

import type { WherePredicate } from "../util/predicate.util.js";
import { toHabit, type Habit } from "../types/habit.types.js";



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
}