"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countryWiseCityValidation = exports.updateCountryValidation = exports.createCountryValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../../enum");
exports.createCountryValidation = joi_1.default.object({
    countryName: joi_1.default.string().required(),
    distanceType: joi_1.default.string()
        .valid(enum_1.DISTANCE_TYPE.KM, enum_1.DISTANCE_TYPE.MILES)
        .required(),
    weightType: joi_1.default.string().valid(enum_1.WEIGHT_TYPE.KG, enum_1.WEIGHT_TYPE.POUND).required(),
});
exports.updateCountryValidation = joi_1.default.object({
    countryName: joi_1.default.string(),
    distanceType: joi_1.default.string().valid(enum_1.DISTANCE_TYPE.KM, enum_1.DISTANCE_TYPE.MILES),
    weightType: joi_1.default.string().valid(enum_1.WEIGHT_TYPE.KG, enum_1.WEIGHT_TYPE.POUND),
    currency: joi_1.default.string(),
    countryId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
});
exports.countryWiseCityValidation = joi_1.default.object({
    countryId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    pageCount: joi_1.default.number().required(),
    pageLimit: joi_1.default.number().required(),
});
