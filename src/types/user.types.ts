import type { UUID } from "crypto";
import type { RowDataPacket } from "mysql2";


export interface User {
    id: UUID,
    firstName: string,
    lastName: string,
    email: string,
    passwordHash: string,
    createdAt: Date
}

export type PublicUser = Pick<User, "id" | "firstName" | "lastName" | "email">;

export type InputUser = Pick<User, "firstName" | "lastName" | "email"> & {
    password: string
};

export type HashedUser = Pick<User, "firstName" | "lastName" | "email" | "passwordHash">;

export type LoginUser = Pick<User, "email"> & {
    password: string
}

export type JwtPayloadUser = PublicUser & {
    iat: number,
    exp: number
}

export type PredicateUser = Partial<User>;

export const toUser = (dbUser: RowDataPacket): User => {
    return {
        id: bufferToUUID(dbUser.user_id),
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        email: dbUser.email,
        passwordHash: dbUser.pw_hash,
        createdAt: dbUser.created_at
    }
}

export const bufferToUUID = (buffer: Buffer): UUID => {
    const hex = buffer.toString("hex");
    return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}`
}

export const uuidToBuffer = (uuid: UUID): Buffer => {
    return Buffer.from(uuid.replace(/-/g, ""), "hex");
}

export const toPublicUser = (user: User): PublicUser => {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    }
}