import Joi from "joi";

import { type InputUser } from "../types/user.types.js";

export const inputUserSchema = Joi.object<InputUser>({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
}).required().unknown(false);