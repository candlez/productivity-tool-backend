import express from 'express';
import { testRouter } from './routes/test';

export const app = express();

app.use(testRouter);

