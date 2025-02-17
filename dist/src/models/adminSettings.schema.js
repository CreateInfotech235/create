"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AdminSettingsSchema = new mongoose_1.default.Schema({
    emailVerify: {
        type: Boolean,
        default: true,
    },
    currency: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
    },
    mobileNumberVerify: {
        type: Boolean,
        default: false,
    },
    orderAutoAssign: {
        type: Boolean,
        default: false,
    },
    personalAdminCommission: {
        type: Boolean,
        default: false,
    },
    otpVerifyBothLocation: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('adminSettings', AdminSettingsSchema, 'adminSettings');
exports.default = Model;
