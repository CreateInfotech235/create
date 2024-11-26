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
exports.getOrderCounts = exports.logout = exports.renewToken = exports.profileUpdate = exports.sendEmailOrMobileOtp = exports.profileCredentialUpdate = exports.signIn = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const languageHelper_1 = require("../../language/languageHelper");
const admin_schema_1 = __importDefault(require("../../models/admin.schema"));
const authToken_schema_1 = __importDefault(require("../../models/authToken.schema"));
const otp_schema_1 = __importDefault(require("../../models/otp.schema"));
const common_1 = require("../../utils/common");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const adminSide_validation_1 = require("../../utils/validation/adminSide.validation");
const auth_validation_1 = require("../../utils/validation/auth.validation");
const orderHistory_schema_1 = __importDefault(require("../../models/orderHistory.schema"));
const order_schema_1 = __importDefault(require("../../models/order.schema"));
const orderAssignee_schema_1 = __importDefault(require("../../models/orderAssignee.schema"));
const deliveryMan_schema_1 = __importDefault(require("../../models/deliveryMan.schema"));
const subcription_schema_1 = __importDefault(require("../../models/subcription.schema"));
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, adminSide_validation_1.adminSignInValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const userExist = yield admin_schema_1.default.findOne({ email: value.email });
        if (!userExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').invalidLoginCredentials,
            });
        }
        const isVerifyPassword = yield (0, common_1.passwordValidation)(value.password, userExist.password);
        if (!isVerifyPassword) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').invalidLoginCredentials,
            });
        }
        const { accessToken, refreshToken } = (0, common_1.createAuthTokens)(userExist._id);
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').loginSuccessfully,
            data: { data: userExist, adminAuthData: { accessToken, refreshToken } },
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.signIn = signIn;
const profileCredentialUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.adminCredentialValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const otpData = yield otp_schema_1.default.findOne({
            value: value.otp,
            customerEmail: value.email,
            expiry: { $gte: Date.now() },
        });
        if (!otpData) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').otpExpired });
        }
        yield admin_schema_1.default.updateOne({ _id: value.adminId }, { $set: value });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').dataUpdatedSuccessfully,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.profileCredentialUpdate = profileCredentialUpdate;
const sendEmailOrMobileOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.otpVerifyValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const otp = process.env.ENV === 'DEV' ? 999999 : (0, common_1.generateIntRandomNo)(111111, 999999);
        yield (0, common_1.emailOrMobileOtp)(value.email, `This is your otp for registration ${otp}`);
        yield otp_schema_1.default.updateOne({
            value: otp,
            customerEmail: value.email,
            customerMobile: value.contactNumber,
        }, {
            value: otp,
            customerEmail: value.email,
            customerMobile: value.contactNumber,
            action: value.personType,
            expiry: Date.now() + 600000,
        }, { upsert: true });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').otpSentSuccess,
            data: process.env.ENV !== 'DEV' ? {} : { otp },
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.sendEmailOrMobileOtp = sendEmailOrMobileOtp;
const profileUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.adminProfileValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const image = value.profileImage.split(',');
        const adminData = yield admin_schema_1.default.findOne({ _id: value.adminId }, { profileImage: 1 });
        if (adminData === null || adminData === void 0 ? void 0 : adminData.profileImage) {
            (0, common_1.removeUploadedFile)(adminData.profileImage);
        }
        value.profileImage = yield (0, common_1.uploadFile)(image[0], image[1], 'ADMIN-PROFILE');
        yield admin_schema_1.default.updateOne({ _id: value.adminId }, { $set: value });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').dataUpdatedSuccessfully,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.profileUpdate = profileUpdate;
const renewToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.renewTokenValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const data = (0, jsonwebtoken_1.verify)(value.refreshToken, process.env.REFRESH_SECRET_KEY);
        if (!(data === null || data === void 0 ? void 0 : data.accessToken)) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidToken });
        }
        const adminVerify = yield admin_schema_1.default.findById(data.id);
        if (!adminVerify) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidToken });
        }
        yield authToken_schema_1.default.create({
            accessToken: data.accessToken,
            refreshToken: value.refreshToken,
        });
        const { accessToken, refreshToken } = (0, common_1.createAuthTokens)(adminVerify._id);
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').renewTokenSuccessfully,
            data: { accessToken, refreshToken },
        });
    }
    catch (error) {
        console.log(error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.renewToken = renewToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.renewTokenValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const data = (0, jsonwebtoken_1.verify)(value.refreshToken, process.env.REFRESH_SECRET_KEY);
        if (!(data === null || data === void 0 ? void 0 : data.accessToken)) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidToken });
        }
        const adminVerify = yield admin_schema_1.default.findById(data.id);
        if (!adminVerify) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidToken });
        }
        const checkTokenExist = yield authToken_schema_1.default.findOne({
            accessToken: data.accessToken,
            refreshToken: value.refreshToken,
            isActive: false,
        });
        if (checkTokenExist) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidToken });
        }
        yield authToken_schema_1.default.create({
            accessToken: data.accessToken,
            refreshToken: value.refreshToken,
        });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').logoutSuccessfully,
        });
    }
    catch (error) {
        console.log(error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.logout = logout;
const getOrderCounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalOrders = yield order_schema_1.default.countDocuments();
        const createdOrders = yield orderHistory_schema_1.default.countDocuments({ status: 'CREATED' });
        const assignedOrders = yield orderHistory_schema_1.default.countDocuments({ status: 'ASSIGNED' });
        const acceptedOrders = yield orderAssignee_schema_1.default.countDocuments({ status: 'ACCEPTED' });
        const arrivedOrders = yield orderHistory_schema_1.default.countDocuments({ status: 'ARRIVED' });
        const pickedOrders = yield orderHistory_schema_1.default.countDocuments({ status: 'PICKED_UP' });
        const departedOrders = yield orderHistory_schema_1.default.countDocuments({ status: 'DEPARTED' });
        const deliveredOrders = yield orderHistory_schema_1.default.countDocuments({ status: 'DELIVERED' });
        const cancelledOrders = yield orderHistory_schema_1.default.countDocuments({ status: 'CANCELLED' });
        const deliveryMan = yield deliveryMan_schema_1.default.countDocuments();
        const subscribedMerchants = yield subcription_schema_1.default.countDocuments({ isActive: true });
        const unsubscribedMerchants = yield subcription_schema_1.default.countDocuments({ isActive: { $ne: true } });
        let totalCounts = {
            totalOrders,
            createdOrders,
            assignedOrders,
            acceptedOrders,
            arrivedOrders,
            pickedOrders,
            departedOrders,
            deliveredOrders,
            cancelledOrders,
            deliveryMan,
            subscribedMerchants,
            unsubscribedMerchants
        };
        // return res.status(200).json({
        //   success: true,
        //   data: totalCounts
        // });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').countedData,
            data: totalCounts
        });
    }
    catch (error) {
        console.log(error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getOrderCounts = getOrderCounts;
