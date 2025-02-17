"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const headerSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    bgImage: {
        type: String,
    },
    status: [{
            title: {
                type: String,
            },
            number: {
                type: String,
            },
        }],
    isShow: {
        type: Boolean,
        default: true
    }
});
const servicesSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
    },
    data: [{
            title: {
                type: String,
            },
            description: {
                type: String,
            },
            image: {
                type: String,
            },
        }],
    isShow: {
        type: Boolean,
        default: true
    }
});
const deliverySolutionsSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
    },
    data: [{
            title: {
                type: String,
            },
            description: {
                type: String,
            },
            image: {
                type: String,
            },
        }],
    isShow: {
        type: Boolean,
        default: true
    }
});
const ourDeliverySchema = new mongoose_1.default.Schema({
    title: {
        type: String,
    },
    subpart1: {
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    subpart2: [{
            title: {
                type: String,
            },
            description: {
                type: String,
            },
        }],
    isShow: {
        type: Boolean,
        default: true
    }
});
const achivmentSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
    },
    data: [{
            title: {
                type: String,
            },
            number: {
                type: String,
            },
        }],
    isShow: {
        type: Boolean,
        default: true
    }
});
const whyWeCourierSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
    },
    subTitle: {
        type: String,
    },
    description: {
        type: String,
    },
    data: [{
            title: {
                type: String,
            },
            description: {
                type: String,
            },
            image: {
                type: String,
            },
        }],
    isShow: {
        type: Boolean,
        default: true
    }
});
const bestPartnerSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
    },
    data: [{
            image: {
                type: String,
            },
        }],
    isShow: {
        type: Boolean,
        default: true
    }
});
const WebHomeSchema = new mongoose_1.default.Schema({
    header: headerSchema,
    services: servicesSchema,
    deliverySolutions: deliverySolutionsSchema,
    ourDelivery: ourDeliverySchema,
    achivment: achivmentSchema,
    whyWeCourier: whyWeCourierSchema,
    bestPartner: bestPartnerSchema,
}, { timestamps: true });
exports.default = mongoose_1.default.model('WebHome', WebHomeSchema);
