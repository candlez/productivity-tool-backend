import "express";
import type { UUID } from "crypto";

import type { PublicUser } from "./user.types.js";

// here I am adding an optional user field to the Request object for authentication
declare module "express-serve-static-core" {
    interface Request {
        user?: PublicUser;
    }
}


export interface ApiResponse<T> {
    status: "success"
    data: {
        currentItemCount?: number,
        itemsPerPage?: number,
        startIndex?: number,
        totalItems?: number,
        pageIndex?: number
        totalPages?: number,

        deleted?: true,

        id?: UUID,
        items?: T[]
    }
}


export interface ApiErrorResponse {
    status: "error",
    error: {
        code: number,
        message: string,
        errors?: {
            message: string
        }[]
    }
}