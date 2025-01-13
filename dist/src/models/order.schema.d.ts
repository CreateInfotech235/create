/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import mongoose from 'mongoose';
declare const Model: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    trashed: boolean;
    status: string;
    isCustomer: boolean;
    cashOnDelivery: boolean;
    charges: mongoose.Types.DocumentArray<{
        charge?: number;
        title?: string;
        chargeId?: mongoose.Types.ObjectId;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        charge?: number;
        title?: string;
        chargeId?: mongoose.Types.ObjectId;
    }> & {
        charge?: number;
        title?: string;
        chargeId?: mongoose.Types.ObjectId;
    }>;
    dayChargeNumber: number;
    distance: number;
    description?: string;
    country?: mongoose.Types.ObjectId;
    city?: mongoose.Types.ObjectId;
    merchant?: mongoose.Types.ObjectId;
    orderId?: number;
    parcelType?: string;
    showOrderNumber?: number;
    parcel?: mongoose.Types.ObjectId;
    weight?: number;
    startPickupDate?: NativeDate;
    endPickupDate?: NativeDate;
    startDeliveryDate?: NativeDate;
    endDeliveryDate?: NativeDate;
    time?: {
        end?: NativeDate;
        start?: NativeDate;
    };
    parcelsCount?: number;
    paymentCollectionRupees?: number;
    dateTime?: NativeDate;
    pickupDetails?: {
        cashOnDelivery: boolean;
        request: string;
        name?: string;
        description?: string;
        address?: string;
        merchantId?: mongoose.Types.ObjectId;
        postCode?: string;
        mobileNumber?: string;
        email?: string;
        location?: any;
        dateTime?: NativeDate;
        orderTimestamp?: NativeDate;
        userSignature?: string;
    };
    deliveryDetails?: {
        cashOnDelivery: boolean;
        name?: string;
        description?: string;
        address?: string;
        postCode?: string;
        mobileNumber?: string;
        email?: string;
        location?: any;
        orderTimestamp?: NativeDate;
        deliveryBoySignature?: string;
    };
    deliveryLocation?: any;
    vehicle?: mongoose.Types.ObjectId;
    totalCharge?: number;
    reason?: string;
    duration?: string;
    pickupExpress?: boolean;
    cashCollection?: number;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    trashed: boolean;
    status: string;
    isCustomer: boolean;
    cashOnDelivery: boolean;
    charges: mongoose.Types.DocumentArray<{
        charge?: number;
        title?: string;
        chargeId?: mongoose.Types.ObjectId;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        charge?: number;
        title?: string;
        chargeId?: mongoose.Types.ObjectId;
    }> & {
        charge?: number;
        title?: string;
        chargeId?: mongoose.Types.ObjectId;
    }>;
    dayChargeNumber: number;
    distance: number;
    description?: string;
    country?: mongoose.Types.ObjectId;
    city?: mongoose.Types.ObjectId;
    merchant?: mongoose.Types.ObjectId;
    orderId?: number;
    parcelType?: string;
    showOrderNumber?: number;
    parcel?: mongoose.Types.ObjectId;
    weight?: number;
    startPickupDate?: NativeDate;
    endPickupDate?: NativeDate;
    startDeliveryDate?: NativeDate;
    endDeliveryDate?: NativeDate;
    time?: {
        end?: NativeDate;
        start?: NativeDate;
    };
    parcelsCount?: number;
    paymentCollectionRupees?: number;
    dateTime?: NativeDate;
    pickupDetails?: {
        cashOnDelivery: boolean;
        request: string;
        name?: string;
        description?: string;
        address?: string;
        merchantId?: mongoose.Types.ObjectId;
        postCode?: string;
        mobileNumber?: string;
        email?: string;
        location?: any;
        dateTime?: NativeDate;
        orderTimestamp?: NativeDate;
        userSignature?: string;
    };
    deliveryDetails?: {
        cashOnDelivery: boolean;
        name?: string;
        description?: string;
        address?: string;
        postCode?: string;
        mobileNumber?: string;
        email?: string;
        location?: any;
        orderTimestamp?: NativeDate;
        deliveryBoySignature?: string;
    };
    deliveryLocation?: any;
    vehicle?: mongoose.Types.ObjectId;
    totalCharge?: number;
    reason?: string;
    duration?: string;
    pickupExpress?: boolean;
    cashCollection?: number;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    trashed: boolean;
    status: string;
    isCustomer: boolean;
    cashOnDelivery: boolean;
    charges: mongoose.Types.DocumentArray<{
        charge?: number;
        title?: string;
        chargeId?: mongoose.Types.ObjectId;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        charge?: number;
        title?: string;
        chargeId?: mongoose.Types.ObjectId;
    }> & {
        charge?: number;
        title?: string;
        chargeId?: mongoose.Types.ObjectId;
    }>;
    dayChargeNumber: number;
    distance: number;
    description?: string;
    country?: mongoose.Types.ObjectId;
    city?: mongoose.Types.ObjectId;
    merchant?: mongoose.Types.ObjectId;
    orderId?: number;
    parcelType?: string;
    showOrderNumber?: number;
    parcel?: mongoose.Types.ObjectId;
    weight?: number;
    startPickupDate?: NativeDate;
    endPickupDate?: NativeDate;
    startDeliveryDate?: NativeDate;
    endDeliveryDate?: NativeDate;
    time?: {
        end?: NativeDate;
        start?: NativeDate;
    };
    parcelsCount?: number;
    paymentCollectionRupees?: number;
    dateTime?: NativeDate;
    pickupDetails?: {
        cashOnDelivery: boolean;
        request: string;
        name?: string;
        description?: string;
        address?: string;
        merchantId?: mongoose.Types.ObjectId;
        postCode?: string;
        mobileNumber?: string;
        email?: string;
        location?: any;
        dateTime?: NativeDate;
        orderTimestamp?: NativeDate;
        userSignature?: string;
    };
    deliveryDetails?: {
        cashOnDelivery: boolean;
        name?: string;
        description?: string;
        address?: string;
        postCode?: string;
        mobileNumber?: string;
        email?: string;
        location?: any;
        orderTimestamp?: NativeDate;
        deliveryBoySignature?: string;
    };
    deliveryLocation?: any;
    vehicle?: mongoose.Types.ObjectId;
    totalCharge?: number;
    reason?: string;
    duration?: string;
    pickupExpress?: boolean;
    cashCollection?: number;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    trashed: boolean;
    status: string;
    isCustomer: boolean;
    cashOnDelivery: boolean;
    charges: mongoose.Types.DocumentArray<{
        charge?: number;
        title?: string;
        chargeId?: mongoose.Types.ObjectId;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        charge?: number;
        title?: string;
        chargeId?: mongoose.Types.ObjectId;
    }> & {
        charge?: number;
        title?: string;
        chargeId?: mongoose.Types.ObjectId;
    }>;
    dayChargeNumber: number;
    distance: number;
    description?: string;
    country?: mongoose.Types.ObjectId;
    city?: mongoose.Types.ObjectId;
    merchant?: mongoose.Types.ObjectId;
    orderId?: number;
    parcelType?: string;
    showOrderNumber?: number;
    parcel?: mongoose.Types.ObjectId;
    weight?: number;
    startPickupDate?: NativeDate;
    endPickupDate?: NativeDate;
    startDeliveryDate?: NativeDate;
    endDeliveryDate?: NativeDate;
    time?: {
        end?: NativeDate;
        start?: NativeDate;
    };
    parcelsCount?: number;
    paymentCollectionRupees?: number;
    dateTime?: NativeDate;
    pickupDetails?: {
        cashOnDelivery: boolean;
        request: string;
        name?: string;
        description?: string;
        address?: string;
        merchantId?: mongoose.Types.ObjectId;
        postCode?: string;
        mobileNumber?: string;
        email?: string;
        location?: any;
        dateTime?: NativeDate;
        orderTimestamp?: NativeDate;
        userSignature?: string;
    };
    deliveryDetails?: {
        cashOnDelivery: boolean;
        name?: string;
        description?: string;
        address?: string;
        postCode?: string;
        mobileNumber?: string;
        email?: string;
        location?: any;
        orderTimestamp?: NativeDate;
        deliveryBoySignature?: string;
    };
    deliveryLocation?: any;
    vehicle?: mongoose.Types.ObjectId;
    totalCharge?: number;
    reason?: string;
    duration?: string;
    pickupExpress?: boolean;
    cashCollection?: number;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    trashed: boolean;
    status: string;
    isCustomer: boolean;
    cashOnDelivery: boolean;
    charges: mongoose.Types.DocumentArray<{
        charge?: number;
        title?: string;
        chargeId?: mongoose.Types.ObjectId;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        charge?: number;
        title?: string;
        chargeId?: mongoose.Types.ObjectId;
    }> & {
        charge?: number;
        title?: string;
        chargeId?: mongoose.Types.ObjectId;
    }>;
    dayChargeNumber: number;
    distance: number;
    description?: string;
    country?: mongoose.Types.ObjectId;
    city?: mongoose.Types.ObjectId;
    merchant?: mongoose.Types.ObjectId;
    orderId?: number;
    parcelType?: string;
    showOrderNumber?: number;
    parcel?: mongoose.Types.ObjectId;
    weight?: number;
    startPickupDate?: NativeDate;
    endPickupDate?: NativeDate;
    startDeliveryDate?: NativeDate;
    endDeliveryDate?: NativeDate;
    time?: {
        end?: NativeDate;
        start?: NativeDate;
    };
    parcelsCount?: number;
    paymentCollectionRupees?: number;
    dateTime?: NativeDate;
    pickupDetails?: {
        cashOnDelivery: boolean;
        request: string;
        name?: string;
        description?: string;
        address?: string;
        merchantId?: mongoose.Types.ObjectId;
        postCode?: string;
        mobileNumber?: string;
        email?: string;
        location?: any;
        dateTime?: NativeDate;
        orderTimestamp?: NativeDate;
        userSignature?: string;
    };
    deliveryDetails?: {
        cashOnDelivery: boolean;
        name?: string;
        description?: string;
        address?: string;
        postCode?: string;
        mobileNumber?: string;
        email?: string;
        location?: any;
        orderTimestamp?: NativeDate;
        deliveryBoySignature?: string;
    };
    deliveryLocation?: any;
    vehicle?: mongoose.Types.ObjectId;
    totalCharge?: number;
    reason?: string;
    duration?: string;
    pickupExpress?: boolean;
    cashCollection?: number;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    trashed: boolean;
    status: string;
    isCustomer: boolean;
    cashOnDelivery: boolean;
    charges: mongoose.Types.DocumentArray<{
        charge?: number;
        title?: string;
        chargeId?: mongoose.Types.ObjectId;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        charge?: number;
        title?: string;
        chargeId?: mongoose.Types.ObjectId;
    }> & {
        charge?: number;
        title?: string;
        chargeId?: mongoose.Types.ObjectId;
    }>;
    dayChargeNumber: number;
    distance: number;
    description?: string;
    country?: mongoose.Types.ObjectId;
    city?: mongoose.Types.ObjectId;
    merchant?: mongoose.Types.ObjectId;
    orderId?: number;
    parcelType?: string;
    showOrderNumber?: number;
    parcel?: mongoose.Types.ObjectId;
    weight?: number;
    startPickupDate?: NativeDate;
    endPickupDate?: NativeDate;
    startDeliveryDate?: NativeDate;
    endDeliveryDate?: NativeDate;
    time?: {
        end?: NativeDate;
        start?: NativeDate;
    };
    parcelsCount?: number;
    paymentCollectionRupees?: number;
    dateTime?: NativeDate;
    pickupDetails?: {
        cashOnDelivery: boolean;
        request: string;
        name?: string;
        description?: string;
        address?: string;
        merchantId?: mongoose.Types.ObjectId;
        postCode?: string;
        mobileNumber?: string;
        email?: string;
        location?: any;
        dateTime?: NativeDate;
        orderTimestamp?: NativeDate;
        userSignature?: string;
    };
    deliveryDetails?: {
        cashOnDelivery: boolean;
        name?: string;
        description?: string;
        address?: string;
        postCode?: string;
        mobileNumber?: string;
        email?: string;
        location?: any;
        orderTimestamp?: NativeDate;
        deliveryBoySignature?: string;
    };
    deliveryLocation?: any;
    vehicle?: mongoose.Types.ObjectId;
    totalCharge?: number;
    reason?: string;
    duration?: string;
    pickupExpress?: boolean;
    cashCollection?: number;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Model;
