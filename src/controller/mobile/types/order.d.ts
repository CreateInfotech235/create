import { ObjectId } from 'mongoose';
import {
  CHARGE_TYPE,
  ORDER_HISTORY,
  ORDER_LOCATION,
  PAYMENT_INFO,
  PAYMENT_TYPE,
  PICKUP_REQUEST,
  SWITCH,
} from '../../../enum';

interface OrderCreateType {
  parcelType: string;
  paymentCollectionRupees: number;
  parcelsCount: number;
  weight: number;
  distance: number;
  duration: number;
  description?: string;
  country: string;
  city: string;
  // customer: string;
  merchant: string;
  paymentCollection?: PAYMENT_TYPE;
  paymentOrderLocation?: ORDER_LOCATION;
  vehicle: string;
  dateTime: number;
  startPickupDate: Date;
  endPickupDate: Date;
  startDeliveryDate: Date;
  endDeliveryDate: Date;
  cashOnDelivery: boolean;
  trashed: boolean;
  pickupDetails: {
    location: { type: string; coordinates: number[] } & {
      latitude?: number;
      longitude?: number;
    };
    merchantId: string;
    dateTime: number;
    orderTimestamp: number;
    address: string;
    // countryCode: string;
    mobileNumber: number;
    email?: string;
    name: string;
    pickupRequest: PICKUP_REQUEST;
    description: string;
    postCode: string;
    cashOnDelivery?: boolean;
  };
  deliveryDetails: {
    location: {
      latitude: number;
      longitude: number;
    };
    dateTime: number;
    orderTimestamp: number;
    address: string;
    // countryCode: string;
    mobileNumber: number;
    email?: string;
    name: string;
    pickupRequest: PICKUP_REQUEST;
    description: string;
    postCode: string;
    cashOnDelivery?: boolean;
  };
  deliveryLocation?: { type: string; coordinates: number[] };
  cashOnDelivery: boolean;
  deliveryManId: string;
  orderId: number;
  cashCollection: number;
  isCustomer?: boolean;
}

interface IProductCharge {
  _id: ObjectId;
  cityId: ObjectId;
  cancelCharge: number;
  minimumDistance: number;
  minimumWeight: number;
  perDistanceCharge: number;
  perWeightCharge: number;
  adminCommission: number;
  pickupRequest: PICKUP_REQUEST;
  // customer: ObjectId;
  merchant: ObjectId;
  isCustomer: boolean;
  charges: {
    charge: number;
  };
}

interface ExtraChargesType {
  _id: { chargeType: CHARGE_TYPE; cashOnDelivery: boolean };
  totalCharge: number;
  charges: {
    title: string;
    charge: number;
    commissionType: CHARGE_TYPE;
    adminCommission: number;
  }[];
}

interface ExtraChargesQueryType {
  country: string;
  city: string;
  status: SWITCH;
  isCustomer: boolean;
  // customer?: string;
  merchant?: string;
}

interface ProductChargeQueryType
  // extends Pick<ExtraChargesQueryType, 'isCustomer' | 'customer'> {
  extends Pick<ExtraChargesQueryType, 'isCustomer' | 'merchant'> {
  cityId: mongoose.Types.ObjectId;
  pickupRequest: PICKUP_REQUEST;
}

interface LastOrderType {
  orderId: number;
}

interface PaymentInfoType {
  paymentThrough: PAYMENT_TYPE;
  paymentCollectFrom: ORDER_LOCATION;
  // customer: string;
  merchant: string;
  order: number;
  status?: PAYMENT_INFO;
}

interface IOrderCancel {
  status: ORDER_HISTORY;
  reason: string;
  totalCharge?: number;
}
