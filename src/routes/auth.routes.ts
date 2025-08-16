import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { db } from "../db.js";

export const authRouter: Router = Router();

/** 
 * sign up for an account
 */
authRouter.post("/api/auth/signup", (req, res) => {

});

/**
 * log in with username and password
 * make sure not to send requests with unencrypted passwords
 */
authRouter.post("/api/auth/login", (req, res) => {

});

/**
 * return user profile
 */
authRouter.get("/api/auth/me", (req, res) => {

});

/**
 * delete user profile
 */
authRouter.delete("/api/auth/me", (req, res) => {

});

// these routes will require admin access, which has not yet been implemented in the database
authRouter.get("/api/auth/accounts", (req, res) => {

});


authRouter.post("/api/auth/accounts", (req, res) => {

});


authRouter.get("/api/auth/accounts/:accountId", (req, res) => {

});


authRouter.put("/api/auth/accounts/:accountId", (req, res) => {

});

authRouter.delete("/api/auth/accounts/:accountId", (req, res) => {

});

