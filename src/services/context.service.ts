import { AsyncLocalStorage } from "node:async_hooks";
import { type Logger } from "pino";

import type { RequestContext } from "../types/context.types.js";
import type { PublicUser } from "../types/user.types.js";
import { UnauthorizedError } from "../types/error.types.js";


/**
 * service to abstract away interactions with the AsyncLocalStorage API
 */
export class ContextService {
    private static requestContext = new AsyncLocalStorage<RequestContext>();

    public static runWithContext<T>(context: RequestContext, fn: () => Promise<T>): Promise<T> {
        return this.requestContext.run(context, fn);
    }

    public static getCallingUser(): PublicUser | undefined {
        return this.requestContext.getStore()!.user;
    }

    /**
     * for when you want to ensure there is a calling user
     */
    public static verifyCallingUser(): PublicUser {
        // this method will eventually also be used to check permissions at the method level
        const user: PublicUser | undefined = this.requestContext.getStore()!.user;
        if (!user) {
            throw new UnauthorizedError("You must be authenticated to complete this action.");
        }

        return user;
    }

    public static setCallingUser(user: PublicUser): void {
        this.requestContext.getStore()!.user = user;
    }

    public static getLogger(): Logger {
        return this.requestContext.getStore()!.logger;
    }

}