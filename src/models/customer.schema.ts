import { required, string } from 'joi';
import mongoose, { Schema } from 'mongoose';

const CounterSchema = new Schema(
  {
    name: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Counter = mongoose.model('Counter', CounterSchema);

// Customer schema definition
const CustomerSchema = new Schema(
  {
    customerId: { type: String, unique: true }, // Add the customerId field
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    // country: { type: Schema.Types.ObjectId, ref: 'Country', required: true },
    country: { type: String, required: true },
    // city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
    city: { type: String, required: true },
    address: {
      type: String,
      required: true,
    },
    postCode: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true },
    trashed: { type: Boolean, default: false },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    createdByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Function to get the next sequence value
const getNextSequenceValue = async (name: any) => {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { name: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  return sequenceDocument.seq;
};

// Pre-save hook to generate a sequential customerId
CustomerSchema.pre('save', async function (next) {
  if (this.isNew) {
    const nextSeq = await getNextSequenceValue('customerId');
    this.customerId = `${nextSeq}`; // You can change the prefix as needed
  }
  next();
});

const Model = mongoose.model('Customer', CustomerSchema, 'customer');

export default Model;
