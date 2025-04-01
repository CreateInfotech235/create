"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messagesSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId, auto: true },
    SupportTicketId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'SupportTicket',
        required: true,
    },
    text: { type: String, default: '' },
    sender: { type: String, enum: ['merchant', 'admin'], required: true }, // 'merchant' or 'admin'
    isRead: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
    file: {
        data: { type: String, default: '' },
        name: { type: String, default: '' },
        type: { type: String, default: '' },
        extension: { type: String, default: '' },
    },
    fileType: { type: String, default: '' },
}, { timestamps: true, versionKey: false });
exports.default = mongoose_1.default.model('messages', messagesSchema);
