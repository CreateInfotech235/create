import { required } from 'joi';
import mongoose from 'mongoose';

const MapApi = new mongoose.Schema(
  {
    mapKey: {
      type: String,
      required: true,
    },
    status : {
        type : Boolean,
        default : true,
        required: true
    }
  },

  {
    timestamps: true,
    versionKey: false,
  },
);

const Model = mongoose.model('MapApi', MapApi, 'MapApi');

export default Model;
