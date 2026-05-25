import type { UUID } from "crypto";

import type { HabitRepository } from "../repositories/habit.repo.js";
import type { Habit } from "../types/habit.types.js";
import type { PublicUser } from "../types/user.types.js";
import { ContextService } from "./context.service.js";
import { WherePredicate } from "../util/predicate.util.js";
import { uuidToBuffer } from "../util/uuid.util.js";

export class HabitService {
    constructor(private habitRepository: HabitRepository) {}

    public async getHabits(): Promise<Habit[]> {
        
        const user: PublicUser = ContextService.verifyCallingUser();
        const predicate: WherePredicate = new WherePredicate();
        predicate.equalTo("user_id", uuidToBuffer(user.id));
        ContextService.getLogger().info(`Getting habits for user: ${user.id}`);

        const habits = await this.habitRepository.getHabits(predicate);
        return habits;
    }
}