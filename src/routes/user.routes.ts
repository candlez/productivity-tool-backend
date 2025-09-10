import { Router } from "express";
import { type ValidationResult } from "joi";

import { UserRepository } from "../repositories/user.repo.js";
import { UserService } from "../services/user.service.js";
import { type InputUser, type PublicUser } from "../types/user.types.js";
import { inputUserSchema } from "../joi/user.schema.js";
import { AuthService } from "../services/auth.service.js";
import { IDService } from "../services/id.service.js";
import { parseToken } from "../middleware/auth.mid.js";


export const userRouter: Router = Router();

userRouter.use(parseToken);

// manual dependency injection
const userRepo = new UserRepository();
const idService = new IDService();
const userService = new UserService(userRepo, idService);
const authService = new AuthService(userService);

// these routes will require admin access, which has not yet been implemented in the database
// TODO add access tiers to the DB and whatnot
userRouter.get("/", async (req, res) => {
    let users: PublicUser[] = await userService.getAllUsers();
    return res.send(users);
});


userRouter.post("/", async (req, res) => {
    const validation: ValidationResult<InputUser> = inputUserSchema.validate(req.body);

    if (validation.error) {
        return res.status(400).json(validation.error);
    }
    

    let user: PublicUser = await authService.signup(validation.value);
    return res.send(user);
});


userRouter.get("/:userId", (req, res) => {

});


userRouter.put("/:userId", (req, res) => {

});

userRouter.delete("/:userId", (req, res) => {

});