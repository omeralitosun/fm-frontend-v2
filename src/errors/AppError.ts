export class AppError extends Error {
    statusCode?: number
    statusLabel?: string
    redirectTo?: string

    constructor(message: string, statusCode?: number, statusLabel?: string, redirectTo?: string) {
        super(message)
        this.statusCode = statusCode
        this.statusLabel = statusLabel
        this.redirectTo = redirectTo
    }
}