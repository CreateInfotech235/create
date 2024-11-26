import mongoose from 'mongoose';
import { ORDER_HISTORY, PICKUP_REQUEST } from '../enum';
import { boolean, number } from 'joi';

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: Number,
      unique: true,
    },
    parcelType: {
      type: String,
    },
    parcel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'parcel',
    },
    weight: {
      type: Number,
    },
    startPickupDate: {
      type: Date,
    },
    endPickupDate: {
      type: Date,
    },
    startDeliveryDate: {
      type: Date,
    },
    endDeliveryDate: {
      type: Date,
    },
    parcelsCount: {
      type: Number,
    },
    paymentCollectionRupees: {
      type: Number,
    },
    description: {
      type: String,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'country',
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'city',
    },
    cashOnDelivery: { type: Boolean, default: false },
    dateTime: { type: Date },
    pickupDetails: {
      type: {
        location: {
          type: Object,
          properties: {
            type: String,
            coordinates: Array<number>,
          },
        },
        merchantId: { type: mongoose.Schema.Types.ObjectId },
        dateTime: { type: Date },
        orderTimestamp: { type: Date },
        address: { type: String },
        mobileNumber: { type: Number },
        name: { type: String },
        email: { type: String },
        description: { type: String },
        userSignature: { type: String },
        request: {
          type: String,
          enum: PICKUP_REQUEST,
          default: PICKUP_REQUEST.REGULAR,
        },
        postCode: { type: String },
        cashOnDelivery: { type: Boolean, default: false },
      },
    },
    deliveryDetails: {
      type: {
        orderTimestamp: { type: Date },
        address: { type: String },
        mobileNumber: { type: Number },
        name: { type: String },
        email: { type: String },
        description: { type: String },
        deliveryBoySignature: { type: String },
        postCode: { type: String },
        cashOnDelivery: { type: Boolean, default: false },
      },
    },
    deliveryLocation: {
      type: Object,
      properties: {
        type: String,
        coordinates: Array<number>,
      },
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'vehicle',
    },
    status: {
      type: String,
      default: ORDER_HISTORY.CREATED,
      enum: ORDER_HISTORY,
    },
    // customer: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'user',
    // },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'merchant',
    },
    trashed: {
      type: Boolean,
      default: false,
    },
    charges: {
      type: [
        {
          title: { type: String },
          charge: { type: Number },
          chargeId: { type: mongoose.Schema.Types.ObjectId },
        },
      ],
    },
    totalCharge: { type: Number },
    dayChargeNumber: { type: Number, default: 1 },
    reason: { type: String },
    distance: { type: Number },
    duration: { type: String },
    pickupExpress: { type: Boolean },
    cashCollection: { type: Number },
    isCustomer: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('order', OrderSchema);

export default Model;
