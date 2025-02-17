import mongoose from 'mongoose';
import { SWITCH } from '../enum';

const DocumentSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    isRequired: { type: Boolean },
    status: { type: String, enum: SWITCH, default: SWITCH.ENABLE },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('document', DocumentSchema);

export default Model;
