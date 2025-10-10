import type { UUID } from "crypto";


export class IDService {
    constructor() {}

    public createUUID(): UUID {
        return crypto.randomUUID();
    }
}