import { Router } from "express";
import type { ValidationResult } from "joi";
import Joi from "joi";
import type { UUID } from "crypto";

import { parseToken } from "../middleware/auth.mid.js";
import { HabitRepository } from "../repositories/habit.repo.js";
import { HabitService } from "../services/habit.service.js";
import type { Habit, InputHabit, PublicHabit } from "../types/habit.types.js";
import { sendArray, sendCreated, sendOneItem } from "../util/rest.util.js";
import { inputHabitSchema } from "../joi/habit.schema.js";
import { JoiValidationError } from "../types/error.types.js";
import { ContextService } from "../services/context.service.js";
import { IDService } from "../services/id.service.js";

export const habitRouter: Router = Router();

habitRouter.use(parseToken);

// manual dependency injection
const habitRepository: HabitRepository = new HabitRepository();
const idService = new IDService();
const habitService: HabitService = new HabitService(habitRepository, idService);


habitRouter.get("/", async (req, res) => {
    const habits: Habit[] = await habitService.getHabits();
    const publicHabits: PublicHabit[] = habits;
    return sendArray<PublicHabit>(res, publicHabits);
});


habitRouter.post("/", async (req, res) => {
    const validation: ValidationResult<InputHabit> = inputHabitSchema.validate(req.body);

    if (validation.error) {
        throw new JoiValidationError("Server encountered invalid data in the request body", validation.error.details);
    }

    // the Joi schema does not include the userID because that is provided by the token
    validation.value.userID = ContextService.getCallingUser()!.id;

    const habit: Habit = await habitService.createHabit(validation.value);
    const publicHabit: PublicHabit = habit;
    return sendCreated(res, publicHabit, publicHabit.id);
});


const pathParamSchema = Joi.object<{ habitID: UUID }>({
    habitID: Joi.string().uuid().required()
}).unknown(false);


habitRouter.get("/:habitID", async (req, res) => {
    const validation: ValidationResult<{ habitID: UUID }> = pathParamSchema.validate(req.params);
    
    if (validation.error) {
        throw new JoiValidationError("Server encountered invalid data in the request parameters", validation.error.details);
    }

    const habit: Habit = await habitService.getHabitByID(validation.value.habitID);
    const publicHabit: PublicHabit = habit;
    return sendOneItem(res, publicHabit, publicHabit.id);
});


habitRouter.put("/:habitID", async (req, res) => {

});


habitRouter.delete("/:habitID", async (req, res) => {

});