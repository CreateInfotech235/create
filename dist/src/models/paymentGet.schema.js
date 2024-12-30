"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PaymentGetSchema = new mongoose_1.default.Schema({
    adminId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'admin' },
    merchantId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'merchant' },
    deliveryManId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'deliveryMan' },
    orderId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'order' },
    miles: { type: Number },
    payPerMiles: { type: Number },
    totalPaytoDeliveryMan: { type: Number },
    totalPaytoAdmin: { type: Number },
    deliveryManWallet: { type: Number },
    deliveryManType: {
        type: String,
        enum: ['ADMINDELIVERYMAN', 'MERCHANTDELIVERYMAN']
    },
    paymentStatus: {
        type: String,
        enum: ['CASHONDELIVERY', 'DIRECTPAYMENT']
    },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('paymentGet', PaymentGetSchema, 'paymentGet');
exports.default = Model;
