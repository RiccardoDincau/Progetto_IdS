class ErrorResponse {
    static baseErrorResponse(res, statusCode, title, additionalInfo) {
        if (!res.headersSent) {
            res.status(statusCode).json({
                title,
                additionalInfo,
            });
        }
    }

    static userNotFound(res, additionalInfo) {
        this.baseErrorResponse(res, 404, "User was not found", additionalInfo);
    }

    static reportNotFound(res, additionalInfo) {
        this.baseErrorResponse(
            res,
            404,
            "Report was not found",
            additionalInfo
        );
    }

    static reportMalformed(res, additionalInfo) {
        this.baseErrorResponse(res, 400, "Report malformed", additionalInfo);
    }

    static notificationNotFound(res, additionalInfo) {
        this.baseErrorResponse(
            res,
            404,
            "Notification was not found",
            additionalInfo
        );
    }

    static commentNotFound(res, additionalInfo) {
        this.baseErrorResponse(
            res,
            404,
            "Comment was not found",
            additionalInfo
        );
    }

    static idNotValid(res, additionalInfo) {
        this.baseErrorResponse(res, 400, "ID is not valid", additionalInfo);
    }

    static stateNotValid(res, additionalInfo) {
        this.baseErrorResponse(res, 400, "State is not valid", additionalInfo);
    }

    static kindNotValid(res, additionalInfo) {
        this.baseErrorResponse(res, 400, "Kind is not valid", additionalInfo);
    }

    static categoryNotValid(res, additionalInfo) {
        this.baseErrorResponse(
            res,
            400,
            "Category is not valid",
            additionalInfo
        );
    }

    static missingAttribute(res, attribute, additionalInfo = {}) {
        additionalInfo.missingAttribute = attribute;
        this.baseErrorResponse(res, 400, "Missing attriute.", additionalInfo);
    }

    static unauthorizedAction(res, attemptedAction, additionalInfo = {}) {
        additionalInfo.attemptedAction = attemptedAction;
        this.baseErrorResponse(
            res,
            403,
            "Unauthorized action attempted.",
            additionalInfo
        );
    }

    static authenticationFailed(res, failCause, additionalInfo = {}) {
        additionalInfo.failCause = failCause;
        this.baseErrorResponse(
            res,
            400,
            "Authentication failed.",
            additionalInfo
        );
    }

    static emailNotValid(res, additionalInfo) {
        this.baseErrorResponse(res, 400, "Email is malformed", additionalInfo);
    }
}

module.exports = ErrorResponse;
