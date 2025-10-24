import "express";
import type { UUID } from "crypto";


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