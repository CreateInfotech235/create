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
    gellary: string[];
    socialMedia: string[];
    extraLinks: mongoose.Types.DocumentArray<{
        subLink: mongoose.Types.DocumentArray<{
            link?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            link?: string;
            title?: string;
        }> & {
            link?: string;
            title?: string;
        }>;
        title?: string;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        subLink: mongoose.Types.DocumentArray<{
            link?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            link?: string;
            title?: string;
        }> & {
            link?: string;
            title?: string;
        }>;
        title?: string;
    }> & {
        subLink: mongoose.Types.DocumentArray<{
            link?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            link?: string;
            title?: string;
        }> & {
            link?: string;
            title?: string;
        }>;
        title?: string;
    }>;
    description?: string;
    logo?: string;
    copyright?: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    gellary: string[];
    socialMedia: string[];
    extraLinks: mongoose.Types.DocumentArray<{
        subLink: mongoose.Types.DocumentArray<{
            link?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            link?: string;
            title?: string;
        }> & {
            link?: string;
            title?: string;
        }>;
        title?: string;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        subLink: mongoose.Types.DocumentArray<{
            link?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            link?: string;
            title?: string;
        }> & {
            link?: string;
            title?: string;
        }>;
        title?: string;
    }> & {
        subLink: mongoose.Types.DocumentArray<{
            link?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            link?: string;
            title?: string;
        }> & {
            link?: string;
            title?: string;
        }>;
        title?: string;
    }>;
    description?: string;
    logo?: string;
    copyright?: string;
}> & {
    gellary: string[];
    socialMedia: string[];
    extraLinks: mongoose.Types.DocumentArray<{
        subLink: mongoose.Types.DocumentArray<{
            link?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            link?: string;
            title?: string;
        }> & {
            link?: string;
            title?: string;
        }>;
        title?: string;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        subLink: mongoose.Types.DocumentArray<{
            link?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            link?: string;
            title?: string;
        }> & {
            link?: string;
            title?: string;
        }>;
        title?: string;
    }> & {
        subLink: mongoose.Types.DocumentArray<{
            link?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            link?: string;
            title?: string;
        }> & {
            link?: string;
            title?: string;
        }>;
        title?: string;
    }>;
    description?: string;
    logo?: string;
    copyright?: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    gellary: string[];
    socialMedia: string[];
    extraLinks: mongoose.Types.DocumentArray<{
        subLink: mongoose.Types.DocumentArray<{
            link?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            link?: string;
            title?: string;
        }> & {
            link?: string;
            title?: string;
        }>;
        title?: string;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        subLink: mongoose.Types.DocumentArray<{
            link?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            link?: string;
            title?: string;
        }> & {
            link?: string;
            title?: string;
        }>;
        title?: string;
    }> & {
        subLink: mongoose.Types.DocumentArray<{
            link?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            link?: string;
            title?: string;
        }> & {
            link?: string;
            title?: string;
        }>;
        title?: string;
    }>;
    description?: string;
    logo?: string;
    copyright?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    gellary: string[];
    socialMedia: string[];
    extraLinks: mongoose.Types.DocumentArray<{
        subLink: mongoose.Types.DocumentArray<{
            link?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            link?: string;
            title?: string;
        }> & {
            link?: string;
            title?: string;
        }>;
        title?: string;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        subLink: mongoose.Types.DocumentArray<{
            link?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            link?: string;
            title?: string;
        }> & {
            link?: string;
            title?: string;
        }>;
        title?: string;
    }> & {
        subLink: mongoose.Types.DocumentArray<{
            link?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            link?: string;
            title?: string;
        }> & {
            link?: string;
            title?: string;
        }>;
        title?: string;
    }>;
    description?: string;
    logo?: string;
    copyright?: string;
}>> & mongoose.FlatRecord<{
    gellary: string[];
    socialMedia: string[];
    extraLinks: mongoose.Types.DocumentArray<{
        subLink: mongoose.Types.DocumentArray<{
            link?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            link?: string;
            title?: string;
        }> & {
            link?: string;
            title?: string;
        }>;
        title?: string;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        subLink: mongoose.Types.DocumentArray<{
            link?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            link?: string;
            title?: string;
        }> & {
            link?: string;
            title?: string;
        }>;
        title?: string;
    }> & {
        subLink: mongoose.Types.DocumentArray<{
            link?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            link?: string;
            title?: string;
        }> & {
            link?: string;
            title?: string;
        }>;
        title?: string;
    }>;
    description?: string;
    logo?: string;
    copyright?: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
