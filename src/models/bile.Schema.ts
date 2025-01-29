import mongoose from 'mongoose';
// bile of delivery boy payment
const BileSchema = new mongoose.Schema(
  {
    deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, required: true },
    merchantId: { type: mongoose.Schema.Types.ObjectId, required: true },

    orderId: { type: String, required: true },
    subOrderId: { type: String },

    averageTime: { type: String },

    pickupTime: { type: Date, required: true },
    deliveryTime: { type: Date },

    pickupLocation: { type: Object },
    deliveryLocation: { type: Object },

    pickupAddress: { type: String },
    deliveryAddress: { type: String },

    DelawareDate: { type: Date },
    amount: { type: Number },

    charge: { type: Number, required: true },
    distance: { type: Number },

    orderStatus: { type: String, required: true },

    chargeMethod: { type: String },
    isApproved: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('bile', BileSchema, 'bile');

export default Model;
