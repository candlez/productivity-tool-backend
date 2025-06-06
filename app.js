import express from 'express';
import { testRouter } from './routes/test.js';

export const app = express();

// health check
app.get("/api", (req, res) => {
    return res.status(200).send();
})

app.use(testRouter);

