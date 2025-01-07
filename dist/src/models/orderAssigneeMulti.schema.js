"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const OrderAssigneeSchema = new mongoose_1.default.Schema({
    deliveryBoy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'deliveryMan',
    },
    // customer: {
    //   type: mongoose.Schema.Types.ObjectId,
    // },
    merchant: {
        type: mongoose_1.default.Schema.Types.ObjectId,
    },
    order: {
        type: Number,
        // ref: 'order',
    },
    status: {
        type: String,
        default: enum_1.ORDER_REQUEST.PENDING,
        enum: enum_1.ORDER_REQUEST,
    },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('orderAssigneeMulti', OrderAssigneeSchema, 'orderAssigneeMulti');
exports.default = Model;
