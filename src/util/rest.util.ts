import type { Response } from "express";
import type { UUID } from "crypto";

import type { ApiErrorResponse, ApiResponse } from "../types/rest.types.js";


/**
 * helper function for sending data back to the client.
 * enforces a consistent structure.
 */
export const sendSuccess = (res: Response, value: ApiResponse<any>, status: number) => {
    return res.status(status).json(value);
}


export const sendOneItem = <T>(res: Response, value: T, id: UUID) => {
    const formatted: ApiResponse<T> = {
        status: "success",
        data: {
            id: id,
            items: [value]
        }
    }
    return sendSuccess(res, formatted, 200);
}


// prefer sendPage
export const sendArray = <T>(res: Response, value: T[]) => {
    const formatted: ApiResponse<T> = {
        status: "success",
        data: {
            items: value
        }
    }
    return sendSuccess(res, formatted, 200);
}


export const sendPage = <T>(res: Response, value: T[], currentItemCount: number, itemsPerPage: number, 
    startIndex: number, totalItems: number, pageIndex: number, totalPages: number) => {

        const formatted: ApiResponse<T> = {
            status: "success",
            data: {
                currentItemCount: currentItemCount,
                itemsPerPage: itemsPerPage,
                startIndex: startIndex,
                totalItems: totalItems,
                pageIndex: pageIndex,
                totalPages: totalPages,
                
                items: value
            }
        }
        return sendSuccess(res, formatted, 200);
}


export const sendCreated = <T>(res: Response, value: T, id: UUID) => {
    const formatted: ApiResponse<T> = {
        status: "success",
        data: {
            id: id,
            items: [value]
        }
    }
    return sendSuccess(res, formatted, 201);
}


export const sendDeleted = (res: Response) => {
    const formatted: ApiResponse<never> = {
        status: "success",
        data: {
            deleted: true
        }
    }
    return sendSuccess(res, formatted, 200);
}


export const sendError = (res: Response, value: ApiErrorResponse, status: number) => {
    return res.status(status).json(value);
}


export const sendOneError = (res: Response, error: Error, status: number) => {
    const formatted: ApiErrorResponse = {
        status: "error",
        error: {
            code: status,
            message: error.message
        }
    }
    return sendError(res, formatted, status)
}


export const sendErrors = (res: Response, errors: { message: string }[], message: string, status: number) => {
    if (errors.length === 0) {
        throw new Error("Errors list must not be empty");
    }
    const formatted: ApiErrorResponse = {
        status: "error",
        error: {
            code: status,
            message: message,
            errors: errors.map(error => ({ message: error.message }))
        }
    }
    return sendError(res, formatted, status);
}