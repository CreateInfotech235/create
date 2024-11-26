import mongoose from 'mongoose';
import { PROVIDER, SWITCH } from '../enum';

const DeliveryManSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
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
    // countryCode: {
    //   type: String,
    // },
    isVerified: {
      type: Boolean,
      default: false,
    },
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    address: {
      type: String,
    },
    postCode: {
      type: String,
    },
    status: {
      type: String,
      enum: SWITCH,
      default: SWITCH.ENABLE,
    },
    location: {
      type: {
        type: String,
      },
      coordinates: [],
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
    earning: {
      type: Number,
    },
    image: {
      type: String,
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
    // customer: {
    //   type: mongoose.Types.ObjectId,
    // },
    merchant: {
      type: mongoose.Types.ObjectId,
    },
    isCustomer: {
      type: Boolean,
      default: false,
    },
    trashed: { type: Boolean, default: false },
    language: {
      type: String,
      default: 'en',
    },
    // merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, // Associating with Merchant
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'merchant' }, // Associating with Merchant
    createdByMerchant: { type: Boolean, default: false },
    createdByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('deliveryMan', DeliveryManSchema, 'deliveryMan');

export default Model;
