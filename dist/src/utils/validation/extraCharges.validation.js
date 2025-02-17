"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExtraChargesValidation = exports.updateExtraChargesValidation = exports.createExtraChargesValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../../enum");
exports.createExtraChargesValidation = joi_1.default.object({
    title: joi_1.default.string().required(),
    charge: joi_1.default.number().required(),
    chargeType: joi_1.default.string()
        .valid(enum_1.CHARGE_TYPE.FIXED, enum_1.CHARGE_TYPE.PERCENTAGE)
        .required(),
    country: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    city: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    cashOnDelivery: joi_1.default.boolean(),
});
exports.updateExtraChargesValidation = joi_1.default.object({
    title: joi_1.default.string(),
    charge: joi_1.default.number(),
    chargeType: joi_1.default.string().valid(enum_1.CHARGE_TYPE.FIXED, enum_1.CHARGE_TYPE.PERCENTAGE),
    country: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/),
    city: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/),
    cashOnDelivery: joi_1.default.boolean(),
    extraChargeId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
});
exports.deleteExtraChargesValidation = joi_1.default.object({
    extraChargeId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    status: joi_1.default.string()
        .valid(enum_1.SWITCH.ENABLE, enum_1.SWITCH.DISABLE)
        .default(enum_1.SWITCH.DISABLE),
});
