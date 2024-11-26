import mongoose from 'mongoose';

const AdminSettingsSchema = new mongoose.Schema(
  {
    emailVerify: {
      type: Boolean,
      default: true,
    },
    currency: {
      type: mongoose.SchemaTypes.ObjectId,
    },
    mobileNumberVerify: {
      type: Boolean,
      default: false,
    },
    orderAutoAssign: {
      type: Boolean,
      default: false,
    },
    personalAdminCommission: {
      type: Boolean,
      default: false,
    },
    otpVerifyBothLocation: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model(
  'adminSettings',
  AdminSettingsSchema,
  'adminSettings',
);

export default Model;
