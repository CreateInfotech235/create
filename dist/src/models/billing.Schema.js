"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// bile of delivery boy payment
const BillingSchema = new mongoose_1.default.Schema({
    deliveryBoyId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true }, //ok
    merchantId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true }, //ok
    orderId: { type: String, required: true }, //ok
    showOrderId: { type: String, default: '0' }, //ok
    subOrderdata: [
        {
            subOrderId: { type: String }, //ok
            averageTime: { type: String }, //ok
            // start time and end time in seconds
            pickupTime: { type: Number, default: null }, //ok
            deliveryTime: { type: Number, default: null },
            pickupLocation: { type: Object }, //ok
            deliveryLocation: { type: Object }, //ok
            pickupAddress: { type: String }, //ok
            deliveryAddress: { type: String }, //ok
            DelawareDate: { type: Number },
            isCashOnDelivery: { type: Boolean },
            amountOfPackage: { type: Number, default: 0 },
            chargePer: { type: Number, default: 0 }, //ok
            distance: { type: Number }, //ok
            orderStatus: { type: String }, //ok
        },
    ],
    charge: { type: Number },
    totalCharge: { type: Number, default: 0 },
    panaltyAmount: { type: Number, default: 0 },
    interestAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    totalamountOfPackage: { type: Number, default: 0 },
    orderStatus: { type: String }, //ok
    chargeMethod: { type: String }, //ok
    isApproved: { type: Boolean, default: false }, //ok
    isPaid: { type: Boolean, default: false }, //ok
    reason: { type: String },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('billing', BillingSchema, 'billing');
exports.default = Model;
