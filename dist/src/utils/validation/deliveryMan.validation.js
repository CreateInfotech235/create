"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLocationValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateLocationValidation = joi_1.default.object({
    // country: Joi.string()
    //   .regex(/^[0-9a-fA-F]{24}$/)
    //   .required(),
    // city: Joi.string()
    //   .regex(/^[0-9a-fA-F]{24}$/)
    //   .required(),
    location: joi_1.default.object({
        latitude: joi_1.default.number().required(),
        longitude: joi_1.default.number().required(),
    }).required(),
});
