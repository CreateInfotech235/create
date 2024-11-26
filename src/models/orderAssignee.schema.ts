import mongoose from 'mongoose';
import { ORDER_REQUEST } from '../enum';

const OrderAssigneeSchema = new mongoose.Schema(
  {
    deliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
    },
    // customer: {
    //   type: mongoose.Schema.Types.ObjectId,
    // },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
    },
    order: {
      type: Number,
      // ref: 'order',
    },
    status: {
      type: String,
      default: ORDER_REQUEST.PENDING,
      enum: ORDER_REQUEST,
    },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('orderAssign', OrderAssigneeSchema, 'orderAssign');

export default Model;
