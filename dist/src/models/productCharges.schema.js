"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const ProductChargeSchema = new mongoose_1.default.Schema({
    cityId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'city' },
    cancelCharge: { type: Number, default: 0 },
    minimumDistance: { type: Number, default: 0 },
    minimumWeight: { type: Number, default: 0 },
    perDistanceCharge: { type: Number, default: 0 },
    perWeightCharge: { type: Number, default: 0 },
    adminCommission: { type: Number },
    pickupRequest: {
        type: String,
        enum: enum_1.PICKUP_REQUEST,
        default: enum_1.PICKUP_REQUEST.REGULAR,
    },
    // customer: { type: mongoose.Schema.Types.ObjectId },
    merchant: { type: mongoose_1.default.Schema.Types.ObjectId },
    isCustomer: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('ProductCharges', ProductChargeSchema, 'ProductCharges');
exports.default = Model;
