import type { RowDataPacket } from "mysql2";


export interface User {
    id: string,
    firstName: string,
    lastName: string,
    email: string
}

export const mapUser = (dbUser: RowDataPacket): User => {
    return {
        // TODO finish this
        id: dbUser.user_id,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        email: dbUser.email
    }
}