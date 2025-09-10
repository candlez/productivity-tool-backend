import type { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { ValidationResult } from "joi";

import { environment } from "../environment.js";
import { AuthService } from "../services/auth.service.js";
import { jwtPayloadSchema } from "../joi/user.schema.js";
import type { JwtPayloadUser } from "../types/user.types.js";


// need a middleware to parse tokens for auth protected routes
export const parseToken: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies[AuthService.TOKEN_NAME];

    if (!token) {
        // TODO format these errors
        return res.status(403).send("Access Denied");
    }

    try {
        const user = jwt.verify(token, environment.JWT_SECRET)as JwtPayload;
        const validation: ValidationResult<JwtPayloadUser> = jwtPayloadSchema.validate(user);

        if (validation.error) {
            return res.status(403).send("Access Denied");
        }

        req.user = {
            id: validation.value.id,
            firstName: validation.value.firstName,
            lastName: validation.value.lastName,
            email: validation.value.email
        };
        next();
    } catch (error) {
        return res.status(403).send("Access Denied");
    }
}