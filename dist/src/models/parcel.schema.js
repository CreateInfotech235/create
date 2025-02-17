"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const ParcelSchema = new mongoose_1.default.Schema({
    label: {
        type: String,
        unique: true,
    },
    value: {
        type: String,
    },
    status: {
        type: String,
        enum: enum_1.SWITCH,
        default: enum_1.SWITCH.ENABLE,
    },
    // customer: { type: mongoose.Schema.Types.ObjectId },
    merchant: { type: mongoose_1.default.Schema.Types.ObjectId },
    isCustomer: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('parcel', ParcelSchema);
exports.default = Model;
