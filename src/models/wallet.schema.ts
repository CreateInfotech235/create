import mongoose from 'mongoose';
import { PERSON_TYPE, SUBCRIPTION_REQUEST, TRANSACTION_TYPE } from '../enum';

const WalletSchema = new mongoose.Schema(
  {
    personId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    type: {
      type: String,
      enum: TRANSACTION_TYPE,
    },
    message: {
      type: String,
    },
    userFlag: {
      type: String,
      enum: PERSON_TYPE,
    },
    availableBalance: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
      enum: SUBCRIPTION_REQUEST,
      default: SUBCRIPTION_REQUEST.APPROVED,
    },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('walletHistory', WalletSchema, 'walletHistory');

export default Model;
