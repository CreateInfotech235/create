"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const WebNavbarSchema = new mongoose_1.default.Schema({
    logo: {
        img: {
            type: String,
        },
        path: {
            type: String,
        },
    },
    menuList: [
        {
            name: {
                type: String,
            },
            path: {
                type: String,
            },
        },
    ],
    favicon: {
        img: {
            type: String,
        },
        path: {
            type: String,
        },
    },
});
exports.default = mongoose_1.default.model('WebNavbar', WebNavbarSchema);
