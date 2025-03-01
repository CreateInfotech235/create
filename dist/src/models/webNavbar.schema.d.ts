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
declare const _default: mongoose.Model<{
    menuList: mongoose.Types.DocumentArray<{
        name?: string;
        path?: string;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name?: string;
        path?: string;
    }> & {
        name?: string;
        path?: string;
    }>;
    logo?: {
        path?: string;
        img?: string;
    };
    favicon?: {
        path?: string;
        img?: string;
    };
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    menuList: mongoose.Types.DocumentArray<{
        name?: string;
        path?: string;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name?: string;
        path?: string;
    }> & {
        name?: string;
        path?: string;
    }>;
    logo?: {
        path?: string;
        img?: string;
    };
    favicon?: {
        path?: string;
        img?: string;
    };
}> & {
    menuList: mongoose.Types.DocumentArray<{
        name?: string;
        path?: string;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name?: string;
        path?: string;
    }> & {
        name?: string;
        path?: string;
    }>;
    logo?: {
        path?: string;
        img?: string;
    };
    favicon?: {
        path?: string;
        img?: string;
    };
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    menuList: mongoose.Types.DocumentArray<{
        name?: string;
        path?: string;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name?: string;
        path?: string;
    }> & {
        name?: string;
        path?: string;
    }>;
    logo?: {
        path?: string;
        img?: string;
    };
    favicon?: {
        path?: string;
        img?: string;
    };
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    menuList: mongoose.Types.DocumentArray<{
        name?: string;
        path?: string;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name?: string;
        path?: string;
    }> & {
        name?: string;
        path?: string;
    }>;
    logo?: {
        path?: string;
        img?: string;
    };
    favicon?: {
        path?: string;
        img?: string;
    };
}>> & mongoose.FlatRecord<{
    menuList: mongoose.Types.DocumentArray<{
        name?: string;
        path?: string;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name?: string;
        path?: string;
    }> & {
        name?: string;
        path?: string;
    }>;
    logo?: {
        path?: string;
        img?: string;
    };
    favicon?: {
        path?: string;
        img?: string;
    };
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
