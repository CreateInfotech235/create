import mongoose from 'mongoose';
// bile of delivery boy payment
const BileSchema = new mongoose.Schema(
  {
    deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, required: true },//ok
    merchantId: { type: mongoose.Schema.Types.ObjectId, required: true },//ok

    orderId: { type: String, required: true },//ok
    subOrderId: { type: String },//ok

    averageTime: { type: String },//ok

    pickupTime: { type: Date, required: true },//ok
    deliveryTime: { type: Date },

    pickupLocation: { type: Object },//ok
    deliveryLocation: { type: Object },//ok

    pickupAddress: { type: String },//ok
    deliveryAddress: { type: String },//ok


    DelawareDate: { type: Date },
    isCashOnDelivery: { type: Boolean },
    amountOfPackage: { type: Number,default:0 },

    charge: { type: Number, required: true }, //ok
    distance: { type: Number },//ok
    totalCharge: { type: Number },

    orderStatus: { type: String, required: true },//ok

    chargeMethod: { type: String },//ok
    isApproved: { type: Boolean, default: false },//ok
    isPaid: { type: Boolean, default: false },//ok
    showOrderId: { type: String,default:"0"},//ok
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('bile', BileSchema, 'bile');

export default Model;
