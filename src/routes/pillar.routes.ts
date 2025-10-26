import { Router } from "express";
import type { ValidationResult } from "joi";

import { parseToken } from "../middleware/auth.mid.js";
import { PillarRepository } from "../repositories/pillar.repo.js";
import { PillarService } from "../services/pillar.service.js";
import type { InputPillar, Pillar, PublicPillar } from "../types/pillar.types.js";
import { sendArray, sendCreated } from "../util/rest.util.js";
import { ContextService } from "../services/context.service.js";
import { IDService } from "../services/id.service.js";
import { inputPillarSchema } from "../joi/pillar.schema.js";
import { JoiValidationError } from "../types/error.types.js";


export const pillarRouter: Router = Router();

pillarRouter.use(parseToken);

// manual dependency injection
const pillarRepository = new PillarRepository();
const idService = new IDService();
const pillarService = new PillarService(pillarRepository, idService);


pillarRouter.get("/", async (req, res) => {
    const pillars: Pillar[] = await pillarService.getPillarsByUser(ContextService.getCallingUser()!.id);
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