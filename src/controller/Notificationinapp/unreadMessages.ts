import SupportTicket from '../../models/SupportTicket';
import mongoose from 'mongoose';
export const unreadMessages = async (userId: string | undefined, sender: string) => {
  try {
    const matchCondition = userId ? { userid: new mongoose.Types.ObjectId(userId) } : {};
    
    const unreadMessagesCount = await SupportTicket.aggregate([
      { $match: matchCondition },
      { $unwind: '$messages' },
      { $match: { 'messages.sender': sender, 'messages.isRead': false } },
      { $group: { _id: '$_id', count: { $sum: 1 } } }
    ]);
    
    const totalUnreadMessages = unreadMessagesCount.reduce((acc, ticket) => acc + ticket.count, 0);
    const unreadMessages = unreadMessagesCount.reduce((acc, ticket) => {
      acc[ticket._id.toString()] = ticket.count;
      return acc;
    }, {} as Record<string, number>);

    if (totalUnreadMessages === 0) {
      return { error: 'No unread messages found for this user',for: sender };
    }

    return { unreadMessages, totalUnreadMessages,for: sender };
  } catch {
    return { error: 'Failed to fetch unread messages' };
  }
};
