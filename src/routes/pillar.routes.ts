import { Router } from "express";
import type { ValidationResult } from "joi";

import { parseToken } from "../middleware/auth.mid.js";
import { PillarRepository } from "../repositories/pillar.repo.js";
import { PillarService } from "../services/pillar.service.js";
import type { InputPillar, Pillar, PublicPillar } from "../types/pillar.types.js";
import { sendArray, sendCreated, sendDeleted, sendOneItem } from "../util/rest.util.js";
import { ContextService } from "../services/context.service.js";
import { IDService } from "../services/id.service.js";
import { inputPillarSchema } from "../joi/pillar.schema.js";
import { JoiValidationError } from "../types/error.types.js";
import Joi from "joi";
import type { UUID } from "crypto";


export const pillarRouter: Router = Router();

pillarRouter.use(parseToken);

// manual dependency injection
const pillarRepository = new PillarRepository();
const idService = new IDService();
const pillarService = new PillarService(pillarRepository, idService);


pillarRouter.get("/", async (req, res) => {
    const pillars: Pillar[] = await pillarService.getPillars();
    const publicPillars: PublicPillar[] = pillars; // no need to map as there is no difference
    return sendArray<PublicPillar>(res, publicPillars);
});


pillarRouter.post("/", async (req, res) => {
    const validation: ValidationResult<InputPillar> = inputPillarSchema.validate(req.body);

    if (validation.error) {
        throw new JoiValidationError("Server encountered invalid data in the request body", validation.error.details);
    }

    // the Joi schema does not include the userID because that is provided by the token
    validation.value.userID = ContextService.getCallingUser()!.id;

    const pillar: Pillar = await pillarService.createPillar(validation.value);
    const publicPillar: PublicPillar = pillar;
    return sendCreated(res, publicPillar, publicPillar.id);
});


const pathParamSchema = Joi.object<{ pillarID: UUID }>({
    pillarID: Joi.string().uuid().required()
}).unknown(false);


pillarRouter.get("/:pillarID", async (req, res) => {
    const validation: ValidationResult<{ pillarID: UUID }> = pathParamSchema.validate(req.params);

    if (validation.error) {
        throw new JoiValidationError("Server encountered invalid data in the request parameters", validation.error.details);
    }

    const pillar: Pillar = await pillarService.getPillarByID(validation.value.pillarID);
    const publicPillar: PublicPillar = pillar;
    return sendOneItem(res, publicPillar, publicPillar.id);
});


pillarRouter.put("/:pillarID", async (req, res) => {
    const paramValidation: ValidationResult<{ pillarID: UUID }> = pathParamSchema.validate(req.params);

    if (paramValidation.error) {
        throw new JoiValidationError("Server encountered invalid data in the request parameters", paramValidation.error.details);
    }

    const bodyValidation: ValidationResult<InputPillar> = inputPillarSchema.validate(req.body);

    if (bodyValidation.error) {
        throw new JoiValidationError("Server encountered invalid data in the request body", bodyValidation.error.details);
    }

    const updatedPillar: Pillar = await pillarService.updatePillar(paramValidation.value.pillarID, bodyValidation.value);
    const publicPillar: PublicPillar = updatedPillar;
    return sendOneItem(res, publicPillar, publicPillar.id);
});


pillarRouter.delete("/:pillarID", async (req, res) => {
    const validation: ValidationResult<{ pillarID: UUID }> = pathParamSchema.validate(req.params);

    if (validation.error) {
        throw new JoiValidationError("Server encountered invalid data in the request parameters", validation.error.details);
    }

    await pillarService.deletePillar(validation.value.pillarID);
    return sendDeleted(res);
});