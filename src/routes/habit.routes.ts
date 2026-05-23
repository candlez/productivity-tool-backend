import { Router } from "express";
import type { ValidationResult } from "joi";
import Joi from "joi";
import type { UUID } from "crypto";

import { parseToken } from "../middleware/auth.mid.js";

export const habitRouter: Router = Router();

habitRouter.use(parseToken);

// manual dependency injection


habitRouter.get("/", async (req, res) => {

});


habitRouter.post("/", async (req, res) => {

});


const pathParamSchema = Joi.object<{ habitID: UUID }>({
    habitID: Joi.string().uuid().required()
}).unknown(false);


habitRouter.get("/:habitID", async (req, res) => {

});


habitRouter.put("/:habitID", async (req, res) => {

});


habitRouter.delete("/:habitID", async (req, res) => {

});