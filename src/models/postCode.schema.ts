import mongoose from 'mongoose';
import { CHARGE_TYPE } from '../enum';

const PostCodeSchema = new mongoose.Schema(
  {
    postCode: { type: String, unique: true },
    discountType: {
      type: String,
      enum: CHARGE_TYPE,
      default: CHARGE_TYPE.FIXED,
    },
    discount: { type: Number },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('PostCodes', PostCodeSchema, 'PostCodes');

export default Model;
