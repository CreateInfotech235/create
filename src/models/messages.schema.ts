import mongoose from 'mongoose';

const messagesSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    SupportTicketId: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.model('messages', messagesSchema);
