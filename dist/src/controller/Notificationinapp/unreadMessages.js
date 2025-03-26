"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unreadMessages = void 0;
const SupportTicket_1 = __importDefault(require("../../models/SupportTicket"));
const mongoose_1 = __importDefault(require("mongoose"));
const unreadMessages = (userId, sender) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const matchCondition = userId ? { userid: new mongoose_1.default.Types.ObjectId(userId) } : {};
        const unreadMessagesCount = yield SupportTicket_1.default.aggregate([
            { $match: matchCondition },
            { $unwind: '$messages' },
            { $match: { 'messages.sender': sender, 'messages.isRead': false } },
            { $group: { _id: '$_id', count: { $sum: 1 } } }
        ]);
        const totalUnreadMessages = unreadMessagesCount.reduce((acc, ticket) => acc + ticket.count, 0);
        const unreadMessages = unreadMessagesCount.reduce((acc, ticket) => {
            acc[ticket._id.toString()] = ticket.count;
            return acc;
        }, {});
        if (totalUnreadMessages === 0) {
            return { error: 'No unread messages found for this user', for: sender };
        }
        return { unreadMessages, totalUnreadMessages, for: sender };
    }
    catch (_a) {
        return { error: 'Failed to fetch unread messages' };
    }
});
exports.unreadMessages = unreadMessages;
