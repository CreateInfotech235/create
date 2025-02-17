import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: String,
  sequence_value: { type: Number, default: 59 },
});

const OrderCounter = mongoose.model('Counter', counterSchema);
export default OrderCounter;
