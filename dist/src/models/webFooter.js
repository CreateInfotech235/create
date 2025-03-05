"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const WebFooterSchema = new mongoose_1.default.Schema({
    Resources: [
        {
            name: String,
            link: String,
        },
    ],
    ContactUs: [
        {
            data: String,
            type: {
                type: String,
                enum: enum_1.CONTACT_US_TYPE,
            },
            link: String
        }
    ],
    copyright: {
        text: String,
        link: String
    },
});
exports.default = mongoose_1.default.model('WebFooter', WebFooterSchema);
