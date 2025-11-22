import type { UUID } from "crypto";

import { bufferToUUID } from "../util/uuid.util.js";
import type { RowDataPacket } from "mysql2";


export interface Pillar {
    id: UUID,
    userID: UUID,
    name: string,
    themeID: UUID,
    description: string,
    maxScore: number,
    active: boolean,
    createdAt: Date
}

export type PublicPillar = Pillar; // in the case that there is a need to distinguish, 
                                   // this type should be amended 
                                   // and a "toPublicPillar" function should be created

export type InputPillar = Omit<Pillar, "id" | "createdAt">;


export const toPillar = (dbPillar: RowDataPacket): Pillar => {
    return {
        id: bufferToUUID(dbPillar.pillar_id),
        userID: bufferToUUID(dbPillar.user_id),
        name: dbPillar.name,
        themeID: bufferToUUID(dbPillar.theme_id),
        description: dbPillar.description,
        maxScore: dbPillar.max_score,
        active: dbPillar.active === 1,
        createdAt: dbPillar.created_at
    }
}