import pino, { type Logger, type LoggerOptions } from 'pino';
import { pinoHttp } from 'pino-http';
import type { RequestHandler } from 'express';

import { environment } from './environment.js';

let loggerConfig: LoggerOptions;

if (environment.LOG_ENVIRONMENT === "LOCAL") {
    // local logger config
    loggerConfig = {
        level: "debug",
        transport: {
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'SYS:standard' },
        }
    };
} else {
    // deployment logger config
    loggerConfig = {
        level: "info",
        formatters: {
            level: (label) => {
                return {
                    level: label
                }
            }
        },
    };
}

export const logger: Logger = pino(loggerConfig);

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
        err: () => undefined
    },
});