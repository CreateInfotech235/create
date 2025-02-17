import mongoose from 'mongoose';
import { CHARGE_TYPE } from '../enum';

const CitySchema = new mongoose.Schema(
  {
    cityName: { type: String, unique: true },
    countryID: { type: mongoose.Schema.Types.ObjectId, ref: 'country' },
    commissionType: { type: String, enum: CHARGE_TYPE },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('city', CitySchema, 'city');

export default Model;
