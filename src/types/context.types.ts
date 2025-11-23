import type { Logger } from "pino";

import type { PublicUser } from "./user.types.js";


export interface RequestContext {
    user?: PublicUser
    requestID: string,
    logger: Logger
}