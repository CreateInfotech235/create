import mongoose from 'mongoose';
import { SWITCH } from '../enum';

const ParcelSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      unique: true,
    },
    value: {
      type: String,
    },
    status: {
      type: String,
      enum: SWITCH,
      default: SWITCH.ENABLE,
    },
    // customer: { type: mongoose.Schema.Types.ObjectId },
    merchant: { type: mongoose.Schema.Types.ObjectId },
    isCustomer: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('parcel', ParcelSchema);

export default Model;
