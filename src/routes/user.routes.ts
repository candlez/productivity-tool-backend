import { Router } from "express";
import { type ValidationResult } from "joi";

import { UserRepository } from "../repositories/user.repo.js";
import { UserService } from "../services/user.service.js";
import { type InputUser, type PublicUser } from "../types/user.types.js";
import { inputUserSchema } from "../joi/user.schema.js";
import { AuthService } from "../services/auth.service.js";
import { IDService } from "../services/id.service.js";


export const userRouter: Router = Router();

// manual dependency injection
const userRepo = new UserRepository();
const idService = new IDService();
const userService = new UserService(userRepo, idService);
const authService = new AuthService(userService);

// these routes will require admin access, which has not yet been implemented in the database
userRouter.get("/api/users", async (req, res) => {
    let users: PublicUser[] = await userService.getAllUsers();
    return res.send(users);
});


userRouter.post("/api/users", async (req, res) => {
    const validation: ValidationResult<InputUser> = inputUserSchema.validate(req.body);

    if (validation.error) {
        return res.status(400).json(validation.error);
    }
    

    let user: PublicUser = await authService.signup(validation.value);
    return res.send(user);
});


userRouter.get("/api/users/:userId", (req, res) => {

});


userRouter.put("/api/users/:userId", (req, res) => {

});

userRouter.delete("/api/users/:userId", (req, res) => {

});