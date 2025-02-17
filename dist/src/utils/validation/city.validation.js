"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dayChargesListValidation = exports.cityListValidation = exports.updateCityValidation = exports.createCityValidation = exports.updateDayWiseChargeValidation = exports.createDayWiseChargeValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../../enum");
exports.createDayWiseChargeValidation = joi_1.default.object({
    cityId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    productChargeId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    fixedCharge: joi_1.default.number().required(),
    title: joi_1.default.string().required(),
    hours: joi_1.default.number().required(),
});
exports.updateDayWiseChargeValidation = joi_1.default.object({
    cityId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    productChargeId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    dayNumber: joi_1.default.number().required(),
    fixedCharge: joi_1.default.number(),
    title: joi_1.default.string(),
    hours: joi_1.default.number(),
});
exports.createCityValidation = joi_1.default.object({
    cityName: joi_1.default.string().required(),
    countryID: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    cancelCharge: joi_1.default.number().required(),
    minimumDistance: joi_1.default.number().required(),
    minimumWeight: joi_1.default.number().required(),
    perDistanceCharge: joi_1.default.number().required(),
    perWeightCharge: joi_1.default.number().required(),
    commissionType: joi_1.default.string()
        .valid(enum_1.CHARGE_TYPE.FIXED, enum_1.CHARGE_TYPE.PERCENTAGE)
        .required(),
    adminCommission: joi_1.default.number().required(),
    pickupRequest: joi_1.default.string()
        .valid(enum_1.PICKUP_REQUEST.REGULAR, enum_1.PICKUP_REQUEST.EXPRESS)
        .required(),
});
exports.updateCityValidation = joi_1.default.object({
    cityName: joi_1.default.string(),
    countryID: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/),
    cancelCharge: joi_1.default.number(),
    minimumDistance: joi_1.default.number(),
    minimumWeight: joi_1.default.number(),
    perDistanceCharge: joi_1.default.number(),
    perWeightCharge: joi_1.default.number(),
    commissionType: joi_1.default.string().valid(enum_1.CHARGE_TYPE.FIXED, enum_1.CHARGE_TYPE.PERCENTAGE),
    adminCommission: joi_1.default.number(),
    pickupRequest: joi_1.default.string().valid(enum_1.PICKUP_REQUEST.REGULAR, enum_1.PICKUP_REQUEST.EXPRESS),
    cityId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
});
exports.cityListValidation = joi_1.default.object({
    cityName: joi_1.default.string(),
    pageCount: joi_1.default.number().required(),
    pageLimit: joi_1.default.number().required(),
});
exports.dayChargesListValidation = joi_1.default.object({
    productChargeId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    pageCount: joi_1.default.number().required(),
    pageLimit: joi_1.default.number().required(),
});
