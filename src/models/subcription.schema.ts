import mongoose from 'mongoose';

const SubcriptionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
    },
    amount: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    features: {
      type: Array,
    },
    seconds: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDesable: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('subcription', SubcriptionSchema);

export default Model;
