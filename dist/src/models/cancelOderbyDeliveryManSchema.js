"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cancelOderbyDeliveryMan = new mongoose_1.default.Schema({
    deliveryBoy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'deliveryMan',
    },
    order: {
        type: Number,
        // ref: 'order',
    },
    status: {
        type: String,
        default: "CANCELLED"
    },
    subOrderId: {
        type: Number,
        default: 0,
    },
    reason: {
        type: String,
        default: '',
    },
}, { timestamps: true, versionKey: false });
const cancelOderbyDeliveryManschema = mongoose_1.default.model('cancelOderbyDeliveryMan', cancelOderbyDeliveryMan);
exports.default = cancelOderbyDeliveryManschema;
