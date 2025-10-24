import type { UUID } from "crypto";

import type { PillarRepository } from "../repositories/pillar.repo.js";
import type { Pillar } from "../types/pillar.types.js";
import { Predicate } from "../util/predicate.util.js";



export class PillarService {
    constructor(private pillarRepository: PillarRepository) {}

    public async getPillarsByUser(userID: UUID): Promise<Pillar[]> {
        
        const predicate: Predicate = new Predicate();
        predicate.equalTo("user_id", userID);
        const pillars = await this.pillarRepository.getPillars(predicate);
        return pillars;
    }


}