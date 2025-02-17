"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.billingValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.billingValidation = joi_1.default.object({
    deliveryBoyId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    merchantId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
});
