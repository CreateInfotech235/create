import mongoose from 'mongoose';
import { CHARGE_METHOD, PROVIDER, SWITCH } from '../enum';

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
    },
    password: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
   
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
    defaultLocation: {
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
      default: 0,
    },
    earning: {
      type: Number,
      default: 0,
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
    emergencyContact: {
      type: {
        name: { type: String },
        number: { type: Number },
      },
    },
    showDeliveryManNumber: {
      type: Number,
      required: false,
    },

  
    // charge method delivery boy
    chargeMethod: {
      type: String,
      enum: CHARGE_METHOD,
      default: CHARGE_METHOD.TIME,
    },
    // charge method delivery boy
    charge: {
      type: Number,
      default: 10,
    },
    // admin charge method
    adminCharge: {
      type: Number,
      default: 0,
    },
    deviceToken: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('deliveryMan', DeliveryManSchema, 'deliveryMan');

export default Model;
