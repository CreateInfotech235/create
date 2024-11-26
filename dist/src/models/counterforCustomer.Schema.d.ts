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
declare const OrderCounter: mongoose.Model<{
    sequence_value: number;
    _id?: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    sequence_value: number;
    _id?: string;
}> & {
    sequence_value: number;
    _id?: string;
} & Required<{
    _id: string;
}> & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    sequence_value: number;
    _id?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    sequence_value: number;
    _id?: string;
}>> & mongoose.FlatRecord<{
    sequence_value: number;
    _id?: string;
}> & Required<{
    _id: string;
}> & {
    __v: number;
}>>;
export default OrderCounter;
