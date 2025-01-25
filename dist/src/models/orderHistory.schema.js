"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const OrderHistorySchema = new mongoose_1.default.Schema({
    merchantID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
    },
    deliveryBoy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
    },
    message: {
        type: String,
    },
    order: {
        type: Number,
    },
    subOrderId: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        default: enum_1.ORDER_HISTORY.CREATED,
        enum: enum_1.ORDER_HISTORY,
    },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('orderHistory', OrderHistorySchema, 'orderHistory');
exports.default = Model;
