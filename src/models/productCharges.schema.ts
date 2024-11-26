import mongoose from 'mongoose';
import { PICKUP_REQUEST } from '../enum';

const ProductChargeSchema = new mongoose.Schema(
  {
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'city' },
    cancelCharge: { type: Number, default: 0 },
    minimumDistance: { type: Number, default: 0 },
    minimumWeight: { type: Number, default: 0 },
    perDistanceCharge: { type: Number, default: 0 },
    perWeightCharge: { type: Number, default: 0 },
    adminCommission: { type: Number },
    pickupRequest: {
      type: String,
      enum: PICKUP_REQUEST,
      default: PICKUP_REQUEST.REGULAR,
    },
    // customer: { type: mongoose.Schema.Types.ObjectId },
    merchant: { type: mongoose.Schema.Types.ObjectId },
    isCustomer: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model(
  'ProductCharges',
  ProductChargeSchema,
  'ProductCharges',
);

export default Model;
