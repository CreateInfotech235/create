import mongoose from 'mongoose';
import { SWITCH, VEHICLE_CITY_TYPE } from '../enum';

const VehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    city: {
      type: [{ type: mongoose.Schema.Types.ObjectId }],
    },
    size: {
      type: Number,
    },
    capacity: {
      type: Number,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    cityType: {
      type: String,
      default: VEHICLE_CITY_TYPE.ALL,
      enum: VEHICLE_CITY_TYPE,
    },
    status: {
      type: String,
      default: SWITCH.ENABLE,
      enum: SWITCH,
    },
    // customer: { type: mongoose.Schema.Types.ObjectId },
    merchant: { type: mongoose.Schema.Types.ObjectId },
    isCustomer: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('vehicle', VehicleSchema);

export default Model;
