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
const messages_schema_1 = __importDefault(require("../../models/messages.schema"));
const unreadMessages = (userId, sender) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get all support tickets for the user
        const query = userId ? { userid: new mongoose_1.default.Types.ObjectId(userId) } : {};
        const supportTickets = yield SupportTicket_1.default.find(query);
        console.log(supportTickets, 'supportTickets');
        // Get all message IDs from the support tickets
        const ticketIds = supportTickets.map(ticket => ticket._id);
        // Get unread messages for these tickets
        const unreadMessages = (yield messages_schema_1.default.find({
            SupportTicketId: { $in: ticketIds },
            sender: sender,
            isRead: false
        })) || [];
        // Count unread messages per ticket
        const unreadMessagesCount = unreadMessages.reduce((acc, message) => {
            const ticketId = message.SupportTicketId.toString();
            acc[ticketId] = (acc[ticketId] || 0) + 1;
            return acc;
        }, {});
        const totalUnreadMessages = unreadMessages.length;
        if (totalUnreadMessages === 0) {
            return { error: 'No unread messages found for this user', for: sender };
        }
        return { unreadMessages: unreadMessagesCount, totalUnreadMessages, for: sender };
    }
    catch (error) {
        console.error('Error fetching unread messages:', error);
        return { error: 'Failed to fetch unread messages' };
    }
});
exports.unreadMessages = unreadMessages;
