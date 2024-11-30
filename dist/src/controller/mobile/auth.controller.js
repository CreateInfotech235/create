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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getorderHistory = exports.getOrderCounts = exports.getAllDeliveryManOfMerchant = exports.updateProfileOfMerchant = exports.getProfileOfMerchant = exports.getLocationOfMerchant = exports.logout = exports.renewToken = exports.sendEmailOrMobileOtp = exports.activateFreeSubcription = exports.signIn = exports.signUp = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = require("jsonwebtoken");
const enum_1 = require("../../enum");
const languageHelper_1 = require("../../language/languageHelper");
const authToken_schema_1 = __importDefault(require("../../models/authToken.schema"));
const currency_schema_1 = __importDefault(require("../../models/currency.schema"));
const deliveryMan_schema_1 = __importDefault(require("../../models/deliveryMan.schema"));
const otp_schema_1 = __importDefault(require("../../models/otp.schema"));
const subcription_schema_1 = __importDefault(require("../../models/subcription.schema"));
const subcriptionPurchase_schema_1 = __importDefault(require("../../models/subcriptionPurchase.schema"));
const user_schema_1 = __importDefault(require("../../models/user.schema"));
const orderHistory_schema_1 = __importDefault(require("../../models/orderHistory.schema"));
const common_1 = require("../../utils/common");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const auth_validation_1 = require("../../utils/validation/auth.validation");
const orderHistory_schema_2 = __importDefault(require("../../models/orderHistory.schema"));
const order_schema_1 = __importDefault(require("../../models/order.schema"));
const orderAssignee_schema_1 = __importDefault(require("../../models/orderAssignee.schema"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.userSignUpValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        // const assetsFile = req.file;
        const { value } = validateRequest;
        const userExist = yield user_schema_1.default.findOne({ email: value.email });
        if (userExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').emailRegisteredAlready,
            });
        }
        if (!value.image) {
            value.image = process.env.DEFAULT_PROFILE_IMAGE;
        }
        else {
            const Image = value.image.split(',');
            value.image = yield (0, common_1.uploadFile)(Image[0], Image[1], 'MERCHANT(USER)-PROFILE');
        }
        const otpData = yield otp_schema_1.default.findOne({
            value: value.otp,
            customerEmail: value.email,
            expiry: { $gte: Date.now() },
        });
        if (!otpData) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').otpExpired });
        }
        const certificate = yield user_schema_1.default.findOne({
            medicalCertificateNumber: value.medicalCertificateNumber,
        });
        if (certificate) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').certificateRegisteredAlready,
            });
        }
        // value.medicalCertificate = path.join('uploads/', assetsFile.filename);
        // if (value?.medicalCertificate) {
        //   const Image = value.medicalCertificate.split(',');
        //   value.medicalCertificate = await uploadFile(Image[0], Image[1], 'MERCHANT-MEDICALCER');
        // }
        value.password = yield (0, common_1.encryptPassword)({ password: value.password });
        yield user_schema_1.default.create(value);
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').userRegistered });
    }
    catch (error) {
        console.log('error', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.userSignInValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        let userExist;
        const isCustomer = value.personType === enum_1.PERSON_TYPE.CUSTOMER;
        if (isCustomer) {
            userExist = yield user_schema_1.default.findOne({ email: value.email }).lean();
        }
        else {
            userExist = yield deliveryMan_schema_1.default
                .findOne({ email: value.email })
                .lean();
        }
        if (!userExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').invalidLoginCredentials,
            });
        }
        const isVerifyPassword = yield (0, common_1.passwordValidation)(value.password, userExist.password);
        console.log('🚀 ~ signIn ~ isVerifyPassword:', isVerifyPassword);
        if (!isVerifyPassword) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').invalidLoginCredentials,
            });
        }
        const { accessToken, refreshToken } = (0, common_1.createAuthTokens)(userExist._id);
        const { bankData, providerId } = userExist, userData = __rest(userExist, ["bankData", "providerId"]);
        const currency = yield currency_schema_1.default.findOne({}, { _id: 0, name: 1, symbol: 1, position: 1 });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').loginSuccessfully,
            data: {
                userData,
                userAuthData: { accessToken, refreshToken },
                currency,
            },
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.signIn = signIn;
const activateFreeSubcription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.activateFreeSubcriptionValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const userExist = yield user_schema_1.default.findOne({
            _id: value.userId,
            medicalCertificateNumber: value.medicalCertificateNumber,
        });
        if (!userExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').userNotRegistered,
            });
        }
        if (!(yield user_schema_1.default.findOne({
            medicalCertificateNumber: value.medicalCertificateNumber,
        }))) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').certificateNumberRegistered,
            });
        }
        const checkSubcriptionAlreadyExist = yield subcriptionPurchase_schema_1.default.findOne({
            // customer: req.id,
            merchant: req.id,
            expiry: { $gte: new Date() },
        });
        if (checkSubcriptionAlreadyExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').errorSubcriptionAlreadyExist,
            });
        }
        const document = value.medicalCertificate.split(',');
        value.medicalCertificate = yield (0, common_1.uploadFile)(document[0], document[1], 'USER-CERTIFICATE');
        const data = yield subcription_schema_1.default.findOne({ amount: 0, isActive: true });
        if (!data) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').errorDataNotFound });
        }
        yield Promise.all([
            subcriptionPurchase_schema_1.default.create({
                subcriptionId: data._id,
                // customer: userExist._id,
                merchant: userExist._id,
                expiry: Date.now() + data.seconds * 1000, // 2592000
                status: 'APPROVED',
            }),
            user_schema_1.default.updateOne({
                _id: req.id,
            }, {
                $set: {
                    medicalCertificate: value.medicalCertificate,
                    freeSubscription: true,
                },
            }),
        ]);
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').accountActiveSuccessfully,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.activateFreeSubcription = activateFreeSubcription;
const sendEmailOrMobileOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.otpVerifyValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        let userExist;
        const isCustomer = value.personType === enum_1.PERSON_TYPE.CUSTOMER;
        if (isCustomer) {
            userExist = yield user_schema_1.default.findOne({
                email: value.email,
                contactNumber: value.contactNumber,
                countryCode: value.countryCode,
            });
        }
        else {
            userExist = yield deliveryMan_schema_1.default.findOne({
                email: value.email,
                contactNumber: value.contactNumber,
                countryCode: value.countryCode,
            });
        }
        if (userExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').emailRegisteredAlready,
            });
        }
        const otp = process.env.ENV === 'DEV' ? 999999 : (0, common_1.generateIntRandomNo)(111111, 999999);
        if (process.env.ENV !== 'DEV') {
            yield (0, common_1.emailOrMobileOtp)(value.email, `This is your otp for registration ${otp}`);
        }
        const data = yield otp_schema_1.default.updateOne({
            value: otp,
            customerEmail: value.email,
            customerMobile: value.contactNumber,
            action: value.personType,
        }, {
            value: otp,
            customerEmail: value.email,
            customerMobile: value.contactNumber,
            expiry: Date.now() + 600000,
            action: value.personType,
        }, { upsert: true });
        if (!data.upsertedCount && !data.modifiedCount) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidData });
        }
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
        const isCustomer = value.personType === enum_1.PERSON_TYPE.CUSTOMER;
        let userVerify;
        if (isCustomer) {
            userVerify = yield user_schema_1.default.findById(data.id);
        }
        else {
            userVerify = yield deliveryMan_schema_1.default.findById(data.id);
        }
        if (!userVerify) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidToken });
        }
        yield authToken_schema_1.default.create({
            accessToken: data.accessToken,
            refreshToken: value.refreshToken,
        });
        const { accessToken, refreshToken } = (0, common_1.createAuthTokens)(userVerify._id);
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').renewTokenSuccessfully,
            data: { accessToken, refreshToken },
        });
    }
    catch (error) {
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
        const isCustomer = value.personType === enum_1.PERSON_TYPE.CUSTOMER;
        let userVerify;
        if (isCustomer) {
            userVerify = yield user_schema_1.default.findById(data.id);
        }
        else {
            userVerify = yield deliveryMan_schema_1.default.findById(data.id);
        }
        if (!userVerify) {
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
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.logout = logout;
const getLocationOfMerchant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pickupLocation = yield user_schema_1.default.find({}, 'name contactNumber countryCode address');
        const formattedData = pickupLocation
            .map((location) => {
            const { name, contactNumber, countryCode, address } = location;
            if (address && address.street && address.city && address.country) {
                const fullAddress = `${address.street} ${address.city} ${address.country}`.trim(); // Combine address fields
                return {
                    name,
                    contactNumber,
                    countryCode,
                    address: fullAddress,
                };
            }
            return null;
        })
            .filter(Boolean);
        return res.ok({ data: formattedData });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getLocationOfMerchant = getLocationOfMerchant;
const getProfileOfMerchant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('user', req.params.id);
        const data = yield user_schema_1.default.find({ _id: req.params.id });
        console.log('data', data);
        // const data = await merchantSchema.aggregate([
        //   {
        //     $match: {
        //       _id: new mongoose.Types.ObjectId(req.params.id),
        //     },
        //   },
        //   {
        //     $project: {
        //       _id: 0,
        //       address: '$address',
        //       name: '$name',
        //       email: '$email',
        //       contactNumber: '$contactNumber',
        //       image: '$image',
        //       postCode: '$postCode',
        //       medicalCertificate: '$medicalCertificate',
        //       medicalCertificateNumber: '$medicalCertificateNumber',
        //       createdDate: '$createdAt',
        //     },
        //   },
        // ]);
        return res.ok({ data: data });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getProfileOfMerchant = getProfileOfMerchant;
const updateProfileOfMerchant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // if (updateData?.image) {
        //   const Image = updateData.image.split(',');
        //   const customerData = await merchantSchema.findOne(
        //     { _id: id },
        //     { image: 1 },
        //   );
        //   if (customerData?.image) {
        //     removeUploadedFile(customerData.image);
        //   }
        //   updateData.image = await uploadFile(
        //     Image[0],
        //     Image[1],
        //     'MERCHANT(USER)-PROFILE',
        //   );
        // }
        const updatedUser = yield user_schema_1.default.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!updatedUser) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').userNotFound });
        }
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').dataUpdatedSuccessfully,
            data: updatedUser,
        });
    }
    catch (error) {
        console.error('Error updating merchant(user) profile:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.updateProfileOfMerchant = updateProfileOfMerchant;
const getAllDeliveryManOfMerchant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('user', req.params.id);
        // const data = await deliveryManSchema.find({ merchantId: req.params.id });
        const data = yield deliveryMan_schema_1.default.aggregate([
            {
                $match: { merchantId: new mongoose_1.default.Types.ObjectId(req.params.id) },
            },
            {
                $lookup: {
                    from: 'country',
                    localField: 'countryId',
                    foreignField: '_id',
                    as: 'countryData',
                },
            },
            {
                $unwind: {
                    path: '$countryData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'city',
                    localField: 'cityId',
                    foreignField: '_id',
                    as: 'cityData',
                },
            },
            {
                $unwind: {
                    path: '$cityData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $project: {
                    name: 1,
                    firstName: 1,
                    lastName: 1,
                    countryCode: 1,
                    contactNumber: 1,
                    email: 1,
                    status: 1,
                    image: {
                        $ifNull: [
                            '$image',
                            'data:image/jpeg;base64,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',
                        ],
                    },
                    country: '$countryData.countryName',
                    city: '$cityData.cityName',
                    merchantId: 1,
                    createdByMerchant: 1,
                    createdByAdmin: 1,
                    registerDate: '$createdAt',
                    isVerified: 1,
                    location: {
                        latitude: { $arrayElemAt: ['$location.coordinates', 0] },
                        longitude: { $arrayElemAt: ['$location.coordinates', 1] },
                    },
                },
            },
        ]);
        console.log('data', data);
        return res.ok({ data: data });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getAllDeliveryManOfMerchant = getAllDeliveryManOfMerchant;
const getOrderCounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let merchantID = req.params.id;
        const totalOrders = yield order_schema_1.default.countDocuments({
            merchant: merchantID,
        });
        const createdOrders = yield orderHistory_schema_2.default.countDocuments({
            status: 'CREATED',
            merchantID: merchantID,
        });
        const assignedOrders = yield orderHistory_schema_2.default.countDocuments({
            status: 'ASSIGNED',
            merchantID: merchantID,
        });
        const acceptedOrders = yield orderAssignee_schema_1.default.countDocuments({
            status: 'ACCEPTED',
            merchant: merchantID,
        });
        const arrivedOrders = yield orderHistory_schema_2.default.countDocuments({
            status: 'ARRIVED',
            merchantID: merchantID,
        });
        const pickedOrders = yield orderHistory_schema_2.default.countDocuments({
            status: 'PICKED_UP',
            merchantID: merchantID,
        });
        const departedOrders = yield orderHistory_schema_2.default.countDocuments({
            status: 'DEPARTED',
            merchantID: merchantID,
        });
        const deliveredOrders = yield orderHistory_schema_2.default.countDocuments({
            status: 'DELIVERED',
            merchantID: merchantID,
        });
        const cancelledOrders = yield orderHistory_schema_2.default.countDocuments({
            status: 'CANCELLED',
            merchantID: merchantID,
        });
        const deliveryMan = yield deliveryMan_schema_1.default.countDocuments({
            merchantId: merchantID,
        });
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
        };
        // return res.status(200).json({
        //   success: true,
        //   data: totalCounts
        // });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').countedData,
            data: totalCounts,
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
const getorderHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield orderHistory_schema_1.default.find();
        res.status(200).json({
            status: 'Sucess',
            data: data,
        });
    }
    catch (error) {
        res.status(401).json({
            status: 'Failed',
            error: error,
        });
    }
});
exports.getorderHistory = getorderHistory;
