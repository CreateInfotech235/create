"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const OrderSchema = new mongoose_1.default.Schema({
    orderId: {
        type: Number,
        unique: true,
    },
    showOrderNumber: {
        type: Number,
        required: false,
    },
    parcel: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
    time: {
        start: { type: Date },
        end: { type: Date },
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'country',
    },
    city: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
                    coordinates: (Array),
                },
            },
            merchantId: { type: mongoose_1.default.Schema.Types.ObjectId },
            dateTime: { type: Date },
            orderTimestamp: { type: Date },
            address: { type: String },
            mobileNumber: { type: String },
            name: { type: String },
            email: { type: String },
            description: { type: String },
            userSignature: { type: String },
            request: {
                type: String,
                enum: enum_1.PICKUP_REQUEST,
                default: enum_1.PICKUP_REQUEST.REGULAR,
            },
            postCode: { type: String },
            // cashOnDelivery: { type: Boolean, default: false },
        },
    },
    deliveryDetails: [
        {
            // type: {
            index: { type: Number },
            location: {
                type: Object,
                properties: {
                    type: String,
                    coordinates: (Array),
                },
            },
            subOrderId: { type: Number },
            orderTimestamp: { type: Date },
            address: { type: String },
            mobileNumber: { type: String },
            name: { type: String },
            email: { type: String },
            description: { type: String },
            deliveryBoySignature: { type: String },
            postCode: { type: String },
            cashOnDelivery: { type: Boolean, default: false },
            customerId: { type: String },
            distance: {
                type: Number,
            },
            duration: {
                type: String,
            },
            parcelsCount: {
                type: Number,
            },
            paymentCollectionRupees: {
                type: Number,
            },
            status: {
                type: String,
                default: enum_1.ORDER_HISTORY.ASSIGNED,
                enum: enum_1.ORDER_HISTORY,
            },
            time: {
                start: { type: Date },
                end: { type: Date },
            },
            trashed: {
                type: Boolean,
                default: false,
            },
            parcelType: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'parcel',
            },
            parcelType2: [
                {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    ref: 'parcel',
                },
            ],
            pickupsignature: { type: String },
            deliverysignature: { type: String },
            reason: { type: String },
            // },
        },
    ],
    deliveryLocation: {
        type: Object,
        properties: {
            type: String,
            coordinates: (Array),
        },
    },
    vehicle: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'vehicle',
    },
    status: {
        type: String,
        default: enum_1.ORDER_HISTORY.ASSIGNED,
        enum: enum_1.ORDER_HISTORY,
    },
    merchant: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
                chargeId: { type: mongoose_1.default.Schema.Types.ObjectId },
            },
        ],
    },
    totalCharge: { type: Number },
    dayChargeNumber: { type: Number, default: 1 },
    reason: { type: String },
    distance: { type: Number, default: 0 },
    duration: { type: String },
    pickupExpress: { type: Boolean },
    cashCollection: { type: Number },
    trashedtime: { type: Date, default: null },
    isCustomer: { type: Boolean, default: false },
    route: { type: Array, default: [] },
    isReassign: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });
const Model = mongoose_1.default.model('orderMulti', OrderSchema);
exports.default = Model;
