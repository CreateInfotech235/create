"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocumentValidation = exports.updateDocumentValidation = exports.createDocumentValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../../enum");
exports.createDocumentValidation = joi_1.default.object({
    name: joi_1.default.string().required(),
    isRequired: joi_1.default.boolean().required(),
});
exports.updateDocumentValidation = joi_1.default.object({
    name: joi_1.default.string().required(),
    isRequired: joi_1.default.boolean().required(),
    documentId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
});
exports.deleteDocumentValidation = joi_1.default.object({
    status: joi_1.default.string().valid(enum_1.SWITCH.ENABLE, enum_1.SWITCH.DISABLE).required(),
    documentId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
});
