"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const DocumentSchema = new mongoose_1.default.Schema({
    name: { type: String, unique: true },
    isRequired: { type: Boolean },
    status: { type: String, enum: enum_1.SWITCH, default: enum_1.SWITCH.ENABLE },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('document', DocumentSchema);
exports.default = Model;
