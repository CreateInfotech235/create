"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SupportTicket = new mongoose_1.default.Schema({
    userid: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'merchant',
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    problem: {
        type: String,
        required: true,
    },
    problemSolved: {
        // Fixed typo in field name
        type: Boolean,
        default: false,
    },
    adminId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    messages: [
        {
            text: { type: String, required: true },
            sender: { type: String, enum: ['merchant', 'admin'], required: true }, // 'merchant' or 'admin'
            isRead: { type: Boolean, default: false },
            timestamp: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('SupportTicket', SupportTicket);
exports.default = Model;
