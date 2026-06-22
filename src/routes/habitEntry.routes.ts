import { Router } from "express";
import Joi, { type ValidationResult } from "joi";
import type { UUID } from "crypto";


import { parseToken } from "../middleware/auth.mid.js";
import { HabitEntryRepository } from "../repositories/habitEntry.repo.js";
import { IDService } from "../services/id.service.js";
import { HabitEntryService } from "../services/habitEntry.service.js";
import type { HabitEntry, InputHabitEntry, PublicHabitEntry } from "../types/habitEntry.types.js";
import { sendArray, sendCreated, sendDeleted, sendOneItem } from "../util/rest.util.js";
import { JoiValidationError } from "../types/error.types.js";
import { ContextService } from "../services/context.service.js";
import { inputHabitEntrySchema } from "../joi/habitEntry.schema.js";


export const habitEntryRouter: Router = Router();

habitEntryRouter.use(parseToken);

// manual dependency injection
const habitEntryRepository = new HabitEntryRepository();
const idService = new IDService();
const habitEntryService = new HabitEntryService(habitEntryRepository, idService);

habitEntryRouter.get("/", async (req, res) => {
    const habitEntries: HabitEntry[] = await habitEntryService.getHabitEntries();
    const publicHabitEntries: PublicHabitEntry[] = habitEntries;
    return sendArray<PublicHabitEntry>(res, publicHabitEntries);
});


habitEntryRouter.post("/", async (req, res) => {
    const validation: ValidationResult<any> = inputHabitEntrySchema.validate(req.body);

    if (validation.error) {
        throw new JoiValidationError("Server encountered invalid data in the request body", validation.error.details);
    }

    const inputHabitEntry: InputHabitEntry = validation.value as InputHabitEntry;

    // the Joi schema does not include the userID because that is provided by the token
    inputHabitEntry.userID = ContextService.getCallingUser()!.id;

    const habitEntry: HabitEntry = await habitEntryService.createHabitEntry(inputHabitEntry);
    const publicHabitEntry: PublicHabitEntry = habitEntry;
    return sendCreated(res, publicHabitEntry, publicHabitEntry.id);
});


const pathParamSchema = Joi.object<{ habitEntryID: UUID }>({
    habitEntryID: Joi.string().uuid().required()
}).unknown(false);


habitEntryRouter.get("/:habitEntryID", async (req, res) => {
    const validation: ValidationResult<{ habitEntryID: UUID }> = pathParamSchema.validate(req.params);

    if (validation.error) {
        throw new JoiValidationError("Server encountered invalid data in the request parameters", validation.error.details);
    }

    const habitEntry: HabitEntry = await habitEntryService.getHabitEntryByID(validation.value.habitEntryID);
    const publicHabitEntry: PublicHabitEntry = habitEntry;
    return sendOneItem(res, publicHabitEntry, publicHabitEntry.id);
});


habitEntryRouter.put("/:habitEntryID", async (req, res) => {
    const paramValidation: ValidationResult<{ habitEntryID: UUID }> = pathParamSchema.validate(req.params);

    if (paramValidation.error) {
        throw new JoiValidationError("Server encountered invalid data in the request parameters", paramValidation.error.details);
    }

    const bodyValidation: ValidationResult<any> = inputHabitEntrySchema.validate(req.body);

    if (bodyValidation.error) {
        throw new JoiValidationError("Server encountered invalid data in the request body", bodyValidation.error.details);
    }

    const inputHabitEntry: InputHabitEntry = bodyValidation.value as InputHabitEntry;

    inputHabitEntry.userID = ContextService.verifyCallingUser().id;
    const updatedHabitEntry: HabitEntry = await habitEntryService.updateHabitEntry(paramValidation.value.habitEntryID, inputHabitEntry);
    const publicHabitEntry: PublicHabitEntry = updatedHabitEntry;
    return sendOneItem(res, publicHabitEntry, publicHabitEntry.id);
});


habitEntryRouter.delete("/:habitEntryID", async (req, res) => {
    const validation: ValidationResult<{ habitEntryID: UUID }> = pathParamSchema.validate(req.params);

    if (validation.error) {
        throw new JoiValidationError("Server encountered invalid data in the request parameters", validation.error.details);
    }

    await habitEntryService.deleteHabitEntry(validation.value.habitEntryID);
    return sendDeleted(res);
});