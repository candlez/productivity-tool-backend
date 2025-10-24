import type { UUID } from "crypto";

import type { PillarRepository } from "../repositories/pillar.repo.js";
import type { InputPillar, Pillar } from "../types/pillar.types.js";
import { Predicate } from "../util/predicate.util.js";
import type { IDService } from "./id.service.js";
import { uuidToBuffer } from "../util/uuid.util.js";



export class PillarService {
    constructor(private pillarRepository: PillarRepository, private idServices: IDService) {}

    public async getPillarsByUser(userID: UUID): Promise<Pillar[]> {
        
        const predicate: Predicate = new Predicate();
        predicate.equalTo("user_id", uuidToBuffer(userID));
        const pillars = await this.pillarRepository.getPillars(predicate);
        return pillars;
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


}