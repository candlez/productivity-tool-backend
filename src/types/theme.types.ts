import type { UUID } from "crypto";
import type { RowDataPacket } from "mysql2/promise";

import { bufferToUUID } from "../util/uuid.util.js";


export interface Theme {
    id: UUID
}

export type PublicTheme = Pick<Theme, "id">;

export const toTheme = (dbTheme: RowDataPacket): Theme => {
    return {
        id: bufferToUUID(dbTheme.theme_id),
    }
}

export const toPublicTheme = (theme: Theme): PublicTheme => {
    return {
        id: theme.id
    }
}
