import mongoose from 'mongoose';

const AuthTokenSchema = new mongoose.Schema(
  {
    accessToken: { type: String },
    refreshToken: { type: String },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('authTokens', AuthTokenSchema, 'authTokens');

export default Model;
