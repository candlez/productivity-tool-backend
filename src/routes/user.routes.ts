import { Router } from "express";
import { UserRepository } from "../repositories/user.repo.js";
import { UserService } from "../services/user.service.js";
import type { User } from "../types/user.types.js";


export const userRouter: Router = Router();

// manual dependency injection
const userRepo = new UserRepository();
const userService = new UserService(userRepo);

// these routes will require admin access, which has not yet been implemented in the database
userRouter.get("/api/users", async (req, res) => {
    let users: User[] = await userService.getAllUsers();
    return res.send(users);
});


userRouter.post("/api/users", (req, res) => {

});


userRouter.get("/api/users/:userId", (req, res) => {

});


userRouter.put("/api/users/:userId", (req, res) => {

});

userRouter.delete("/api/users/:userId", (req, res) => {

});