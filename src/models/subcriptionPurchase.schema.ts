import mongoose from 'mongoose';
import { SUBCRIPTION_REQUEST } from '../enum';

const SubcriptionPurchaseSchema = new mongoose.Schema(
  {
    subcriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subcription',
    },
    // customer: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'user',
    // },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'merchant',
    },
    expiry: {
      type: Date,
    },
    status: {
      type: String,
      enum: SUBCRIPTION_REQUEST,
      default: SUBCRIPTION_REQUEST.PENDING,
    },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model(
  'subcriptionPurchase',
  SubcriptionPurchaseSchema,
  'subcriptionPurchase',
);

export default Model;
