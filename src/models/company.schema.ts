import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    mobileNumber: {
      type: Number,
    },
    countryCode: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('company', CompanySchema, 'company');

export default Model;
