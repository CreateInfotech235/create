"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebSocialMedia = exports.createWebSocialMedia = void 0;
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const web_validation_1 = require("../../utils/validation/web.validation");
const getimgurl_1 = require("../getimgurl/getimgurl");
const webSocialMedia_1 = __importDefault(require("../../models/webSocialMedia"));
const createWebSocialMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('req.body', req.body);
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, web_validation_1.webSocialMediaValidation);
        console.log('validateRequest', validateRequest);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        for (const socialMedia of validateRequest.value.socialMedia) {
            if (socialMedia.icon.includes('base64')) {
                socialMedia.icon = yield (0, getimgurl_1.getimgurl)(socialMedia.icon);
            }
        }
        const webSocialMediaData = yield webSocialMedia_1.default.findOne();
        if (webSocialMediaData) {
            yield webSocialMedia_1.default.findOneAndUpdate({}, validateRequest.value);
        }
        else {
            yield webSocialMedia_1.default.create(validateRequest.value);
        }
        res.status(200).json({
            status: 200,
            message: 'Web Social Media Created Successfully'
        });
    }
    catch (error) {
        console.error('Error in createWebSocialMedia:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
});
exports.createWebSocialMedia = createWebSocialMedia;
const getWebSocialMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const webSocialMedia = yield webSocialMedia_1.default.findOne();
        if (!webSocialMedia) {
            return res.status(404).json({
                status: 404,
                message: 'Web Social Media Not Found',
            });
        }
        res.status(200).json({
            status: 200,
            message: 'Web Social Media Fetched Successfully',
            webSocialMedia,
        });
    }
    catch (error) {
        console.error('Error in getWebSocialMedia:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
});
exports.getWebSocialMedia = getWebSocialMedia;
