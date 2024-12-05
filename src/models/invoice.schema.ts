import mongoose, { Schema, model } from 'mongoose';

interface IInvoice {
  companyName: string;
  address: string;

  logo?: string;
  header?: string;
  footer?: string;
  createdAt?: Date;
  city?: string;
  updatedAt?: Date;
  merchantId: mongoose.Schema.Types.ObjectId;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
    },

    logo: {
      type: String,
      trim: true,
      default: process.env.DEFAULT_IMG,
    },
    header: {
      type: String,
      trim: true,
    },
    footer: {
      type: String,
      trim: true,
    },
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const InvoiceSchema = model<IInvoice>('Invoice', invoiceSchema);

export default InvoiceSchema;
