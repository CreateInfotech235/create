"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// bile of delivery boy payment
const BileSchema = new mongoose_1.default.Schema({
    deliveryBoyId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    merchantId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    orderId: { type: String, required: true },
    subOrderId: { type: String },
    averageTime: { type: String },
    pickupTime: { type: Date, required: true },
    deliveryTime: { type: Date },
    pickupLocation: { type: Object },
    deliveryLocation: { type: Object },
    pickupAddress: { type: String },
    deliveryAddress: { type: String },
    DelawareDate: { type: Date },
    amount: { type: Number },
    charge: { type: Number, required: true },
    distance: { type: Number },
    orderStatus: { type: String, required: true },
    chargeMethod: { type: String },
    isApproved: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('bile', BileSchema, 'bile');
exports.default = Model;
