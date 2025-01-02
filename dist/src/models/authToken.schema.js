"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AuthTokenSchema = new mongoose_1.default.Schema({
    adminId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    accessToken: { type: String },
    refreshToken: { type: String },
    isActive: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('authTokens', AuthTokenSchema, 'authTokens');
exports.default = Model;
