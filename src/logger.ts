import pino, { type Logger } from 'pino';
import { pinoHttp } from 'pino-http';
import type { RequestHandler } from 'express';

import { environment } from './environment.js';

const localLogger: Logger = pino({
    level: "debug",
    transport: {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:standard' },
    }
});

const deploymentLogger: Logger = pino({
    level: "info",
    formatters: {
        level: (label) => {
            return {
                level: label
            }
        }
    },
});

export const logger = environment.LOG_ENVIRONMENT === "LOCAL" ? localLogger : deploymentLogger;

export const httpLogger: RequestHandler = pinoHttp({
    logger,
    autoLogging: true,
    genReqId: () => crypto.randomUUID(),
    serializers: {
        req: (req) => ({
            method: req.method,
            url: req.url,
            id: req.id,
        }),
        res: (res) => ({
            statusCode: res.statusCode,
            responseTime: res.responseTime,
        }),
    },
});