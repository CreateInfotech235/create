"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguage = void 0;
const locale_1 = __importDefault(require("./locale"));
const getLanguage = (lang) => locale_1.default[lang];
exports.getLanguage = getLanguage;
