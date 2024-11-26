"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const PaymentInfoSchema = new mongoose_1.default.Schema({
    paymentThrough: { type: String, enum: enum_1.PAYMENT_TYPE },
    paymentCollectFrom: { type: String, enum: enum_1.ORDER_LOCATION },
    order: { type: Number },
    wallet: { type: mongoose_1.default.SchemaTypes.ObjectId },
    // customer: { type: mongoose.SchemaTypes.ObjectId },
    merchant: { type: mongoose_1.default.SchemaTypes.ObjectId },
    status: { type: String, enum: enum_1.PAYMENT_INFO, default: enum_1.PAYMENT_INFO.PENDING },
    details: { type: Object },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('paymentInfo', PaymentInfoSchema, 'paymentInfo');
exports.default = Model;
