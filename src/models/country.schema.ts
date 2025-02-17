import mongoose from 'mongoose';
import { DISTANCE_TYPE, WEIGHT_TYPE } from '../enum';

const CountrySchema = new mongoose.Schema(
  {
    countryName: {
      type: String,
      unique: true,
    },
    distanceType: {
      type: String,
      enum: DISTANCE_TYPE,
    },
    weightType: {
      type: String,
      enum: WEIGHT_TYPE,
    },
    // country: {
    //   type: String,
    //   unique: true,
    // },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('country', CountrySchema, 'country');

export default Model;
