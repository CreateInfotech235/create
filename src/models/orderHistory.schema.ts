import mongoose from 'mongoose';
import { ORDER_HISTORY } from '../enum';

const OrderHistorySchema = new mongoose.Schema(
  {
    merchantID: {
      type: mongoose.Schema.Types.ObjectId,
    },
    deliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
    },
    message: {
      type: String,
    },
    order: {
      type: Number,
    },
    subOrderId: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: ORDER_HISTORY.CREATED,
      enum: ORDER_HISTORY,
    },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model(
  'orderHistory',
  OrderHistorySchema,
  'orderHistory',
);

export default Model;
