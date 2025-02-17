"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const counterSchema = new mongoose_1.default.Schema({
    _id: String,
    sequence_value: { type: Number, default: 59 },
});
const OrderCounter = mongoose_1.default.model('Counter', counterSchema);
exports.default = OrderCounter;
