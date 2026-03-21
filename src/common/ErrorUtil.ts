import { AppError } from "@/errors/AppError";
import { BusinessError } from "@/errors/BusinessError";
import { SystemError } from "@/errors/SystemError";
import i18n from "@/i18n";

export class ErrorUtil {
    
    private static getErrorMessage(errorResponse: any): { summary: string; detail: string } {
        let summaryMessage = i18n.global.t('error');
        let detailMessage = i18n.global.t('unexpected_error');
        if (errorResponse && errorResponse.data && errorResponse.data.type && errorResponse.data.message) {
            summaryMessage = errorResponse.data.type || summaryMessage;
            detailMessage = errorResponse.data.message || detailMessage;
        }
        return { summary: summaryMessage, detail: detailMessage };
    }

    static throwError(errorResponse: any): never {
        throw this.createError(errorResponse);
    }

    static createError(errorResponse: any): AppError {
        const error = this.getErrorMessage(errorResponse);
        if(error.summary == "BUSINESS_EXCEPTION" || error.summary == "VALIDATION_EXCEPTION") {
            return new BusinessError(error.detail, error.summary);
        } else if (error.summary == "SYSTEM_EXCEPTION") {
            return new SystemError(error.detail, error.summary);
        } 

        return new AppError(error.detail, undefined, error.summary, "/error-page");
    }
}