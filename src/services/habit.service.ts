import type { UUID } from "crypto";

import type { HabitRepository } from "../repositories/habit.repo.js";
import type { Habit, InputHabit } from "../types/habit.types.js";
import type { PublicUser } from "../types/user.types.js";
import { ContextService } from "./context.service.js";
import { WherePredicate } from "../util/predicate.util.js";
import { uuidToBuffer } from "../util/uuid.util.js";
import type { IDService } from "./id.service.js";

export class HabitService {
    constructor(private habitRepository: HabitRepository, private idService: IDService) {}

    public async getHabits(): Promise<Habit[]> {
        
        const user: PublicUser = ContextService.verifyCallingUser();
        const predicate: WherePredicate = new WherePredicate();
        predicate.equalTo("user_id", uuidToBuffer(user.id));
        ContextService.getLogger().info(`Getting habits for user: ${user.id}`);

        const habits = await this.habitRepository.getHabits(predicate);
        return habits;
    }

    public async getHabitByID(habitID: UUID): Promise<Habit> {

        const user: PublicUser = ContextService.verifyCallingUser();
        const predicate: WherePredicate = new WherePredicate();
        predicate.equalTo("habit_id", uuidToBuffer(habitID));
        predicate.equalTo("user_id", uuidToBuffer(user.id));

        ContextService.getLogger().info(`Getting habit: ${habitID} for user: ${user.id}`);
        return await this.habitRepository.getOneHabit(predicate);
    }

    public async createHabit(inputHabit: InputHabit): Promise<Habit> {

        const id: UUID = this.idService.createUUID();
        const createdAt: Date = new Date();
        const habit: Habit = {
            id: id,
            userID: inputHabit.userID,
            pillarID: inputHabit.pillarID,
            name: inputHabit.name,
            description: inputHabit.description,
            active: inputHabit.active,
            createdAt: createdAt
        }

        ContextService.getLogger().info(`Creating habit: ${id} for user: ${inputHabit.userID}`);
        await this.habitRepository.insertHabit(habit);
        return habit;
    }
}