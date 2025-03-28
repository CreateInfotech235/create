"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SocialMediaSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
    },
    socialMediaPlatform: [
        {
            defaultImage: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: false,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
});
exports.default = mongoose_1.default.model('SocialMedia', SocialMediaSchema);
