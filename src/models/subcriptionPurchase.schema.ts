import mongoose from 'mongoose';
import { SUBCRIPTION_REQUEST } from '../enum';

const SubcriptionPurchaseSchema = new mongoose.Schema(
  {
    subcriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subcription',
    },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'merchant',
    },
    startDate: {
      type: Date,
    },
    expiry: {
      type: Date,
    },
    status: {
      type: String,
      enum: SUBCRIPTION_REQUEST,
      default: SUBCRIPTION_REQUEST.PENDING,
    },
    amount: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    byingAmount: {
      type: Number,
    },
    features: {
      type: Array,
    },
    isplanupgrade: {
      type: Boolean,
      default: false,
    },
    oldPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subcription',
    },
    isthisplanupgrade: {
      type: Boolean,
      default: false,
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
