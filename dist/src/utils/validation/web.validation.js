"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FooterpageValidation = exports.webhomelandingpageValidation = exports.webSocialMediaValidation = exports.webNavbarValidation = void 0;
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
    button: joi_1.default.object({
        name: joi_1.default.string().required(),
        path: joi_1.default.string().required(),
    }).optional(),
    defaultProfileImage: joi_1.default.string().optional(),
    __v: joi_1.default.number().optional(),
});
exports.webSocialMediaValidation = joi_1.default.object({
    email: joi_1.default.string().required(),
    phoneNumber: joi_1.default.string().required(),
    socialMedia: joi_1.default.array().items(joi_1.default.object({
        name: joi_1.default.string().required(),
        link: joi_1.default.string().required(),
        icon: joi_1.default.string().required(),
    })).required(),
});
exports.webhomelandingpageValidation = joi_1.default.object({
    AutoTyperlist: joi_1.default.array().items(joi_1.default.string()).required(),
    subTitle: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    bgImage: joi_1.default.string().required(),
});
exports.FooterpageValidation = joi_1.default.object({
    Resources: joi_1.default.array().items(joi_1.default.object({
        name: joi_1.default.string().required(),
        link: joi_1.default.string().required(),
    })).required(),
    ContactUs: joi_1.default.array().items(joi_1.default.object({
        data: joi_1.default.string().required(),
        type: joi_1.default.string().required(),
        link: joi_1.default.string().required(),
    })).required(),
    copyright: joi_1.default.object({
        text: joi_1.default.string().required(),
        link: joi_1.default.string().required(),
    }).required(),
});
