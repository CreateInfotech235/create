import mongoose from 'mongoose';
import { ORDER_HISTORY } from '../enum';

const OrderHistorySchema = new mongoose.Schema(
  {
    merchantID: {
      type: mongoose.Schema.Types.ObjectId,
    },
    message: {
      type: String,
    },
    order: {
      type: Number,
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
