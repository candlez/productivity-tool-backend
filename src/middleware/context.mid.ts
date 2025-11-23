import type { Request, Response, NextFunction, RequestHandler } from "express";

import { type RequestContext } from "../types/context.types.js";
import { ContextService } from "../services/context.service.js";

import { logger } from "../logger.js";


export const initializeContext: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const requestID: string = req.id as string;

    const ctx: RequestContext = {
        requestID,
        logger: logger.child({ requestID })
    }
    ContextService.runWithContext(ctx, async () => {
        next();
    });
}