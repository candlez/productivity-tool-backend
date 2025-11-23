import type { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { ValidationResult } from "joi";

import { environment } from "../environment.js";
import { AuthService } from "../services/auth.service.js";
import { jwtPayloadSchema } from "../joi/user.schema.js";
import type { JwtPayloadUser, PublicUser } from "../types/user.types.js";
import { UnauthorizedError } from "../types/error.types.js";
import { ContextService } from "../services/context.service.js";
import type { RequestContext } from "../types/context.types.js";


/**
 * parses a JWT and attaches a User to the Request object for use downstream
 * // TODO implement access tiers
 */
export const parseToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies[AuthService.TOKEN_NAME];

    if (!token) {
        return next(new UnauthorizedError("Token not found"));
    }

    try {
        const user = jwt.verify(token, environment.JWT_SECRET) as JwtPayload;
        const validation: ValidationResult<JwtPayloadUser> = jwtPayloadSchema.validate(user);

        if (validation.error) {
            ContextService.getLogger().error({error: validation.error.message}, "Encountered token that was malformed and correctly signed");
            return next(new UnauthorizedError("Invalid token"));
        }

        const publicUser: PublicUser = {
            id: validation.value.id,
            firstName: validation.value.firstName,
            lastName: validation.value.lastName,
            email: validation.value.email
        };

        ContextService.setCallingUser(publicUser);
        return next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new UnauthorizedError("Invalid token", { cause: error }));
        }
        return next(error);
    }
}