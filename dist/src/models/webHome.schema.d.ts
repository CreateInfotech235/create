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
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    header?: {
        status: mongoose.Types.DocumentArray<{
            number?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            number?: string;
            title?: string;
        }> & {
            number?: string;
            title?: string;
        }>;
        isShow: boolean;
        description?: string;
        title?: string;
        bgImage?: string;
    };
    services?: {
        data: mongoose.Types.DocumentArray<{
            description?: string;
            image?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            image?: string;
            title?: string;
        }> & {
            description?: string;
            image?: string;
            title?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
    deliverySolutions?: {
        data: mongoose.Types.DocumentArray<{
            description?: string;
            image?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            image?: string;
            title?: string;
        }> & {
            description?: string;
            image?: string;
            title?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
    ourDelivery?: {
        isShow: boolean;
        subpart2: mongoose.Types.DocumentArray<{
            description?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            title?: string;
        }> & {
            description?: string;
            title?: string;
        }>;
        title?: string;
        subpart1?: {
            description?: string;
            image?: string;
            title?: string;
        };
    };
    achivment?: {
        data: mongoose.Types.DocumentArray<{
            number?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            number?: string;
            title?: string;
        }> & {
            number?: string;
            title?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
    whyWeCourier?: {
        data: mongoose.Types.DocumentArray<{
            description?: string;
            image?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            image?: string;
            title?: string;
        }> & {
            description?: string;
            image?: string;
            title?: string;
        }>;
        isShow: boolean;
        description?: string;
        title?: string;
        subTitle?: string;
    };
    bestPartner?: {
        data: mongoose.Types.DocumentArray<{
            image?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            image?: string;
        }> & {
            image?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    header?: {
        status: mongoose.Types.DocumentArray<{
            number?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            number?: string;
            title?: string;
        }> & {
            number?: string;
            title?: string;
        }>;
        isShow: boolean;
        description?: string;
        title?: string;
        bgImage?: string;
    };
    services?: {
        data: mongoose.Types.DocumentArray<{
            description?: string;
            image?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            image?: string;
            title?: string;
        }> & {
            description?: string;
            image?: string;
            title?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
    deliverySolutions?: {
        data: mongoose.Types.DocumentArray<{
            description?: string;
            image?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            image?: string;
            title?: string;
        }> & {
            description?: string;
            image?: string;
            title?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
    ourDelivery?: {
        isShow: boolean;
        subpart2: mongoose.Types.DocumentArray<{
            description?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            title?: string;
        }> & {
            description?: string;
            title?: string;
        }>;
        title?: string;
        subpart1?: {
            description?: string;
            image?: string;
            title?: string;
        };
    };
    achivment?: {
        data: mongoose.Types.DocumentArray<{
            number?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            number?: string;
            title?: string;
        }> & {
            number?: string;
            title?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
    whyWeCourier?: {
        data: mongoose.Types.DocumentArray<{
            description?: string;
            image?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            image?: string;
            title?: string;
        }> & {
            description?: string;
            image?: string;
            title?: string;
        }>;
        isShow: boolean;
        description?: string;
        title?: string;
        subTitle?: string;
    };
    bestPartner?: {
        data: mongoose.Types.DocumentArray<{
            image?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            image?: string;
        }> & {
            image?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    header?: {
        status: mongoose.Types.DocumentArray<{
            number?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            number?: string;
            title?: string;
        }> & {
            number?: string;
            title?: string;
        }>;
        isShow: boolean;
        description?: string;
        title?: string;
        bgImage?: string;
    };
    services?: {
        data: mongoose.Types.DocumentArray<{
            description?: string;
            image?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            image?: string;
            title?: string;
        }> & {
            description?: string;
            image?: string;
            title?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
    deliverySolutions?: {
        data: mongoose.Types.DocumentArray<{
            description?: string;
            image?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            image?: string;
            title?: string;
        }> & {
            description?: string;
            image?: string;
            title?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
    ourDelivery?: {
        isShow: boolean;
        subpart2: mongoose.Types.DocumentArray<{
            description?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            title?: string;
        }> & {
            description?: string;
            title?: string;
        }>;
        title?: string;
        subpart1?: {
            description?: string;
            image?: string;
            title?: string;
        };
    };
    achivment?: {
        data: mongoose.Types.DocumentArray<{
            number?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            number?: string;
            title?: string;
        }> & {
            number?: string;
            title?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
    whyWeCourier?: {
        data: mongoose.Types.DocumentArray<{
            description?: string;
            image?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            image?: string;
            title?: string;
        }> & {
            description?: string;
            image?: string;
            title?: string;
        }>;
        isShow: boolean;
        description?: string;
        title?: string;
        subTitle?: string;
    };
    bestPartner?: {
        data: mongoose.Types.DocumentArray<{
            image?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            image?: string;
        }> & {
            image?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    header?: {
        status: mongoose.Types.DocumentArray<{
            number?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            number?: string;
            title?: string;
        }> & {
            number?: string;
            title?: string;
        }>;
        isShow: boolean;
        description?: string;
        title?: string;
        bgImage?: string;
    };
    services?: {
        data: mongoose.Types.DocumentArray<{
            description?: string;
            image?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            image?: string;
            title?: string;
        }> & {
            description?: string;
            image?: string;
            title?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
    deliverySolutions?: {
        data: mongoose.Types.DocumentArray<{
            description?: string;
            image?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            image?: string;
            title?: string;
        }> & {
            description?: string;
            image?: string;
            title?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
    ourDelivery?: {
        isShow: boolean;
        subpart2: mongoose.Types.DocumentArray<{
            description?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            title?: string;
        }> & {
            description?: string;
            title?: string;
        }>;
        title?: string;
        subpart1?: {
            description?: string;
            image?: string;
            title?: string;
        };
    };
    achivment?: {
        data: mongoose.Types.DocumentArray<{
            number?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            number?: string;
            title?: string;
        }> & {
            number?: string;
            title?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
    whyWeCourier?: {
        data: mongoose.Types.DocumentArray<{
            description?: string;
            image?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            image?: string;
            title?: string;
        }> & {
            description?: string;
            image?: string;
            title?: string;
        }>;
        isShow: boolean;
        description?: string;
        title?: string;
        subTitle?: string;
    };
    bestPartner?: {
        data: mongoose.Types.DocumentArray<{
            image?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            image?: string;
        }> & {
            image?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    header?: {
        status: mongoose.Types.DocumentArray<{
            number?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            number?: string;
            title?: string;
        }> & {
            number?: string;
            title?: string;
        }>;
        isShow: boolean;
        description?: string;
        title?: string;
        bgImage?: string;
    };
    services?: {
        data: mongoose.Types.DocumentArray<{
            description?: string;
            image?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            image?: string;
            title?: string;
        }> & {
            description?: string;
            image?: string;
            title?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
    deliverySolutions?: {
        data: mongoose.Types.DocumentArray<{
            description?: string;
            image?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            image?: string;
            title?: string;
        }> & {
            description?: string;
            image?: string;
            title?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
    ourDelivery?: {
        isShow: boolean;
        subpart2: mongoose.Types.DocumentArray<{
            description?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            title?: string;
        }> & {
            description?: string;
            title?: string;
        }>;
        title?: string;
        subpart1?: {
            description?: string;
            image?: string;
            title?: string;
        };
    };
    achivment?: {
        data: mongoose.Types.DocumentArray<{
            number?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            number?: string;
            title?: string;
        }> & {
            number?: string;
            title?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
    whyWeCourier?: {
        data: mongoose.Types.DocumentArray<{
            description?: string;
            image?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            image?: string;
            title?: string;
        }> & {
            description?: string;
            image?: string;
            title?: string;
        }>;
        isShow: boolean;
        description?: string;
        title?: string;
        subTitle?: string;
    };
    bestPartner?: {
        data: mongoose.Types.DocumentArray<{
            image?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            image?: string;
        }> & {
            image?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    header?: {
        status: mongoose.Types.DocumentArray<{
            number?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            number?: string;
            title?: string;
        }> & {
            number?: string;
            title?: string;
        }>;
        isShow: boolean;
        description?: string;
        title?: string;
        bgImage?: string;
    };
    services?: {
        data: mongoose.Types.DocumentArray<{
            description?: string;
            image?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            image?: string;
            title?: string;
        }> & {
            description?: string;
            image?: string;
            title?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
    deliverySolutions?: {
        data: mongoose.Types.DocumentArray<{
            description?: string;
            image?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            image?: string;
            title?: string;
        }> & {
            description?: string;
            image?: string;
            title?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
    ourDelivery?: {
        isShow: boolean;
        subpart2: mongoose.Types.DocumentArray<{
            description?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            title?: string;
        }> & {
            description?: string;
            title?: string;
        }>;
        title?: string;
        subpart1?: {
            description?: string;
            image?: string;
            title?: string;
        };
    };
    achivment?: {
        data: mongoose.Types.DocumentArray<{
            number?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            number?: string;
            title?: string;
        }> & {
            number?: string;
            title?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
    whyWeCourier?: {
        data: mongoose.Types.DocumentArray<{
            description?: string;
            image?: string;
            title?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            description?: string;
            image?: string;
            title?: string;
        }> & {
            description?: string;
            image?: string;
            title?: string;
        }>;
        isShow: boolean;
        description?: string;
        title?: string;
        subTitle?: string;
    };
    bestPartner?: {
        data: mongoose.Types.DocumentArray<{
            image?: string;
        }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
            image?: string;
        }> & {
            image?: string;
        }>;
        isShow: boolean;
        title?: string;
    };
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
