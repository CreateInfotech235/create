"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CurrencySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        unique: true,
    },
    symbol: {
        type: String,
        unique: true,
    },
    position: {
        type: String,
    },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('currency', CurrencySchema, 'currency');
exports.default = Model;
