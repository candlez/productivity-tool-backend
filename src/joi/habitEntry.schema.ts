import JoiBase from "joi";
import JoiDate from "@joi/date";
import type { InputHabitEntry } from "../types/habitEntry.types.js";

const Joi = JoiBase.extend(JoiDate);

export const inputHabitEntrySchema = Joi.object({
    habitID: Joi.string().uuid().required(),
    entryDate: Joi.date().format('YYYY-MM-DD').raw().required(),
    value: Joi.boolean().required()
}).required().unknown(false);