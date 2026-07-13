import express, { type Express } from 'express';
import cookieParser from 'cookie-parser';

import { authRouter } from './routes/auth.routes.js';
import { userRouter } from './routes/user.routes.js';
import { themeRouter } from './routes/theme.routes.js';
import { pillarRouter } from './routes/pillar.routes.js';
import { errorHandler, finalHandler } from './middleware/error.mid.js';
import { httpLogger } from './logger.js';
import { initializeContext } from './middleware/context.mid.js';
import { habitRouter } from './routes/habit.routes.js';
import { habitEntryRouter } from './routes/habitEntry.routes.js';

export const app: Express = express();

app.use(httpLogger);
app.use(initializeContext);
app.use(express.json());
app.use(cookieParser());

// health check
app.get("/api", (req, res) => {
    return res.status(200).send();
})

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/themes", themeRouter);
app.use("/api/v1/pillars", pillarRouter);
app.use("/api/v1/habits", habitRouter);
app.use("/api/v1/habit-entries", habitEntryRouter);

app.use(errorHandler);
app.use(finalHandler);