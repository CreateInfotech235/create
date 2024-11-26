"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicleValidation = exports.updateVehicleValidation = exports.createVehicleValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../../enum");
exports.createVehicleValidation = joi_1.default.object({
    name: joi_1.default.string().required(),
    capacity: joi_1.default.number().required(),
    size: joi_1.default.number().required(),
    description: joi_1.default.string().required(),
    cityWise: joi_1.default.string()
        .valid(enum_1.VEHICLE_CITY_TYPE.ALL, enum_1.VEHICLE_CITY_TYPE.CITY_WISE)
        .required(),
    city: joi_1.default.array().items(joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()),
    image: joi_1.default.string()
        .regex(
    // /data:image\/(?:bmp|gif|ico|jpg|png|svg|webp|x-icon|svg\+xml);base64,[a-zA-Z0-9+/]+={0,2}/,
    /data:image\/[bmp,gif,ico,jpg,jpeg,png,svg,webp,x\-icon,svg+xml]+;base64,[a-zA-Z0-9,+,/]+={0,2}/)
        .required(),
});
exports.updateVehicleValidation = joi_1.default.object({
    name: joi_1.default.string(),
    capacity: joi_1.default.number(),
    size: joi_1.default.number(),
    description: joi_1.default.string(),
    cityWise: joi_1.default.string().valid(enum_1.VEHICLE_CITY_TYPE.ALL, enum_1.VEHICLE_CITY_TYPE.CITY_WISE),
    city: joi_1.default.array().items(joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/)),
    image: joi_1.default.string().regex(/data:image\/(?:bmp|gif|ico|jpg|png|jpeg|svg|webp|x-icon|svg\+xml);base64,[a-zA-Z0-9+/]+={0,2}/),
    vehicleId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
});
exports.deleteVehicleValidation = joi_1.default.object({
    vehicleId: joi_1.default.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    status: joi_1.default.string()
        .valid(enum_1.SWITCH.ENABLE, enum_1.SWITCH.DISABLE)
        .default(enum_1.SWITCH.DISABLE),
});
