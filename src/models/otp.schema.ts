import mongoose from 'mongoose';
import { PERSON_TYPE } from '../enum';

const otpSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
    },
    customerEmail: {
      type: String,
    },
    customerMobile: {
      type: Number,
    },
    expiry: {
      type: Date,
    },
    action: {
      type: String,
      enum: PERSON_TYPE,
    },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('otp', otpSchema);

export default Model;
