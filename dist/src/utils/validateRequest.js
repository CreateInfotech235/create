"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (payload, schemaKeys) => {
    const { value, error } = schemaKeys.validate(payload, { abortEarly: false });
    if (error) {
        const message = error.details.map((el) => el.message).join('\n');
        return {
            isValid: false,
            message,
        };
    }
    return { isValid: true, value };
};
