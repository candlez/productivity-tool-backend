import { AsyncLocalStorage } from "node:async_hooks";

import type { RequestContext } from "../types/context.types.js";
import type { PublicUser } from "../types/user.types.js";


/**
 * service to abstract away interactions with the AsyncLocalStorage API
 */
export class ContextService {
    private static requestContext = new AsyncLocalStorage<RequestContext>();

    public static runWithContext<T>(context: RequestContext, fn: () => Promise<T>): Promise<T> {
        return this.requestContext.run(context, fn);
    }

    public static getCallingUser(): PublicUser | undefined {
        return this.requestContext.getStore()?.user;
    }
}