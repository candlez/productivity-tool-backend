import { Router } from "express";
import type { ValidationResult } from "joi";

import { UserRepository } from "../repositories/user.repo.js";
import { UserService } from "../services/user.service.js";
import { AuthService } from "../services/auth.service.js";
import { inputUserSchema, loginUserSchema } from "../joi/user.schema.js";
import { type InputUser, type PublicUser } from "../types/user.types.js";
import { IDService } from "../services/id.service.js";


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
        return res.status(400).json(validation.error);
    }

    let user: PublicUser = await authService.signup(validation.value);
    return res.json(user);
});

/**
 * log in with username and password
 * make sure not to send requests with unencrypted passwords
 */
authRouter.post("/login", async (req, res) => {
    const validation: ValidationResult = loginUserSchema.validate(req.body);

    if (validation.error) {
        return res.status(400).json(validation.error);
    }

    const [token, user]: [string, PublicUser] = await authService.login(validation.value);
    res.cookie(AuthService.TOKEN_NAME, token, { httpOnly: true, maxAge: AuthService.MAX_AGE * 1000 }) // 3 days in milliseconds

    return res.json(user)
});


// these two routes need to be protected

/**
 * return user profile
 */
authRouter.get("/me", (req, res) => {

});

/**
 * delete user profile
 */
authRouter.delete("/me", (req, res) => {

});

