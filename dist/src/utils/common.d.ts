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
import { Types } from 'mongoose';
import { TRANSACTION_TYPE } from '../enum';
import { encryptPasswordParams } from './types/expressTypes';
export declare const sendMailService: (to: string, subject: string, text: string) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
export declare const passwordValidation: (password: string, hashPassword: string) => Promise<boolean>;
export declare const encryptPassword: ({ password }: encryptPasswordParams) => Promise<string>;
export declare const generateIntRandomNo: (start?: number, end?: number) => number;
export declare const uploadFile: (fileName: string, base64FormatImage: string, fileType: string) => Promise<string>;
export declare const createNotification: ({ userId, title, message, type, orderId, senderId, adminId, }: {
    userId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: 'ADMIN' | 'MERCHANT' | 'DELIVERYMAN';
    orderId?: number;
    senderId?: mongoose.Types.ObjectId;
    adminId?: mongoose.Types.ObjectId;
}) => Promise<mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    createdAt: NativeDate;
    type: "ADMIN" | "MERCHANT" | "DELIVERYMAN";
    message: string;
    title: string;
    userId: Types.ObjectId;
    isRead: boolean;
    orderId?: number;
    senderId?: Types.ObjectId;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    createdAt: NativeDate;
    type: "ADMIN" | "MERCHANT" | "DELIVERYMAN";
    message: string;
    title: string;
    userId: Types.ObjectId;
    isRead: boolean;
    orderId?: number;
    senderId?: Types.ObjectId;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare const removeUploadedFile: (fileName: string) => void;
export declare const createAuthTokens: (id: Types.ObjectId) => {
    accessToken: string;
    refreshToken: string;
};
export declare const emailOrMobileOtp: (email: string, message: string) => Promise<void>;
export declare const emailSend: (email: string, subject: string, message: string) => Promise<void>;
export declare const updateWallet: (amount: number, adminId: string, personId: string, transactionType: TRANSACTION_TYPE, transactionMessage: string, isCustomer?: boolean) => Promise<void>;
export declare const getMongoCommonPagination: ({ pageCount, pageLimit, }: IPagination) => ({
    $facet: {
        count: {
            $count: string;
        }[];
        data: ({
            $skip: number;
            $limit?: undefined;
        } | {
            $limit: number;
            $skip?: undefined;
        })[];
    };
    $project?: undefined;
} | {
    $project: {
        totalDataCount: {
            $ifNull: (number | {
                $arrayElemAt: (string | number)[];
            })[];
        };
        data: number;
    };
    $facet?: undefined;
})[];
