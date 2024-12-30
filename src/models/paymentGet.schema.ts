import mongoose from 'mongoose';

const PaymentGetSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    merchantId : { type: mongoose.Schema.Types.ObjectId, ref: 'merchant' },
    deliveryManId : { type: mongoose.Schema.Types.ObjectId, ref: 'deliveryMan' },
    orderId : { type: mongoose.Schema.Types.ObjectId, ref: 'order' },
    miles : { type: Number },
    payPerMiles : { type: Number },
    totalPaytoDeliveryMan : { type: Number },
    totalPaytoAdmin : { type: Number },
    deliveryManWallet : { type: Number },
    deliveryManType : { 
        type: String ,
        enum: ['ADMINDELIVERYMAN', 'MERCHANTDELIVERYMAN']
    },
    paymentStatus : { 
        type: String ,
        enum: ['CASHONDELIVERY', 'DIRECTPAYMENT']
    },

  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('paymentGet', PaymentGetSchema, 'paymentGet');

export default Model;

