"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// bile of delivery boy payment
const BileSchema = new mongoose_1.default.Schema({
    deliveryBoyId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true }, //ok
    merchantId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true }, //ok
    orderId: { type: String, required: true }, //ok
    subOrderId: { type: String }, //ok
    averageTime: { type: String }, //ok
    pickupTime: { type: Date, required: true }, //ok
    deliveryTime: { type: Date },
    pickupLocation: { type: Object }, //ok
    deliveryLocation: { type: Object }, //ok
    pickupAddress: { type: String }, //ok
    deliveryAddress: { type: String }, //ok
    DelawareDate: { type: Date },
    isCashOnDelivery: { type: Boolean },
    amountOfPackage: { type: Number, default: 0 },
    charge: { type: Number, required: true }, //ok
    distance: { type: Number }, //ok
    totalCharge: { type: Number },
    orderStatus: { type: String, required: true }, //ok
    chargeMethod: { type: String }, //ok
    isApproved: { type: Boolean, default: false }, //ok
    isPaid: { type: Boolean, default: false }, //ok
    showOrderId: { type: String, default: "0" }, //ok
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('bile', BileSchema, 'bile');
exports.default = Model;
