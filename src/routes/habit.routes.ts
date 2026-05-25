import { Router } from "express";
import type { ValidationResult } from "joi";
import Joi from "joi";
import type { UUID } from "crypto";

import { parseToken } from "../middleware/auth.mid.js";
import { HabitRepository } from "../repositories/habit.repo.js";
import { HabitService } from "../services/habit.service.js";
import type { Habit, PublicHabit } from "../types/habit.types.js";
import { sendArray } from "../util/rest.util.js";

export const habitRouter: Router = Router();

habitRouter.use(parseToken);

// manual dependency injection
const habitRepository: HabitRepository = new HabitRepository();
const habitService: HabitService = new HabitService(habitRepository);


habitRouter.get("/", async (req, res) => {
    const habits: Habit[] = await habitService.getHabits();
    const publicHabits: PublicHabit[] = habits;
    return sendArray<PublicHabit>(res, publicHabits);
});


habitRouter.post("/", async (req, res) => {

});


const pathParamSchema = Joi.object<{ habitID: UUID }>({
    habitID: Joi.string().uuid().required()
}).unknown(false);


habitRouter.get("/:habitID", async (req, res) => {

});


habitRouter.put("/:habitID", async (req, res) => {

});


habitRouter.delete("/:habitID", async (req, res) => {

});