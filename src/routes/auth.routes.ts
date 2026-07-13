import { Router } from "express";
import type { ValidationResult } from "joi";

import { UserRepository } from "../repositories/user.repo.js";
import { UserService } from "../services/user.service.js";
import { AuthService } from "../services/auth.service.js";
import { inputUserSchema, loginUserSchema } from "../joi/user.schema.js";
import { type InputUser, type PublicUser } from "../types/user.types.js";
import { IDService } from "../services/id.service.js";
import { parseToken } from "../middleware/auth.mid.js";
import { sendDeleted, sendOneItem } from "../util/rest.util.js";
import { JoiValidationError } from "../types/error.types.js";
import { ContextService } from "../services/context.service.js";


export const authRouter: Router = Router();

// manual dependency injection
const userRepo = new UserRepository();
const idService = new IDService();
const userService = new UserService(userRepo, idService);
const authService = new AuthService(userService);

/** 
 * sign up for an account
 */
authRouter.post("/signup", async (req, res) => {
    const validation: ValidationResult<InputUser> = inputUserSchema.validate(req.body);

    if (validation.error) {
        throw new JoiValidationError("Server encountered invalid data", validation.error.details);
    }

    let user: PublicUser = await authService.signup(validation.value);
    return sendOneItem<PublicUser>(res, user, user.id);
});

/**
 * log in with username and password
 * make sure not to send requests with unencrypted passwords
 */
authRouter.post("/login", async (req, res) => {
    const validation: ValidationResult = loginUserSchema.validate(req.body);

    if (validation.error) {
        throw new JoiValidationError("Server encountered invalid data", validation.error.details);
    }

    const [token, user]: [string, PublicUser] = await authService.login(validation.value);
    res.cookie(AuthService.TOKEN_NAME, token, { httpOnly: true, maxAge: AuthService.MAX_AGE * 1000 }); // 3 days in milliseconds

    return sendOneItem<PublicUser>(res, user, user.id)
});

authRouter.post("/logout", async (req, res) => {
    res.cookie(AuthService.TOKEN_NAME, "", { httpOnly: true, maxAge: 1 });

    return sendDeleted(res);
});

// TODO eventually, there needs to be a way to reset your password


// these routes need to be protected
// adding this middleware here ensures that only the routes below require authentication
authRouter.use(parseToken);

/**
 * return user profile
 */
authRouter.get("/me", (req, res) => {
    const user: PublicUser = ContextService.getCallingUser()!;
    return sendOneItem<PublicUser>(res, user, user.id)
});

/**
 * delete user profile
 */
authRouter.delete("/me", async (req, res) => {
    const user: PublicUser = ContextService.getCallingUser()!;
    await userService.deleteUser(user.id);
    return sendDeleted(res);
});

