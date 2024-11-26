import mongoose from 'mongoose';
import { ORDER_LOCATION, PAYMENT_INFO, PAYMENT_TYPE } from '../enum';

const PaymentInfoSchema = new mongoose.Schema(
  {
    paymentThrough: { type: String, enum: PAYMENT_TYPE },
    paymentCollectFrom: { type: String, enum: ORDER_LOCATION },
    order: { type: Number },
    wallet: { type: mongoose.SchemaTypes.ObjectId },
    // customer: { type: mongoose.SchemaTypes.ObjectId },
    merchant: { type: mongoose.SchemaTypes.ObjectId },
    status: { type: String, enum: PAYMENT_INFO, default: PAYMENT_INFO.PENDING },
    details: { type: Object },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('paymentInfo', PaymentInfoSchema, 'paymentInfo');

export default Model;
