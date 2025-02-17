import mongoose from 'mongoose';

const cancelOderbyDeliveryMan = new mongoose.Schema(
  {
    deliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'deliveryMan',
    },
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'merchant',
    },
    order: {
      type: Number,
      // ref: 'order',
    },
    status: {
      type: String,
      default:"CANCELLED"
    },
    subOrderId: {
      type: Number,
      default: 0,
    },
    reason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true, versionKey: false },
);

 const cancelOderbyDeliveryManschema = mongoose.model('cancelOderbyDeliveryMan', cancelOderbyDeliveryMan);

export default cancelOderbyDeliveryManschema;