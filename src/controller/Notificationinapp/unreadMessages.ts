import SupportTicket from '../../models/SupportTicket';
import mongoose from 'mongoose';
import messagesSchema from '../../models/messages.schema';

export const unreadMessages = async (userId: string | undefined, sender: string) => {
  try {


    // Get all support tickets for the user
    const query = userId ? { userid: new mongoose.Types.ObjectId(userId) } : {};
    const supportTickets = await SupportTicket.find(query);
    console.log(supportTickets, 'supportTickets');
    // Get all message IDs from the support tickets
    const ticketIds = supportTickets.map(ticket => ticket._id);

    // Get unread messages for these tickets
    const unreadMessages = await messagesSchema.find({
      SupportTicketId: { $in: ticketIds },
      sender: sender,
      isRead: false
    })||[];


    // Count unread messages per ticket
    const unreadMessagesCount = unreadMessages.reduce((acc, message) => {
      const ticketId = message.SupportTicketId.toString();
      acc[ticketId] = (acc[ticketId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalUnreadMessages = unreadMessages.length;

    if (totalUnreadMessages === 0) {
      return { error: 'No unread messages found for this user', for: sender };
    }

    return { unreadMessages: unreadMessagesCount, totalUnreadMessages, for: sender };
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    return { error: 'Failed to fetch unread messages' };
  }
};
