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
exports.updateWebHome = exports.getWebLandingPage = exports.createWebhomelandingpage = void 0;
const webHome_schema_1 = __importDefault(require("../../models/webHome.schema"));
const Homelandingpage_1 = __importDefault(require("../../models/Homelandingpage"));
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const web_validation_1 = require("../../utils/validation/web.validation");
const getimgurl_1 = require("../getimgurl/getimgurl");
const createWebhomelandingpage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('req.body', req.body);
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, web_validation_1.webhomelandingpageValidation);
        console.log('validateRequest', validateRequest);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const AutoTyperlist = validateRequest.value.AutoTyperlist;
        const subTitle = validateRequest.value.subTitle;
        const description = validateRequest.value.description;
        const bgImage = validateRequest.value.bgImage;
        if (bgImage.includes('base64')) {
            validateRequest.value.bgImage = yield (0, getimgurl_1.getimgurl)(bgImage);
        }
        const isfasttimecreate = yield Homelandingpage_1.default.findOne();
        if (isfasttimecreate) {
            yield Homelandingpage_1.default.findOneAndUpdate({}, {
                AutoTyperlist: AutoTyperlist,
                subTitle: subTitle,
                description: description,
                bgImage: validateRequest.value.bgImage,
            });
            return res.status(200).json({
                status: 200,
                message: 'Web Landing Page Updated Successfully',
            });
        }
        else {
            console.log('validateRequest.value', validateRequest.value);
            const webLandingpage = yield Homelandingpage_1.default.create(validateRequest.value);
            res.status(201).json({
                status: 201,
                message: 'Web Landing Page Created Successfully',
                webLandingpage,
            });
        }
    }
    catch (error) {
        console.error('Error in createWebLandingpage:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
});
exports.createWebhomelandingpage = createWebhomelandingpage;
const getWebLandingPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const webLandingPage = yield Homelandingpage_1.default.findOne();
        if (!webLandingPage) {
            return res.status(404).json({
                status: 404,
                message: 'Web Landing Page Not Found',
            });
        }
        res.status(200).json({
            status: 200,
            message: 'Web Landing Page Fetched Successfully',
            webLandingPage,
        });
    }
    catch (error) {
        console.error('Error in getWebLandingPage:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
});
exports.getWebLandingPage = getWebLandingPage;
const updateWebHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const webHome = yield webHome_schema_1.default.findOneAndUpdate({}, req.body, { new: true });
        res.status(201).json({
            status: 201,
            message: "Web Home Updated Successfully",
            webHome
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error
        });
    }
});
exports.updateWebHome = updateWebHome;
