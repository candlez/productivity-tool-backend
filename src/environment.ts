import Joi, { type ValidationResult } from "joi";

const schema = Joi.object({
    NODE_PORT: Joi.number().default(1127),
    MYSQL_HOST: Joi.string().required(),
    MYSQL_PORT: Joi.number().required(),
    MYSQL_USERNAME: Joi.string().required(),
    MYSQL_PASSWORD: Joi.string().required(),
    MYSQL_DB_NAME: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    LOG_ENVIRONMENT: Joi.string().default("CLOUD")
}).unknown(true);

const validation: ValidationResult = schema.validate(process.env);

if (validation.error) {
    throw new Error(`Error validating environment variables: ${validation.error.message}`);
}

export const environment: Environment = {
    NODE_PORT: validation.value.NODE_PORT,
    MYSQL_HOST: validation.value.MYSQL_HOST,
    MYSQL_PORT: validation.value.MYSQL_PORT,
    MYSQL_USERNAME: validation.value.MYSQL_USERNAME,
    MYSQL_PASSWORD: validation.value.MYSQL_PASSWORD,
    MYSQL_DB_NAME: validation.value.MYSQL_DB_NAME,
    JWT_SECRET: validation.value.JWT_SECRET,
    LOG_ENVIRONMENT: validation.value.LOG_ENVIRONMENT
}

export type Environment = {
    NODE_PORT: number,
    MYSQL_HOST: string,
    MYSQL_PORT: number,
    MYSQL_USERNAME: string,
    MYSQL_PASSWORD: string,
    MYSQL_DB_NAME: string,
    JWT_SECRET: string,
    LOG_ENVIRONMENT: string
}