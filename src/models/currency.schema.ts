import mongoose from 'mongoose';

const CurrencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    symbol: {
      type: String,
      unique: true,
    },
    position: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('currency', CurrencySchema, 'currency');

export default Model;
