import Joi from "joi";

import { type LoginUser, type InputUser, type JwtPayloadUser } from "../types/user.types.js";

export const inputUserSchema = Joi.object<InputUser>({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
}).required().unknown(false);

export const loginUserSchema = Joi.object<LoginUser>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
}).required().unknown(false);

export const jwtPayloadSchema = Joi.object<JwtPayloadUser>({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    id: Joi.string().uuid().required(),
    iat: Joi.number(),
    exp: Joi.number()
}).required().unknown(false);