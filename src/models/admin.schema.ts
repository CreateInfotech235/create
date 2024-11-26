import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema(
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
    profileImage: {
      type: String,
    },
    balance: {
      type: Number,
    },
    language: {
      type: String,
      default: 'en',
    },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('admin', AdminSchema);

export default Model;
