"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const SubcriptionPurchaseSchema = new mongoose_1.default.Schema({
    subcriptionId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'subcription',
    },
    // customer: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'user',
    // },
    merchant: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'merchant',
    },
    startDate: {
        type: Date,
    },
    expiry: {
        type: Date,
    },
    status: {
        type: String,
        enum: enum_1.SUBCRIPTION_REQUEST,
        default: enum_1.SUBCRIPTION_REQUEST.PENDING,
    },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('subcriptionPurchase', SubcriptionPurchaseSchema, 'subcriptionPurchase');
exports.default = Model;
