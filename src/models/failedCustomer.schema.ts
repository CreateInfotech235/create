import mongoose, { Schema } from 'mongoose';

const FailedCustomerSchema = new Schema(
  {
    data: {
      firstName: { type: String },
      lastName: { type: String },
      country: { type: String },
      city: { type: String },
      address: { type: String },
      postCode: { type: String },
      mobileNumber: { type: String },
      email: { type: String },
      location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number] }
      },
      merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'merchant'
      },
      trashed: { type: Boolean },
      createdByAdmin: { type: Boolean }
    },
    error: { type: String, required: true },
    attemptedAt: { type: Date, default: Date.now },
    resolved: { type: Boolean, default: false },
    resolvedAt: { type: Date }
  },
  { timestamps: true }
);

const Model = mongoose.model('FailedCustomer', FailedCustomerSchema, 'failedCustomer');

export default Model;
