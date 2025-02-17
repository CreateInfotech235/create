import mongoose from 'mongoose';
import { SUBCRIPTION_REQUEST } from '../enum';

const DeliveryManDocumentSchema = new mongoose.Schema(
  {
    document: { type: mongoose.Schema.Types.ObjectId, ref: 'documents' },
    deliveryManId: { type: mongoose.Schema.Types.ObjectId, ref: 'deliveryMan' },
    documentNumber: { type: String },
    status: {
      type: String,
      enum: SUBCRIPTION_REQUEST,
      default: SUBCRIPTION_REQUEST.PENDING,
    },
    image: { type: String },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model(
  'deliveryManDocuments',
  DeliveryManDocumentSchema,
  'deliveryManDocuments',
);

export default Model;
