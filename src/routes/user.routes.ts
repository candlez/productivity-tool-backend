import { Router } from "express";
import Joi, { type ValidationResult } from "joi";
import type { UUID } from "crypto";

import { UserRepository } from "../repositories/user.repo.js";
import { UserService } from "../services/user.service.js";
import { toPublicUser, type HashedUser, type InputUser, type PublicUser, type User } from "../types/user.types.js";
import { inputUserSchema } from "../joi/user.schema.js";
import { AuthService } from "../services/auth.service.js";
import { IDService } from "../services/id.service.js";
import { parseToken } from "../middleware/auth.mid.js";
import { sendArray, sendCreated, sendDeleted, sendOneItem } from "../util/rest.util.js";
import { JoiValidationError, NotFoundError } from "../types/error.types.js";
import { ContextService } from "../services/context.service.js";


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
    const users: User[] = await userService.getAllUsers();
    const publicUsers: PublicUser[] = users.map(toPublicUser);
    return sendArray<PublicUser>(res, publicUsers);
});


userRouter.post("/", async (req, res) => {
    const validation: ValidationResult<InputUser> = inputUserSchema.validate(req.body);

    if (validation.error) {
        throw new JoiValidationError("Server encountered invalid data in the request body", validation.error.details);
    }
    

    let user: PublicUser = await authService.signup(validation.value);
    return sendCreated<PublicUser>(res, user, user.id);
});


const pathParamSchema = Joi.object<{ userId: UUID }>({
    userId: Joi.string().uuid().required()
}).unknown(false);


userRouter.get("/:userId", async (req, res) => {
    const validation: ValidationResult<{ userId: UUID }> = pathParamSchema.validate(req.params);

    if (validation.error) {
        throw new JoiValidationError("Server encountered invalid data in the request parameters", validation.error.details);
    }

    const user = await userService.getUserById(validation.value.userId);

    if (user === null) {
        throw new NotFoundError(`User not found [ID: ${validation.value.userId}]`)
    }

    return sendOneItem(res, user, user.id);
});


userRouter.put("/:userId", async (req, res) => { // this is for submitting whole users (InputUser)
    const paramValidation: ValidationResult<{ userId: UUID }> = pathParamSchema.validate(req.params);

    if (paramValidation.error) {
        throw new JoiValidationError("Server encountered invalid data in the request parameters", paramValidation.error.details);
    }

    const bodyValidation: ValidationResult<InputUser> = inputUserSchema.validate(req.body);

    if (bodyValidation.error) {
        throw new JoiValidationError("Server encountered invalid data in the request body", bodyValidation.error.details);
    }

    const hashedUser: HashedUser = await authService.hashUser(bodyValidation.value)
    await userService.updateUser(paramValidation.value.userId, hashedUser);

    const newUser: PublicUser = {
        id: paramValidation.value.userId,
        firstName: hashedUser.firstName,
        lastName: hashedUser.lastName,
        email: hashedUser.email
    }

    if (newUser.id === ContextService.getCallingUser()!.id) {
        // we have to refresh the cookie because the user's details have changed
        const token = authService.generateToken(newUser);
        res.cookie(AuthService.TOKEN_NAME, token, { httpOnly: true, maxAge: AuthService.MAX_AGE * 1000 }); // 3 days in milliseconds
    }

    return sendOneItem(res, newUser, newUser.id);
});

userRouter.delete("/:userId", async (req, res) => {
    const validation: ValidationResult<{ userId: UUID }> = pathParamSchema.validate(req.params);

    if (validation.error) {
        throw new JoiValidationError("Server encountered invalid data in the request parameters", validation.error.details);
    }

    await userService.deleteUser(validation.value.userId);

    return sendDeleted(res);
});