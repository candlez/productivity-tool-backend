import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import type { Logger } from "pino";

import { sendError, sendErrors, sendOneError } from "../util/rest.util.js";
import type { ApiErrorResponse } from "../types/rest.types.js";
import { ForbiddenError, JoiValidationError, NotFoundError, UnauthorizedError, ValidationError } from "../types/error.types.js";
import { ContextService } from "../services/context.service.js";
import { logger } from "../logger.js";


export const finalHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let log: Logger;

    if (ContextService.hasContext()) {
        log = ContextService.getLogger();
    } else {
        log = logger;
    }

    log.error(err, "An unexpected error has occurred");

    const formatted: ApiErrorResponse = {
        status: "error",
        error: {
            code: 500,
            message: "An error occurred unexpectedly"
        }
    }
    return sendError(res, formatted, 500);
}


export const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof JoiValidationError) {
        return sendErrors(res, err.details, err.message, 400);
    }
    if (err instanceof ValidationError) {
        return sendOneError(res, err, 400);
    }
    if (err instanceof UnauthorizedError) {
        return sendOneError(res, err, 401);
    }
    if (err instanceof ForbiddenError) {
        return sendOneError(res, err, 403);
    }
    if (err instanceof NotFoundError) {
        return sendOneError(res, err, 404);
    }
    if (err instanceof SyntaxError) {
        return sendOneError(res, err, 400)
    }

    next(err);
}