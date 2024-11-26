import mongoose from 'mongoose';
import { PERSON_TYPE } from '../enum';

const CommissionSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
    },
    personId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    amount: {
      type: Number,
    },
    userFlag: {
      type: String,
      enum: PERSON_TYPE,
    },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model(
  'adminCommission',
  CommissionSchema,
  'adminCommission',
);

export default Model;
