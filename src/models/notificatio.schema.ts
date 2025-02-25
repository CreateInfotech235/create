import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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
      type: mongoose.Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Model = mongoose.model(
  'Notification',
  NotificationSchema,
  'Notification',
);

export default Model;
