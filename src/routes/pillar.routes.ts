import { Router } from "express";

import { parseToken } from "../middleware/auth.mid.js";
import { PillarRepository } from "../repositories/pillar.repo.js";
import { PillarService } from "../services/pillar.service.js";
import type { Pillar, PublicPillar } from "../types/pillar.types.js";
import { sendArray } from "../util/rest.util.js";


export const pillarRouter: Router = Router();

pillarRouter.use(parseToken);

// manual dependency injection
const pillarRepository = new PillarRepository();
const pillarService = new PillarService(pillarRepository);


pillarRouter.get("/", async (req, res) => {
    const pillars: Pillar[] = await pillarService.getPillarsByUser(req.user!.id);
    const publicPillars: PublicPillar[] = pillars; // no need to map as there is no difference
    return sendArray<PublicPillar>(res, publicPillars);
});


pillarRouter.post("/", async (req, res) => {
    
})