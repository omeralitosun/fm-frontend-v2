import { AppError } from "./AppError"

export class SystemError extends AppError {

    constructor(message: string, statusLabel?: string) {
        super(message, 0, statusLabel, "/error-page");
    }
}