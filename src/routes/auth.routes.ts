import { Router } from "express";
import type { ValidationResult } from "joi";

import { UserRepository } from "../repositories/user.repo.js";
import { UserService } from "../services/user.service.js";
import { AuthService } from "../services/auth.service.js";
import { inputUserSchema } from "../joi/user.schema.js";
import { type InputUser } from "../types/user.types.js";
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
authRouter.post("/api/auth/signup", async (req, res) => {
    const validation: ValidationResult<InputUser> = inputUserSchema.validate(req.body);

    if (validation.error) {
        return res.status(400).json(validation.error);
    }

    let user = await authService.signup(validation.value);
    return res.send(user);
});

/**
 * log in with username and password
 * make sure not to send requests with unencrypted passwords
 */
authRouter.post("/api/auth/login", (req, res) => {

});


// these two routes need to be protected

/**
 * return user profile
 */
authRouter.get("/api/auth/me", (req, res) => {

});

/**
 * delete user profile
 */
authRouter.delete("/api/auth/me", (req, res) => {

});

