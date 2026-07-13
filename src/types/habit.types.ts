import type { UUID } from "crypto";

import { bufferToUUID } from "../util/uuid.util.js";
import type { RowDataPacket } from "mysql2";

export interface Habit {
    id: UUID,
    userID: UUID,
    pillarID: UUID,
    name: string,
    description: string,
    active: boolean,
    createdAt: Date
}

export type PublicHabit = Habit; // in the case that there is a need to distinguish, 
                                 // this type should be amended 
                                 // and a "toPublicHabit" function should be created

export type InputHabit = Omit<Habit, "id" | "createdAt">;


export const toHabit = (dbHabit: RowDataPacket): Habit => {
    return {
        id: bufferToUUID(dbHabit.habit_id),
        userID: bufferToUUID(dbHabit.user_id),
        pillarID: bufferToUUID(dbHabit.pillar_id),
        name: dbHabit.name,
        description: dbHabit.description,
        active: dbHabit.active === 1,
        createdAt: dbHabit.created_at
    }
}