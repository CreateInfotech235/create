import mongoose from 'mongoose';
import { PROVIDER, SWITCH } from '../enum';

const merchantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    contactNumber: {
      type: Number,
    },
    countryCode: {
      type: String,
    },
    country: {
      type: String,
      unique: true,
    },
    city: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      default: SWITCH.ENABLE,
      enum: SWITCH,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    bankData: {
      type: {
        name: { type: String },
        accountNumber: { type: Number },
        permanentBankName: { type: String },
        ifscCode: { type: String },
      },
    },
    balance: {
      type: Number,
    },
    provider: {
      type: String,
      enum: PROVIDER,
      default: PROVIDER.APP,
    },
    providerId: {
      type: String,
      enum: PROVIDER,
    },
    medicalCertificateNumber: {
      type: Number,
      unique: true,
    },
    medicalCertificate: {
      type: String,
    },
    language: {
      type: String,
      default: 'en',
    },
    image: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      // state: String,
      postalCode: String,
      country: String,
    },
    createdByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

// const Model = mongoose.model('user', userSchema);
const Model = mongoose.model('merchant', merchantSchema);

export default Model;
