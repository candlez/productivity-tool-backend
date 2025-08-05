import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { db } from "../db";

export const authRouter = Router();

