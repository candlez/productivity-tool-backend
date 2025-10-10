import express, { type Express } from 'express';
import cookieParser from 'cookie-parser';

import { authRouter } from './routes/auth.routes.js';
import { userRouter } from './routes/user.routes.js';
import { errorHandler, finalHandler } from './middleware/error.mid.js';

export const app: Express = express();

app.use(express.json());
app.use(cookieParser());

// health check
app.get("/api", (req, res) => {
    return res.status(200).send();
})

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

app.use(errorHandler);
app.use(finalHandler);