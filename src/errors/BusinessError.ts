import { AppError } from "./AppError"

export class BusinessError extends AppError {

    constructor(message: string, statusLabel?: string) {
        super(message, 0, statusLabel, undefined)
    }
}