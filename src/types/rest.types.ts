import "express";

import type { PublicUser } from "./user.types.js";

// here I am adding an optional user field to the Request object for authentication
declare module "express-serve-static-core" {
    interface Request {
        user?: PublicUser;
    }
}