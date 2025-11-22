import type { UUID } from "crypto";

import type { PillarRepository } from "../repositories/pillar.repo.js";
import type { InputPillar, Pillar } from "../types/pillar.types.js";
import { UpdatePredicate, WherePredicate } from "../util/predicate.util.js";
import type { IDService } from "./id.service.js";
import { uuidToBuffer } from "../util/uuid.util.js";
import { NotFoundError } from "../types/error.types.js";
import { ContextService } from "./context.service.js";
import type { PublicUser } from "../types/user.types.js";



export class PillarService {
    constructor(private pillarRepository: PillarRepository, private idServices: IDService) {}

    public async getPillars(): Promise<Pillar[]> {
        
        const user: PublicUser = ContextService.verifyCallingUser();
        const predicate: WherePredicate = new WherePredicate();
        predicate.equalTo("user_id", uuidToBuffer(user.id));
        const pillars = await this.pillarRepository.getPillars(predicate);
        return pillars;
    }

    public async getPillarByID(pillarID: UUID): Promise<Pillar> {

        const user: PublicUser = ContextService.verifyCallingUser();
        const predicate: WherePredicate = new WherePredicate();
        predicate.equalTo("pillar_id", uuidToBuffer(pillarID));
        predicate.equalTo("user_id", uuidToBuffer(user.id));
        return await this.pillarRepository.getOnePillar(predicate);
    }


    public async createPillar(inputPillar: InputPillar): Promise<Pillar> {

        const id: UUID = this.idServices.createUUID();
        const createdAt: Date = new Date();
        const pillar: Pillar = {
            id: id,
            userID : inputPillar.userID,
            name: inputPillar.name,
            themeID: inputPillar.themeID,
            description: inputPillar.description,
            maxScore: inputPillar.maxScore,
            active: inputPillar.active,
            createdAt: createdAt
        }
        await this.pillarRepository.insertPillar(pillar);
        return pillar;
    }


    public async updatePillar(pillarID: UUID, inputPillar: InputPillar): Promise<Pillar> {

        const predicate = new UpdatePredicate();
        predicate.equalTo("user_id", inputPillar.userID);
        predicate.equalTo("name", inputPillar.name);
        predicate.equalTo("theme_id", inputPillar.themeID);
        predicate.equalTo("description", inputPillar.description);
        predicate.equalTo("max_score", inputPillar.maxScore);
        predicate.equalTo("active", inputPillar.active);
        await this.pillarRepository.updatePillar(pillarID, predicate)
        const pillar: Pillar = await this.getPillarByID(pillarID);
        return pillar;
    }


    public async deletePillar(pillarID: UUID): Promise<void> {

        await this.pillarRepository.deletePillar(pillarID);
    }
}