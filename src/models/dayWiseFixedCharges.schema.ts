import mongoose from 'mongoose';

const DayWiseFixedChargeSchema = new mongoose.Schema(
  {
    title: { type: String },
    productChargeId: { type: mongoose.Schema.Types.ObjectId },
    charge: { type: Number },
    dayInMs: { type: Number },
    dayNumber: { type: Number, unique: true },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('dayWiseFixedCharges', DayWiseFixedChargeSchema);

export default Model;
