import mongoose from 'mongoose';
import { CHARGE_TYPE, SWITCH } from '../enum';

const ExtraCharges = new mongoose.Schema(
  {
    title: { type: String },
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'country' },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'city' },
    chargeType: { type: String, enum: CHARGE_TYPE },
    charge: { type: Number },
    status: { type: String, enum: SWITCH, default: SWITCH.ENABLE },
    // customer: { type: mongoose.Schema.Types.ObjectId },
    merchant: { type: mongoose.Schema.Types.ObjectId },
    isCustomer: { type: Boolean, default: false },
    cashOnDelivery: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('extraCharges', ExtraCharges, 'extraCharges');

export default Model;
