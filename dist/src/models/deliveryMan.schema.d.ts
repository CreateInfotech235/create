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
    createdByAdmin: boolean;
    isVerified: boolean;
    status: string;
    balance: number;
    earning: number;
    provider: string;
    isCustomer: boolean;
    language: string;
    createdByMerchant: boolean;
    chargeMethod: string;
    charge: number;
    adminCharge: number;
    firstName?: string;
    lastName?: string;
    address?: string;
    merchantId?: mongoose.Types.ObjectId;
    merchant?: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    postCode?: string;
    email?: string;
    location?: {
        coordinates: any[];
        type?: string;
    };
    password?: string;
    contactNumber?: string;
    countryId?: mongoose.Types.ObjectId;
    cityId?: mongoose.Types.ObjectId;
    defaultLocation?: {
        coordinates: any[];
        type?: string;
    };
    bankData?: {
        name?: string;
        accountNumber?: number;
        permanentBankName?: string;
        ifscCode?: string;
    };
    image?: string;
    providerId?: string;
    emergencyContact?: {
        number?: number;
        name?: string;
    };
    showDeliveryManNumber?: number;
    deviceToken?: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    trashed: boolean;
    createdByAdmin: boolean;
    isVerified: boolean;
    status: string;
    balance: number;
    earning: number;
    provider: string;
    isCustomer: boolean;
    language: string;
    createdByMerchant: boolean;
    chargeMethod: string;
    charge: number;
    adminCharge: number;
    firstName?: string;
    lastName?: string;
    address?: string;
    merchantId?: mongoose.Types.ObjectId;
    merchant?: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    postCode?: string;
    email?: string;
    location?: {
        coordinates: any[];
        type?: string;
    };
    password?: string;
    contactNumber?: string;
    countryId?: mongoose.Types.ObjectId;
    cityId?: mongoose.Types.ObjectId;
    defaultLocation?: {
        coordinates: any[];
        type?: string;
    };
    bankData?: {
        name?: string;
        accountNumber?: number;
        permanentBankName?: string;
        ifscCode?: string;
    };
    image?: string;
    providerId?: string;
    emergencyContact?: {
        number?: number;
        name?: string;
    };
    showDeliveryManNumber?: number;
    deviceToken?: string;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    trashed: boolean;
    createdByAdmin: boolean;
    isVerified: boolean;
    status: string;
    balance: number;
    earning: number;
    provider: string;
    isCustomer: boolean;
    language: string;
    createdByMerchant: boolean;
    chargeMethod: string;
    charge: number;
    adminCharge: number;
    firstName?: string;
    lastName?: string;
    address?: string;
    merchantId?: mongoose.Types.ObjectId;
    merchant?: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    postCode?: string;
    email?: string;
    location?: {
        coordinates: any[];
        type?: string;
    };
    password?: string;
    contactNumber?: string;
    countryId?: mongoose.Types.ObjectId;
    cityId?: mongoose.Types.ObjectId;
    defaultLocation?: {
        coordinates: any[];
        type?: string;
    };
    bankData?: {
        name?: string;
        accountNumber?: number;
        permanentBankName?: string;
        ifscCode?: string;
    };
    image?: string;
    providerId?: string;
    emergencyContact?: {
        number?: number;
        name?: string;
    };
    showDeliveryManNumber?: number;
    deviceToken?: string;
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
    createdByAdmin: boolean;
    isVerified: boolean;
    status: string;
    balance: number;
    earning: number;
    provider: string;
    isCustomer: boolean;
    language: string;
    createdByMerchant: boolean;
    chargeMethod: string;
    charge: number;
    adminCharge: number;
    firstName?: string;
    lastName?: string;
    address?: string;
    merchantId?: mongoose.Types.ObjectId;
    merchant?: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    postCode?: string;
    email?: string;
    location?: {
        coordinates: any[];
        type?: string;
    };
    password?: string;
    contactNumber?: string;
    countryId?: mongoose.Types.ObjectId;
    cityId?: mongoose.Types.ObjectId;
    defaultLocation?: {
        coordinates: any[];
        type?: string;
    };
    bankData?: {
        name?: string;
        accountNumber?: number;
        permanentBankName?: string;
        ifscCode?: string;
    };
    image?: string;
    providerId?: string;
    emergencyContact?: {
        number?: number;
        name?: string;
    };
    showDeliveryManNumber?: number;
    deviceToken?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    trashed: boolean;
    createdByAdmin: boolean;
    isVerified: boolean;
    status: string;
    balance: number;
    earning: number;
    provider: string;
    isCustomer: boolean;
    language: string;
    createdByMerchant: boolean;
    chargeMethod: string;
    charge: number;
    adminCharge: number;
    firstName?: string;
    lastName?: string;
    address?: string;
    merchantId?: mongoose.Types.ObjectId;
    merchant?: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    postCode?: string;
    email?: string;
    location?: {
        coordinates: any[];
        type?: string;
    };
    password?: string;
    contactNumber?: string;
    countryId?: mongoose.Types.ObjectId;
    cityId?: mongoose.Types.ObjectId;
    defaultLocation?: {
        coordinates: any[];
        type?: string;
    };
    bankData?: {
        name?: string;
        accountNumber?: number;
        permanentBankName?: string;
        ifscCode?: string;
    };
    image?: string;
    providerId?: string;
    emergencyContact?: {
        number?: number;
        name?: string;
    };
    showDeliveryManNumber?: number;
    deviceToken?: string;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    trashed: boolean;
    createdByAdmin: boolean;
    isVerified: boolean;
    status: string;
    balance: number;
    earning: number;
    provider: string;
    isCustomer: boolean;
    language: string;
    createdByMerchant: boolean;
    chargeMethod: string;
    charge: number;
    adminCharge: number;
    firstName?: string;
    lastName?: string;
    address?: string;
    merchantId?: mongoose.Types.ObjectId;
    merchant?: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    postCode?: string;
    email?: string;
    location?: {
        coordinates: any[];
        type?: string;
    };
    password?: string;
    contactNumber?: string;
    countryId?: mongoose.Types.ObjectId;
    cityId?: mongoose.Types.ObjectId;
    defaultLocation?: {
        coordinates: any[];
        type?: string;
    };
    bankData?: {
        name?: string;
        accountNumber?: number;
        permanentBankName?: string;
        ifscCode?: string;
    };
    image?: string;
    providerId?: string;
    emergencyContact?: {
        number?: number;
        name?: string;
    };
    showDeliveryManNumber?: number;
    deviceToken?: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Model;
