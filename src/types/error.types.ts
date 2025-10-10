import type { ValidationErrorItem } from "joi";


export class PTError extends Error {

    constructor(message: string, opts?: ErrorOptions) {
        super(message, opts);

        Object.setPrototypeOf(this, new.target.prototype);
    }
}


export class NotFoundError extends PTError {

    constructor(message: string, opts?: ErrorOptions) {
        super(message, opts);
    }
}


export class JoiValidationError extends PTError {
    details: ValidationErrorItem[];

    constructor(message: string, details: ValidationErrorItem[], opts?: ErrorOptions) {
        super(message, opts);
        this.details = details;
    }
}


export class ValidationError extends PTError {

    constructor(message: string, opts?: ErrorOptions) {
        super(message, opts);
    }
}


export class UnauthorizedError extends PTError {

    constructor(message: string, opts?: ErrorOptions) {
        super(message, opts);
    }
}


export class ForbiddenError extends PTError {

    constructor(message: string, opts?: ErrorOptions) {
        super(message, opts);
    }
}

// end PTErrors
// -----------------------------------------------------------------------------------------------------------
// start non PTErrors

export interface MySQL2Error extends Error {
    errno: number
}
