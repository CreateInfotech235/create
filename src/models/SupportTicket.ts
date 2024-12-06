import mongoose from 'mongoose';
const SupportTicket = new mongoose.Schema(
  {
 
    userid: {
      type: mongoose.Schema.Types.ObjectId,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin',
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('SupportTicket', SupportTicket);

export default Model;
