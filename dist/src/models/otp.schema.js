"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const otpSchema = new mongoose_1.default.Schema({
    value: {
        type: Number,
    },
    customerEmail: {
        type: String,
    },
    customerMobile: {
        type: Number,
    },
    expiry: {
        type: Date,
    },
    subOrderId: {
        type: Number
    },
    action: {
        type: String,
        enum: enum_1.PERSON_TYPE,
    },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('otp', otpSchema);
exports.default = Model;
