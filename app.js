import express from 'express';
import cookieParser from 'cookie-parser';

import { testRouter } from './routes/test.js';
import { authRouter } from './routes/auth.routes.js';

export const app = express();

app.use(express.json());
app.use(cookieParser());

// health check
app.get("/api", (req, res) => {
    return res.status(200).send();
})

app.use(testRouter);
app.use(authRouter);

