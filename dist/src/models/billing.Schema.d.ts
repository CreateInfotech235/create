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
    merchantId: mongoose.Types.ObjectId;
    orderId: string;
    totalCharge: number;
    isApproved: boolean;
    deliveryBoyId: mongoose.Types.ObjectId;
    isPaid: boolean;
    showOrderId: string;
    subOrderdata: mongoose.Types.DocumentArray<{
        pickupTime: number;
        deliveryTime: number;
        amountOfPackage: number;
        chargePer: number;
        deliveryLocation?: any;
        distance?: number;
        subOrderId?: string;
        pickupLocation?: any;
        pickupAddress?: string;
        deliveryAddress?: string;
        averageTime?: string;
        DelawareDate?: number;
        isCashOnDelivery?: boolean;
        orderStatus?: string;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        pickupTime: number;
        deliveryTime: number;
        amountOfPackage: number;
        chargePer: number;
        deliveryLocation?: any;
        distance?: number;
        subOrderId?: string;
        pickupLocation?: any;
        pickupAddress?: string;
        deliveryAddress?: string;
        averageTime?: string;
        DelawareDate?: number;
        isCashOnDelivery?: boolean;
        orderStatus?: string;
    }> & {
        pickupTime: number;
        deliveryTime: number;
        amountOfPackage: number;
        chargePer: number;
        deliveryLocation?: any;
        distance?: number;
        subOrderId?: string;
        pickupLocation?: any;
        pickupAddress?: string;
        deliveryAddress?: string;
        averageTime?: string;
        DelawareDate?: number;
        isCashOnDelivery?: boolean;
        orderStatus?: string;
    }>;
    panaltyAmount: number;
    interestAmount: number;
    paidAmount: number;
    totalamountOfPackage: number;
    chargeMethod?: string;
    charge?: number;
    reason?: string;
    orderStatus?: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    merchantId: mongoose.Types.ObjectId;
    orderId: string;
    totalCharge: number;
    isApproved: boolean;
    deliveryBoyId: mongoose.Types.ObjectId;
    isPaid: boolean;
    showOrderId: string;
    subOrderdata: mongoose.Types.DocumentArray<{
        pickupTime: number;
        deliveryTime: number;
        amountOfPackage: number;
        chargePer: number;
        deliveryLocation?: any;
        distance?: number;
        subOrderId?: string;
        pickupLocation?: any;
        pickupAddress?: string;
        deliveryAddress?: string;
        averageTime?: string;
        DelawareDate?: number;
        isCashOnDelivery?: boolean;
        orderStatus?: string;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        pickupTime: number;
        deliveryTime: number;
        amountOfPackage: number;
        chargePer: number;
        deliveryLocation?: any;
        distance?: number;
        subOrderId?: string;
        pickupLocation?: any;
        pickupAddress?: string;
        deliveryAddress?: string;
        averageTime?: string;
        DelawareDate?: number;
        isCashOnDelivery?: boolean;
        orderStatus?: string;
    }> & {
        pickupTime: number;
        deliveryTime: number;
        amountOfPackage: number;
        chargePer: number;
        deliveryLocation?: any;
        distance?: number;
        subOrderId?: string;
        pickupLocation?: any;
        pickupAddress?: string;
        deliveryAddress?: string;
        averageTime?: string;
        DelawareDate?: number;
        isCashOnDelivery?: boolean;
        orderStatus?: string;
    }>;
    panaltyAmount: number;
    interestAmount: number;
    paidAmount: number;
    totalamountOfPackage: number;
    chargeMethod?: string;
    charge?: number;
    reason?: string;
    orderStatus?: string;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    merchantId: mongoose.Types.ObjectId;
    orderId: string;
    totalCharge: number;
    isApproved: boolean;
    deliveryBoyId: mongoose.Types.ObjectId;
    isPaid: boolean;
    showOrderId: string;
    subOrderdata: mongoose.Types.DocumentArray<{
        pickupTime: number;
        deliveryTime: number;
        amountOfPackage: number;
        chargePer: number;
        deliveryLocation?: any;
        distance?: number;
        subOrderId?: string;
        pickupLocation?: any;
        pickupAddress?: string;
        deliveryAddress?: string;
        averageTime?: string;
        DelawareDate?: number;
        isCashOnDelivery?: boolean;
        orderStatus?: string;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        pickupTime: number;
        deliveryTime: number;
        amountOfPackage: number;
        chargePer: number;
        deliveryLocation?: any;
        distance?: number;
        subOrderId?: string;
        pickupLocation?: any;
        pickupAddress?: string;
        deliveryAddress?: string;
        averageTime?: string;
        DelawareDate?: number;
        isCashOnDelivery?: boolean;
        orderStatus?: string;
    }> & {
        pickupTime: number;
        deliveryTime: number;
        amountOfPackage: number;
        chargePer: number;
        deliveryLocation?: any;
        distance?: number;
        subOrderId?: string;
        pickupLocation?: any;
        pickupAddress?: string;
        deliveryAddress?: string;
        averageTime?: string;
        DelawareDate?: number;
        isCashOnDelivery?: boolean;
        orderStatus?: string;
    }>;
    panaltyAmount: number;
    interestAmount: number;
    paidAmount: number;
    totalamountOfPackage: number;
    chargeMethod?: string;
    charge?: number;
    reason?: string;
    orderStatus?: string;
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
    merchantId: mongoose.Types.ObjectId;
    orderId: string;
    totalCharge: number;
    isApproved: boolean;
    deliveryBoyId: mongoose.Types.ObjectId;
    isPaid: boolean;
    showOrderId: string;
    subOrderdata: mongoose.Types.DocumentArray<{
        pickupTime: number;
        deliveryTime: number;
        amountOfPackage: number;
        chargePer: number;
        deliveryLocation?: any;
        distance?: number;
        subOrderId?: string;
        pickupLocation?: any;
        pickupAddress?: string;
        deliveryAddress?: string;
        averageTime?: string;
        DelawareDate?: number;
        isCashOnDelivery?: boolean;
        orderStatus?: string;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        pickupTime: number;
        deliveryTime: number;
        amountOfPackage: number;
        chargePer: number;
        deliveryLocation?: any;
        distance?: number;
        subOrderId?: string;
        pickupLocation?: any;
        pickupAddress?: string;
        deliveryAddress?: string;
        averageTime?: string;
        DelawareDate?: number;
        isCashOnDelivery?: boolean;
        orderStatus?: string;
    }> & {
        pickupTime: number;
        deliveryTime: number;
        amountOfPackage: number;
        chargePer: number;
        deliveryLocation?: any;
        distance?: number;
        subOrderId?: string;
        pickupLocation?: any;
        pickupAddress?: string;
        deliveryAddress?: string;
        averageTime?: string;
        DelawareDate?: number;
        isCashOnDelivery?: boolean;
        orderStatus?: string;
    }>;
    panaltyAmount: number;
    interestAmount: number;
    paidAmount: number;
    totalamountOfPackage: number;
    chargeMethod?: string;
    charge?: number;
    reason?: string;
    orderStatus?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    merchantId: mongoose.Types.ObjectId;
    orderId: string;
    totalCharge: number;
    isApproved: boolean;
    deliveryBoyId: mongoose.Types.ObjectId;
    isPaid: boolean;
    showOrderId: string;
    subOrderdata: mongoose.Types.DocumentArray<{
        pickupTime: number;
        deliveryTime: number;
        amountOfPackage: number;
        chargePer: number;
        deliveryLocation?: any;
        distance?: number;
        subOrderId?: string;
        pickupLocation?: any;
        pickupAddress?: string;
        deliveryAddress?: string;
        averageTime?: string;
        DelawareDate?: number;
        isCashOnDelivery?: boolean;
        orderStatus?: string;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        pickupTime: number;
        deliveryTime: number;
        amountOfPackage: number;
        chargePer: number;
        deliveryLocation?: any;
        distance?: number;
        subOrderId?: string;
        pickupLocation?: any;
        pickupAddress?: string;
        deliveryAddress?: string;
        averageTime?: string;
        DelawareDate?: number;
        isCashOnDelivery?: boolean;
        orderStatus?: string;
    }> & {
        pickupTime: number;
        deliveryTime: number;
        amountOfPackage: number;
        chargePer: number;
        deliveryLocation?: any;
        distance?: number;
        subOrderId?: string;
        pickupLocation?: any;
        pickupAddress?: string;
        deliveryAddress?: string;
        averageTime?: string;
        DelawareDate?: number;
        isCashOnDelivery?: boolean;
        orderStatus?: string;
    }>;
    panaltyAmount: number;
    interestAmount: number;
    paidAmount: number;
    totalamountOfPackage: number;
    chargeMethod?: string;
    charge?: number;
    reason?: string;
    orderStatus?: string;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    merchantId: mongoose.Types.ObjectId;
    orderId: string;
    totalCharge: number;
    isApproved: boolean;
    deliveryBoyId: mongoose.Types.ObjectId;
    isPaid: boolean;
    showOrderId: string;
    subOrderdata: mongoose.Types.DocumentArray<{
        pickupTime: number;
        deliveryTime: number;
        amountOfPackage: number;
        chargePer: number;
        deliveryLocation?: any;
        distance?: number;
        subOrderId?: string;
        pickupLocation?: any;
        pickupAddress?: string;
        deliveryAddress?: string;
        averageTime?: string;
        DelawareDate?: number;
        isCashOnDelivery?: boolean;
        orderStatus?: string;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        pickupTime: number;
        deliveryTime: number;
        amountOfPackage: number;
        chargePer: number;
        deliveryLocation?: any;
        distance?: number;
        subOrderId?: string;
        pickupLocation?: any;
        pickupAddress?: string;
        deliveryAddress?: string;
        averageTime?: string;
        DelawareDate?: number;
        isCashOnDelivery?: boolean;
        orderStatus?: string;
    }> & {
        pickupTime: number;
        deliveryTime: number;
        amountOfPackage: number;
        chargePer: number;
        deliveryLocation?: any;
        distance?: number;
        subOrderId?: string;
        pickupLocation?: any;
        pickupAddress?: string;
        deliveryAddress?: string;
        averageTime?: string;
        DelawareDate?: number;
        isCashOnDelivery?: boolean;
        orderStatus?: string;
    }>;
    panaltyAmount: number;
    interestAmount: number;
    paidAmount: number;
    totalamountOfPackage: number;
    chargeMethod?: string;
    charge?: number;
    reason?: string;
    orderStatus?: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Model;
