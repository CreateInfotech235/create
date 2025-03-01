"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webNavbarValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.webNavbarValidation = joi_1.default.object({
    _id: joi_1.default.string().optional(),
    logo: joi_1.default.object({
        img: joi_1.default.string().required(),
        path: joi_1.default.string().required(),
    }).required(),
    menuList: joi_1.default.array().items(joi_1.default.object({
        name: joi_1.default.string().required(),
        path: joi_1.default.string().required(),
        _id: joi_1.default.string().optional(),
    })).required(),
    favicon: joi_1.default.object({
        img: joi_1.default.string().required(),
        path: joi_1.default.string().required(),
    }).required(),
    __v: joi_1.default.number().optional(),
});
