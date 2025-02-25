"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const NotificationSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        refPath: 'type',
    },
    subOrderId: {
        type: [Number],
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['ADMIN', 'MERCHANT', 'DELIVERYMAN'],
    },
    orderId: {
        type: Number,
        required: false,
    },
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        refPath: 'type',
        required: false,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
    versionKey: false,
});
const Model = mongoose_1.default.model('Notification', NotificationSchema, 'Notification');
exports.default = Model;
