import type { Pool } from "mysql2/promise";
import type { UUID } from "crypto";

import { db } from "../db.js";

import type { WherePredicate } from "../util/predicate.util.js";



export class HabitRepository {
    constructor(private mysql: Pool = db) {}

    public async getHabits(predicate: WherePredicate) {

    }
}