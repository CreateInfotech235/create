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
    subOrderId: string;
    isPaid: boolean;
    statusOfOrder: "REJECTED" | "ASSIGNED" | "UNASSIGNED" | "ACCEPTED" | "CANCELLED" | "DELIVERED" | "PICKED_UP" | "DEPARTED" | "ARRIVED";
    merchantId?: mongoose.Types.ObjectId;
    orderId?: string;
    adminId?: mongoose.Types.ObjectId;
    deliveryManId?: mongoose.Types.ObjectId;
    orderIdForMerchant?: string;
    miles?: number;
    payPerMiles?: number;
    totalPaytoDeliveryMan?: number;
    totalPaytoAdmin?: number;
    deliveryManWallet?: number;
    deliveryManType?: "ADMINDELIVERYMAN" | "MERCHANTDELIVERYMAN";
    paymentStatus?: "CASHONDELIVERY" | "DIRECTPAYMENT";
    orderPickupTime?: NativeDate;
    orderDeleverTime?: NativeDate;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    subOrderId: string;
    isPaid: boolean;
    statusOfOrder: "REJECTED" | "ASSIGNED" | "UNASSIGNED" | "ACCEPTED" | "CANCELLED" | "DELIVERED" | "PICKED_UP" | "DEPARTED" | "ARRIVED";
    merchantId?: mongoose.Types.ObjectId;
    orderId?: string;
    adminId?: mongoose.Types.ObjectId;
    deliveryManId?: mongoose.Types.ObjectId;
    orderIdForMerchant?: string;
    miles?: number;
    payPerMiles?: number;
    totalPaytoDeliveryMan?: number;
    totalPaytoAdmin?: number;
    deliveryManWallet?: number;
    deliveryManType?: "ADMINDELIVERYMAN" | "MERCHANTDELIVERYMAN";
    paymentStatus?: "CASHONDELIVERY" | "DIRECTPAYMENT";
    orderPickupTime?: NativeDate;
    orderDeleverTime?: NativeDate;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    subOrderId: string;
    isPaid: boolean;
    statusOfOrder: "REJECTED" | "ASSIGNED" | "UNASSIGNED" | "ACCEPTED" | "CANCELLED" | "DELIVERED" | "PICKED_UP" | "DEPARTED" | "ARRIVED";
    merchantId?: mongoose.Types.ObjectId;
    orderId?: string;
    adminId?: mongoose.Types.ObjectId;
    deliveryManId?: mongoose.Types.ObjectId;
    orderIdForMerchant?: string;
    miles?: number;
    payPerMiles?: number;
    totalPaytoDeliveryMan?: number;
    totalPaytoAdmin?: number;
    deliveryManWallet?: number;
    deliveryManType?: "ADMINDELIVERYMAN" | "MERCHANTDELIVERYMAN";
    paymentStatus?: "CASHONDELIVERY" | "DIRECTPAYMENT";
    orderPickupTime?: NativeDate;
    orderDeleverTime?: NativeDate;
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
    subOrderId: string;
    isPaid: boolean;
    statusOfOrder: "REJECTED" | "ASSIGNED" | "UNASSIGNED" | "ACCEPTED" | "CANCELLED" | "DELIVERED" | "PICKED_UP" | "DEPARTED" | "ARRIVED";
    merchantId?: mongoose.Types.ObjectId;
    orderId?: string;
    adminId?: mongoose.Types.ObjectId;
    deliveryManId?: mongoose.Types.ObjectId;
    orderIdForMerchant?: string;
    miles?: number;
    payPerMiles?: number;
    totalPaytoDeliveryMan?: number;
    totalPaytoAdmin?: number;
    deliveryManWallet?: number;
    deliveryManType?: "ADMINDELIVERYMAN" | "MERCHANTDELIVERYMAN";
    paymentStatus?: "CASHONDELIVERY" | "DIRECTPAYMENT";
    orderPickupTime?: NativeDate;
    orderDeleverTime?: NativeDate;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    subOrderId: string;
    isPaid: boolean;
    statusOfOrder: "REJECTED" | "ASSIGNED" | "UNASSIGNED" | "ACCEPTED" | "CANCELLED" | "DELIVERED" | "PICKED_UP" | "DEPARTED" | "ARRIVED";
    merchantId?: mongoose.Types.ObjectId;
    orderId?: string;
    adminId?: mongoose.Types.ObjectId;
    deliveryManId?: mongoose.Types.ObjectId;
    orderIdForMerchant?: string;
    miles?: number;
    payPerMiles?: number;
    totalPaytoDeliveryMan?: number;
    totalPaytoAdmin?: number;
    deliveryManWallet?: number;
    deliveryManType?: "ADMINDELIVERYMAN" | "MERCHANTDELIVERYMAN";
    paymentStatus?: "CASHONDELIVERY" | "DIRECTPAYMENT";
    orderPickupTime?: NativeDate;
    orderDeleverTime?: NativeDate;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    subOrderId: string;
    isPaid: boolean;
    statusOfOrder: "REJECTED" | "ASSIGNED" | "UNASSIGNED" | "ACCEPTED" | "CANCELLED" | "DELIVERED" | "PICKED_UP" | "DEPARTED" | "ARRIVED";
    merchantId?: mongoose.Types.ObjectId;
    orderId?: string;
    adminId?: mongoose.Types.ObjectId;
    deliveryManId?: mongoose.Types.ObjectId;
    orderIdForMerchant?: string;
    miles?: number;
    payPerMiles?: number;
    totalPaytoDeliveryMan?: number;
    totalPaytoAdmin?: number;
    deliveryManWallet?: number;
    deliveryManType?: "ADMINDELIVERYMAN" | "MERCHANTDELIVERYMAN";
    paymentStatus?: "CASHONDELIVERY" | "DIRECTPAYMENT";
    orderPickupTime?: NativeDate;
    orderDeleverTime?: NativeDate;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Model;
