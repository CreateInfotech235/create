import mongoose from 'mongoose';

const PaymentGetSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'merchant' },
    deliveryManId: { type: mongoose.Schema.Types.ObjectId, ref: 'deliveryMan' },
    orderId: { type: String },
    subOrderId: { type: String , default: null},
    orderIdForMerchant: { type: String },
    miles: { type: Number },
    payPerMiles: { type: Number },
    totalPaytoDeliveryMan: { type: Number },
    totalPaytoAdmin: { type: Number },
    deliveryManWallet: { type: Number },
    deliveryManType: {
      type: String,
      enum: ['ADMINDELIVERYMAN', 'MERCHANTDELIVERYMAN']
    },
    paymentStatus: {
      type: String,
      enum: ['CASHONDELIVERY', 'DIRECTPAYMENT']
    },
    isPaid: { type: Boolean, default: false },
    statusOfOrder: {
      type: String, enum: ['UNASSIGNED', 'ASSIGNED', 'ACCEPTED', 'CANCELLED', 'DELIVERED', 'PICKED_UP', 'DEPARTED', 'ARRIVED','REJECTED'], default: 'ASSIGNED'
    },
    orderPickupTime: { type: Date },
    orderDeleverTime: { type: Date },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('paymentGet', PaymentGetSchema, 'paymentGet');

export default Model;