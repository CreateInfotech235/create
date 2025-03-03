"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// bile of delivery boy payment
const WebSocialMediaSchema = new mongoose_1.default.Schema({
    email: { type: String },
    phoneNumber: { type: String },
    socialMedia: [
        {
            name: { type: String },
            link: { type: String },
            icon: { type: String },
        }
    ],
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('webSocialMedia', WebSocialMediaSchema, 'webSocialMedia');
exports.default = Model;
