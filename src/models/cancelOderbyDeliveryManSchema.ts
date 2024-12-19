import mongoose from 'mongoose';

const cancelOderbyDeliveryMan = new mongoose.Schema(
  {
    deliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'deliveryMan',
    },
    order: {
      type: Number,
      // ref: 'order',
    },
    status: {
      type: String,
      default:"CANCELLED"
    },
  },
  { timestamps: true, versionKey: false },
);

 const cancelOderbyDeliveryManschema = mongoose.model('cancelOderbyDeliveryMan', cancelOderbyDeliveryMan);

export default cancelOderbyDeliveryManschema;