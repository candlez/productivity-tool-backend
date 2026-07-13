import type { UUID } from "crypto";

import type { HabitEntryRepository } from "../repositories/habitEntry.repo.js";
import type { IDService } from "./id.service.js";
import { ContextService } from "./context.service.js";
import type { PublicUser } from "../types/user.types.js";
import { UpdatePredicate, WherePredicate } from "../util/predicate.util.js";
import { uuidToBuffer } from "../util/uuid.util.js";
import type { HabitEntry, InputHabitEntry } from "../types/habitEntry.types.js";


export class HabitEntryService {
    constructor(private habitEntryRepository: HabitEntryRepository, private idService: IDService) {}

    public async getHabitEntries(): Promise<HabitEntry[]> {
        
        const user: PublicUser = ContextService.verifyCallingUser();
        const predicate: WherePredicate = new WherePredicate();
        predicate.equalTo("user_id", uuidToBuffer(user.id));
        ContextService.getLogger().info(`Getting habit entries for user: ${user.id}`);

        const habitEntries = await this.habitEntryRepository.getHabitEntries(predicate);
        return habitEntries;
    }


    public async getHabitEntryByID(habitEntryID: UUID): Promise<HabitEntry> {

        const user: PublicUser = ContextService.verifyCallingUser();
        const predicate: WherePredicate = new WherePredicate();
        predicate.equalTo("habit_entry_id", uuidToBuffer(habitEntryID));
        predicate.equalTo("user_id", uuidToBuffer(user.id));

        ContextService.getLogger().info(`Getting habit entry: ${habitEntryID} for user: ${user.id}`);
        return await this.habitEntryRepository.getOneHabitEntry(predicate);
    }


    public async createHabitEntry(inputHabitEntry: InputHabitEntry): Promise<HabitEntry> {

        const id: UUID = this.idService.createUUID();
        const habitEntry: HabitEntry = {
            id: id,
            habitID: inputHabitEntry.habitID,
            userID : inputHabitEntry.userID,
            entryDate: inputHabitEntry.entryDate,
            value: inputHabitEntry.value
        }

        ContextService.getLogger().info(`Creating habit entry: ${id} for user: ${inputHabitEntry.userID}`);
        await this.habitEntryRepository.insertHabitEntry(habitEntry);

        return habitEntry;
    }


    public async updateHabitEntry(habitEntryID: UUID, inputHabitEntry: InputHabitEntry): Promise<HabitEntry> {

        const predicate = new UpdatePredicate();
        predicate.equalTo("habit_id", uuidToBuffer(inputHabitEntry.habitID));
        predicate.equalTo("user_id", uuidToBuffer(inputHabitEntry.userID));
        predicate.equalTo("entry_date", inputHabitEntry.entryDate);
        predicate.equalTo("value", inputHabitEntry.value);

        ContextService.getLogger().info(`Updating habit entry: ${habitEntryID} for user: ${inputHabitEntry.userID}`);
        await this.habitEntryRepository.updateHabitEntry(habitEntryID, predicate);

        const habitEntry: HabitEntry = await this.getHabitEntryByID(habitEntryID);

        return habitEntry;
    }


    public async deleteHabitEntry(habitEntryID: UUID): Promise<void> {

        const user: PublicUser = ContextService.verifyCallingUser(); 
        ContextService.getLogger().info(`Deleting habit entry: ${habitEntryID} for user: ${user.id}`);
        await this.habitEntryRepository.deleteHabitEntry(habitEntryID, user.id);
    }
}