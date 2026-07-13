import type { UUID } from "crypto";

import { bufferToUUID } from "../util/uuid.util.js";
import type { RowDataPacket } from "mysql2";

export interface HabitEntry {
    id: UUID,
    habitID: UUID,
    userID: UUID,
    entryDate: string,
    value: boolean
}

// in the case that there is a need to distinguish, 
// this type should be amended 
// and a "toPublicHabitEntry" function should be created
export type PublicHabitEntry = HabitEntry;

export type InputHabitEntry = Omit<HabitEntry, "id">;

export const toHabitEntry = (dbHabitEntry: RowDataPacket): HabitEntry => {
    return {
        id: bufferToUUID(dbHabitEntry.habit_entry_id),
        habitID: bufferToUUID(dbHabitEntry.habit_id),
        userID: bufferToUUID(dbHabitEntry.user_id),
        entryDate: dbHabitEntry.entry_date,
        value: dbHabitEntry.value === 1
    }
}