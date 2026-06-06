import Joi from "joi";
import type { InputPillar } from "../types/pillar.types.js";

export const inputPillarSchema = Joi.object<InputPillar>({
    name: Joi.string().required(),
    themeID: Joi.string().uuid().required(),
    description: Joi.string().required(),
    maxScore: Joi.number().required(),
    active: Joi.boolean().required(),
}).required().unknown(false);