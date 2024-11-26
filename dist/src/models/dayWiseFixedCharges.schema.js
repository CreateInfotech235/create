"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DayWiseFixedChargeSchema = new mongoose_1.default.Schema({
    title: { type: String },
    productChargeId: { type: mongoose_1.default.Schema.Types.ObjectId },
    charge: { type: Number },
    dayInMs: { type: Number },
    dayNumber: { type: Number, unique: true },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('dayWiseFixedCharges', DayWiseFixedChargeSchema);
exports.default = Model;
