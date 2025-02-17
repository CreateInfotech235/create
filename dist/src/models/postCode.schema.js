"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const PostCodeSchema = new mongoose_1.default.Schema({
    postCode: { type: String, unique: true },
    discountType: {
        type: String,
        enum: enum_1.CHARGE_TYPE,
        default: enum_1.CHARGE_TYPE.FIXED,
    },
    discount: { type: Number },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('PostCodes', PostCodeSchema, 'PostCodes');
exports.default = Model;
