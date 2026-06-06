import Joi from "joi";
import type { InputHabit } from "../types/habit.types.js";

export const inputHabitSchema = Joi.object<InputHabit>({
    pillarID: Joi.string().uuid().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    active: Joi.boolean().required()
}).unknown(false);
