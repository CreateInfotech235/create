import mongoose from 'mongoose';

const headerSchema = new mongoose.Schema({
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

const servicesSchema = new mongoose.Schema({
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

const deliverySolutionsSchema = new mongoose.Schema({
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

const ourDeliverySchema = new mongoose.Schema({
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

const achivmentSchema = new mongoose.Schema({
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

const whyWeCourierSchema = new mongoose.Schema({
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

const bestPartnerSchema = new mongoose.Schema({
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

const WebHomeSchema = new mongoose.Schema(
    {
        header: headerSchema,
        services: servicesSchema,
        deliverySolutions: deliverySolutionsSchema,
        ourDelivery: ourDeliverySchema,
        achivment: achivmentSchema,
        whyWeCourier: whyWeCourierSchema,
        bestPartner: bestPartnerSchema,
    },
    { timestamps: true }
);

export default mongoose.model('WebHome', WebHomeSchema);
