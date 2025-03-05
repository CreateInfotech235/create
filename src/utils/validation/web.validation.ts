import Joi from "joi";

export const webNavbarValidation = Joi.object({
    _id: Joi.string().optional(),
    logo: Joi.object({
        img: Joi.string().required(),
        path: Joi.string().required(),
    }).required(),
    menuList: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        path: Joi.string().required(),
        _id: Joi.string().optional(),
    })).required(),
    favicon: Joi.object({
        img: Joi.string().required(),
        path: Joi.string().required(),
    }).required(),
    button: Joi.object({
        name: Joi.string().required(),
        path: Joi.string().required(),
    }).optional(),
    defaultProfileImage: Joi.string().optional(),
    __v: Joi.number().optional(),
});

export const webSocialMediaValidation = Joi.object({
    email: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    socialMedia: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        link: Joi.string().required(),
        icon: Joi.string().required(),
    })).required(),
});


export const webhomelandingpageValidation = Joi.object({
    AutoTyperlist: Joi.array().items(Joi.string()).required(),
    subTitle: Joi.string().required(),
    description: Joi.string().required(),
    bgImage: Joi.string().required(),
});


export const FooterpageValidation = Joi.object({
    Resources: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        link: Joi.string().required(),
    })).required(),
    ContactUs: Joi.array().items(Joi.object({
        data: Joi.string().required(),
        type: Joi.string().required(),
        link: Joi.string().required(),
    })).required(),
    copyright: Joi.object({
        text: Joi.string().required(),
        link: Joi.string().required(),
    }).required(),
});
