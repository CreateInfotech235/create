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
exports.resetPassword = exports.verifyOtp = exports.sendOtp = exports.getDistance = exports.deleteMessageFromTicket = exports.addMessageToTicket = exports.getMessagesByTicketId = exports.getAllTickets = exports.SupportTicketUpdate = exports.getSubscriptions = exports.getAllDeliveryMans = exports.getUnreadNotificationCount = exports.deleteAllNotifications = exports.deleteNotification = exports.markAllNotificationsAsRead = exports.markNotificationAsRead = exports.getAllNotifications = exports.deleteSupportTicket = exports.getSupportTicket = exports.postSupportTicket = exports.getadmindata = exports.updateDeliveryManProfileAndPassword = exports.getDeliveryManLocations = exports.getorderHistory = exports.getOrderCountsbyDate = exports.getOrderCounts = exports.getAllDeliveryManOfMerchant = exports.updateProfileOfMerchant = exports.getProfileOfMerchant = exports.getLocationOfMerchant = exports.logout = exports.renewToken = exports.sendEmailOrMobileOtp = exports.signIn = exports.activateFreeSubcription = exports.signUp = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = require("jsonwebtoken");
const enum_1 = require("../../enum");
const languageHelper_1 = require("../../language/languageHelper");
const index_1 = require("../../../index");
const authToken_schema_1 = __importDefault(require("../../models/authToken.schema"));
const currency_schema_1 = __importDefault(require("../../models/currency.schema"));
const deliveryMan_schema_1 = __importDefault(require("../../models/deliveryMan.schema"));
const otp_schema_1 = __importDefault(require("../../models/otp.schema"));
const subcription_schema_1 = __importDefault(require("../../models/subcription.schema"));
const subcriptionPurchase_schema_1 = __importDefault(require("../../models/subcriptionPurchase.schema"));
const user_schema_1 = __importDefault(require("../../models/user.schema"));
const orderHistory_schema_1 = __importDefault(require("../../models/orderHistory.schema"));
const SupportTicket_1 = __importDefault(require("../../models/SupportTicket"));
const admin_schema_1 = __importDefault(require("../../models/admin.schema"));
const notificatio_schema_1 = __importDefault(require("../../models/notificatio.schema"));
const token_schema_1 = __importDefault(require("../../models/token.schema"));
const common_1 = require("../../utils/common");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const auth_validation_1 = require("../../utils/validation/auth.validation");
const orderHistory_schema_2 = __importDefault(require("../../models/orderHistory.schema"));
const orderMulti_schema_1 = __importDefault(require("../../models/orderMulti.schema"));
const customer_schema_1 = __importDefault(require("../../models/customer.schema"));
const cancelOderbyDeliveryManSchema_1 = __importDefault(require("../../models/cancelOderbyDeliveryManSchema"));
const adminSide_validation_1 = require("../../utils/validation/adminSide.validation");
const auth_controller_1 = require("../deliveryBoy/auth.controller");
const axios_1 = __importDefault(require("axios"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.userSignUpValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        console.log(value);
        var merchantUserId;
        var listoftext = [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '0',
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k',
            'l',
            'm',
            'n',
            'o',
            'p',
            'q',
            'r',
            's',
            't',
            'u',
            'v',
            'w',
            'x',
            'y',
            'z',
        ];
        do {
            merchantUserId =
                listoftext[Math.round(Math.random() * (listoftext.length - 1))] +
                    listoftext[Math.round(Math.random() * (listoftext.length - 1))] +
                    listoftext[Math.round(Math.random() * (listoftext.length - 1))] +
                    listoftext[Math.round(Math.random() * (listoftext.length - 1))];
            console.log('merchantUserId', merchantUserId);
        } while (yield user_schema_1.default.findOne({ merchantUserId: merchantUserId }));
        const userExist = yield user_schema_1.default.findOne({ email: value.email });
        if (userExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').emailRegisteredAlready,
            });
        }
        // if (!value.image) {
        //   value.image = process.env.DEFAULT_PROFILE_IMAGE;
        // } else {
        //   const Image = value.image.split(',');
        //   value.image = await uploadFile(
        //     Image[0],
        //     Image[1],
        //     'MERCHANT(USER)-PROFILE',
        //   );
        // }
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
        yield user_schema_1.default.create(Object.assign(Object.assign({}, value), { merchantUserId }));
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
            merchant: value.userId,
            expiry: { $gte: new Date() },
        });
        if (checkSubcriptionAlreadyExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').errorSubcriptionAlreadyExist,
            });
        }
        // const document = value.medicalCertificate.split(',');
        // value.medicalCertificate = await uploadFile(
        //   document[0],
        //   document[1],
        //   'USER-CERTIFICATE',
        // );
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
                _id: value.userId,
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
            if (userExist.isApproved != "APPROVED") {
                if (userExist.isApproved == "REJECTED") {
                    return res.badRequest({
                        message: userExist.reason ? userExist.reason : (0, languageHelper_1.getLanguage)('en').userNotApproved,
                    });
                }
                if (userExist.isApproved == "PENDING") {
                    return res.badRequest({
                        message: userExist.reason ? userExist.reason : (0, languageHelper_1.getLanguage)('en').userNotApprovedYet,
                    });
                }
            }
            else {
                if (userExist.isApprovedfasttime) {
                    // get free subcription
                    if (!(yield user_schema_1.default.findOne({
                        medicalCertificateNumber: userExist.medicalCertificateNumber,
                    }))) {
                        return res.badRequest({
                            message: (0, languageHelper_1.getLanguage)('en').certificateNumberRegistered,
                        });
                    }
                    const checkSubcriptionAlreadyExist = yield subcriptionPurchase_schema_1.default.findOne({
                        // customer: req.id,
                        merchant: userExist._id,
                        expiry: { $gte: new Date() },
                    });
                    if (checkSubcriptionAlreadyExist) {
                        return res.badRequest({
                            message: (0, languageHelper_1.getLanguage)('en').errorSubcriptionAlreadyExist,
                        });
                    }
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
                            _id: userExist._id,
                        }, {
                            $set: {
                                medicalCertificate: userExist.medicalCertificate,
                                freeSubscription: true,
                                isApprovedfasttime: false,
                            },
                        }),
                    ]);
                }
            }
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
        if (value.deviceToken) {
            yield deliveryMan_schema_1.default.updateOne({ _id: userExist._id }, { deviceToken: value.deviceToken });
        }
        const isVerifyPassword = yield (0, common_1.passwordValidation)(value.password, userExist.password);
        console.log('🚀 ~ signIn ~ isVerifyPassword:', isVerifyPassword);
        if (!isVerifyPassword) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').invalidLoginCredentials,
            });
        }
        yield token_schema_1.default.deleteMany({ userId: userExist._id });
        const { accessToken, refreshToken } = (0, common_1.createAuthTokens)(userExist._id);
        yield token_schema_1.default.create({
            userId: userExist._id,
            accessToken,
            refreshToken,
            createdAt: new Date(),
        });
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
// export const sendEmailOrMobileOtp = async (
//   req: RequestParams,
//   res: Response,
// ) => {
//   try {
//     const validateRequest = validateParamsWithJoi<{
//       email: string;
//       contactNumber: number;
//       countryCode: string;
//       personType: PERSON_TYPE;
//     }>(req.body, otpVerifyValidation);
//     if (!validateRequest.isValid) {
//       return res.badRequest({ message: validateRequest.message });
//     }
//     const { value } = validateRequest;
//     let userExist;
//     const isCustomer = value.personType === PERSON_TYPE.CUSTOMER;
//     if (isCustomer) {
//       userExist = await merchantSchema.findOne({
//         email: value.email,
//         contactNumber: value.contactNumber,
//         countryCode: value.countryCode,
//       });
//     } else {
//       userExist = await deliveryManSchema.findOne({
//         email: value.email,
//         contactNumber: value.contactNumber,
//         countryCode: value.countryCode,
//       });
//     }
//     if (userExist) {
//       return res.badRequest({
//         message: getLanguage('en').emailRegisteredAlready,
//       });
//     }
//     const otp =
//       process.env.ENV === 'DEV' ? 999999 : generateIntRandomNo(111111, 999999);
//     if (process.env.ENV !== 'DEV') {
//       await emailOrMobileOtp(
//         value.email,
//         `This is your otp for registration ${otp}`,
//       );
//     }
//     const data = await otpSchema.updateOne(
//       {
//         value: otp,
//         customerEmail: value.email,
//         customerMobile: value.contactNumber,
//         action: value.personType,
//       },
//       {
//         value: otp,
//         customerEmail: value.email,
//         customerMobile: value.contactNumber,
//         expiry: Date.now() + 600000,
//         action: value.personType,
//       },
//       { upsert: true },
//     );
//     if (!data.upsertedCount && !data.modifiedCount) {
//       return res.badRequest({ message: getLanguage('en').invalidData });
//     }
//     return res.ok({
//       message: getLanguage('en').otpSentSuccess,
//       data: process.env.ENV !== 'DEV' ? {} : { otp },
//     });
//   } catch (error) {
//     return res.failureResponse({
//       message: getLanguage('en').somethingWentWrong,
//     });
//   }
// };
const sendEmailOrMobileOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.otpVerifyValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        console.log(value);
        let userExist;
        const isCustomer = value.personType === enum_1.PERSON_TYPE.CUSTOMER;
        if (isCustomer) {
            userExist = yield user_schema_1.default.findOne({
                email: value.email,
                contactNumber: value.contactNumber,
                // countryCode: value.countryCode,
            });
        }
        else {
            userExist = yield deliveryMan_schema_1.default.findOne({
                email: value.email,
                contactNumber: value.contactNumber,
                // countryCode: value.countryCode,
            });
        }
        if (userExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').emailRegisteredAlready,
            });
        }
        const otp = (0, common_1.generateIntRandomNo)(111111, 999999);
        yield (0, common_1.emailOrMobileOtp)(value.email, `This is your otp for registration ${otp}`);
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
            data: { otp },
        });
    }
    catch (error) {
        console.log(error);
        return res.failureResponse({
            error: error,
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
            const { firstName, lastName, contactNumber, countryCode, address } = location;
            if (address && address.street && address.city && address.country) {
                const fullAddress = `${address.street} ${address.city} ${address.country}`.trim(); // Combine address fields
                return {
                    firstName,
                    lastName,
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
        const statuses = [
            { name: 'total', status: null },
            { name: 'assigned', status: 'ASSIGNED' },
            { name: 'arrived', status: 'ARRIVED' },
            { name: 'picked', status: 'PICKED_UP' },
            { name: 'departed', status: 'DEPARTED' },
            { name: 'delivered', status: 'DELIVERED' },
            { name: 'unassigned', status: 'CANCELLED' },
            { name: 'cancelled', status: 'CANCELLED' }
        ];
        const counts = {};
        // Get counts for each status using aggregation
        for (const { name, status } of statuses) {
            const result = yield orderMulti_schema_1.default
                .aggregate([
                {
                    $match: {
                        merchant: new mongoose_1.default.Types.ObjectId(merchantID),
                        trashed: { $ne: true },
                    },
                },
                {
                    $project: {
                        deliveryDetails: {
                            $filter: {
                                input: '$deliveryDetails',
                                as: 'detail',
                                cond: status ? {
                                    $and: [
                                        { $eq: ['$$detail.status', status] },
                                        { $eq: ['$$detail.trashed', false] },
                                    ],
                                } : {
                                    $eq: ['$$detail.trashed', false]
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        deliveryDetailsCount: { $size: '$deliveryDetails' },
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$deliveryDetailsCount' },
                    },
                },
            ])
                .then((result) => { var _a; return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; });
            counts[`${name}Orders`] = result;
        }
        // Get other counts
        const [mainTotalOrders, totalTrashed, totalCustomers, cancelledOrders, deliveryManCount] = yield Promise.all([
            orderMulti_schema_1.default.countDocuments({
                merchant: merchantID,
                trashed: false,
            }),
            orderMulti_schema_1.default
                .aggregate([
                {
                    $match: {
                        merchant: new mongoose_1.default.Types.ObjectId(merchantID),
                        trashed: true,
                    },
                },
                {
                    $project: {
                        deliveryDetails: {
                            $filter: {
                                input: '$deliveryDetails',
                                as: 'detail',
                                cond: { $eq: ['$$detail.trashed', true] },
                            },
                        },
                    },
                },
                {
                    $project: {
                        deliveryDetailsCount: { $size: '$deliveryDetails' },
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$deliveryDetailsCount' },
                    },
                },
            ])
                .then((result) => { var _a; return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; }),
            customer_schema_1.default.countDocuments({
                merchantId: merchantID,
                trashed: false,
            }),
            orderHistory_schema_2.default.countDocuments({
                status: 'CANCELLED',
                merchantID: merchantID,
            }),
            deliveryMan_schema_1.default.countDocuments({
                merchantId: merchantID,
            })
        ]);
        const totalCounts = Object.assign({ toteltrashed: totalTrashed, totelcustomer: totalCustomers, maintotelOrders: mainTotalOrders, 
            // cancelledOrders,
            deliveryMan: deliveryManCount }, counts);
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
const getOrderCountsbyDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const merchantID = req.params.id;
        // Validate query params
        const validateRequest = (0, validateRequest_1.default)(req.query, adminSide_validation_1.orderCount);
        if (!validateRequest.isValid) {
            return res.status(400).json({ message: validateRequest.message });
        }
        const { startDate, endDate } = validateRequest.value;
        // Build date query
        const dateQuery = {};
        if (startDate)
            dateQuery.$gte = new Date(startDate);
        if (endDate) {
            const endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);
            dateQuery.$lte = endOfDay;
        }
        const dateCondition = Object.keys(dateQuery).length ? { createdAt: dateQuery } : {};
        const merchantObjectId = new mongoose_1.default.Types.ObjectId(merchantID);
        // Run queries in parallel
        const [orders, deliveryMen, cancelledOrders, assignedOrders, arrivedOrders, pickedOrders, departedOrders, deliveredOrders] = yield Promise.all([
            orderMulti_schema_1.default.find(Object.assign({ merchant: merchantObjectId }, dateCondition)),
            deliveryMan_schema_1.default.countDocuments(Object.assign(Object.assign({ merchantId: merchantID }, dateCondition), { trashed: false })),
            cancelOderbyDeliveryManSchema_1.default.countDocuments(Object.assign({ merchantId: merchantID }, dateCondition)),
            orderHistory_schema_2.default.countDocuments(Object.assign({ status: 'ASSIGNED', merchantID }, dateCondition)),
            orderHistory_schema_2.default.countDocuments(Object.assign({ status: 'ARRIVED', merchantID }, dateCondition)),
            orderHistory_schema_2.default.countDocuments(Object.assign({ status: 'PICKED_UP', merchantID }, dateCondition)),
            orderHistory_schema_2.default.countDocuments(Object.assign({ status: 'DEPARTED', merchantID }, dateCondition)),
            orderHistory_schema_2.default.countDocuments(Object.assign({ status: 'DELIVERED', merchantID }, dateCondition))
        ]);
        // Calculate sub-order count in one pass
        const subOrderCount = orders.reduce((acc, order) => acc + order.deliveryDetails.length, 0);
        const data = {
            totalOrders: orders.length,
            totalSubOrders: subOrderCount,
            assignedOrders,
            arrivedOrders,
            pickedOrders,
            departedOrders,
            deliveredOrders,
            cancelledOrders,
            deliveryMan: deliveryMen
        };
        return res.status(200).json({ data });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred.' });
    }
});
exports.getOrderCountsbyDate = getOrderCountsbyDate;
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
const getDeliveryManLocations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.query, adminSide_validation_1.paginationValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const data = yield deliveryMan_schema_1.default.aggregate([
            {
                $match: {
                    isCustomer: false,
                    _id: new mongoose_1.default.Types.ObjectId(req.params.id),
                },
            },
            {
                $lookup: {
                    from: 'country',
                    localField: 'countryId',
                    foreignField: '_id',
                    as: 'countryData',
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                            },
                        },
                    ],
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
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$cityData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    deliveryManId: '$_id',
                    location: {
                        latitude: { $arrayElemAt: ['$location.coordinates', 1] },
                        longitude: { $arrayElemAt: ['$location.coordinates', 0] },
                    },
                    country: '$countryData.countryName',
                    city: '$cityData.cityName',
                },
            },
            ...(0, common_1.getMongoCommonPagination)({
                pageCount: value.pageCount,
                pageLimit: value.pageLimit,
            }),
        ]);
        return res.ok({
            data: data[0],
        });
    }
    catch (error) {
        console.log(error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getDeliveryManLocations = getDeliveryManLocations;
const updateDeliveryManProfileAndPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        console.log(updateData);
        // Update Password Logic
        if ((updateData === null || updateData === void 0 ? void 0 : updateData.oldPassword) ||
            (updateData === null || updateData === void 0 ? void 0 : updateData.newPassword) ||
            (updateData === null || updateData === void 0 ? void 0 : updateData.confirmPassword)) {
            const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.updatePasswordValidation);
            if (!validateRequest.isValid) {
                return res.badRequest({ message: validateRequest.message });
            }
            const { value } = validateRequest;
            if (value.newPassword !== value.confirmPassword) {
                return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').passwordMismatch });
            }
            const user = yield deliveryMan_schema_1.default.findById(id);
            if (!user) {
                return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').userNotFound });
            }
            const isPasswordValid = yield (0, auth_controller_1.verifyPassword)({
                password: value.oldPassword,
                hash: user.password,
            });
            if (!isPasswordValid) {
                return res.badRequest({
                    message: (0, languageHelper_1.getLanguage)('en').invalidOldPassword,
                });
            }
            const hashedPassword = yield (0, common_1.encryptPassword)({
                password: value.newPassword,
            });
            yield deliveryMan_schema_1.default.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });
        }
        // Handle defaultLocation if it exists
        if (updateData === null || updateData === void 0 ? void 0 : updateData.defaultLocation) {
            const { longitude, latitude } = updateData.defaultLocation;
            if (typeof longitude !== 'number' ||
                typeof latitude !== 'number' ||
                !isFinite(longitude) ||
                !isFinite(latitude)) {
                return res.badRequest({
                    message: (0, languageHelper_1.getLanguage)('en').invalidDefaultLocation,
                });
            }
            updateData.defaultLocation = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        }
        // Update DeliveryMan Profile Data (excluding password)
        const updatedDeliveryMan = yield deliveryMan_schema_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedDeliveryMan) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').deliveryManNotFound });
        }
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').dataUpdatedSuccessfully,
            data: updatedDeliveryMan,
        });
    }
    catch (error) {
        console.error('Error updating delivery man profile or password:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.updateDeliveryManProfileAndPassword = updateDeliveryManProfileAndPassword;
const getadmindata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield admin_schema_1.default.aggregate([
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                },
            },
        ]);
        console.log(data);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});
exports.getadmindata = getadmindata;
const postSupportTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Request body:', req.body);
        const data = yield SupportTicket_1.default.create(req.body);
        return res.status(201).json({
            message: 'Support ticket created successfully',
            data: data,
        });
    }
    catch (error) {
        console.error('Error creating support ticket:', error);
        return res.status(500).json({
            message: 'There was an error creating the support ticket',
        });
    }
});
exports.postSupportTicket = postSupportTicket;
const getSupportTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Request body:', req.body);
        const { id } = req.params;
        const data = yield SupportTicket_1.default.find({ userid: id }).populate('adminId', 'name email');
        console.log('data', data);
        return res.status(200).json({
            message: 'Support ticket get successfully',
            data: data,
        });
    }
    catch (error) {
        console.error('Error get support ticket:', error);
        return res.status(500).json({
            message: 'There was an error get the support ticket',
        });
    }
});
exports.getSupportTicket = getSupportTicket;
const deleteSupportTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ticketId } = req.params; // Get the ticket ID from the request parameters
        console.log(req.params);
        // Check if ticketId is provided
        if (!ticketId) {
            return res.status(400).json({
                message: 'Ticket ID is required',
            });
        }
        // Find and delete the support ticket by ID
        const deletedTicket = yield SupportTicket_1.default.findOneAndDelete(ticketId);
        // If the ticket was not found, return an error
        if (!deletedTicket) {
            return res.status(404).json({
                message: 'Support ticket not found',
            });
        }
        console.log('Deleted ticket:', deletedTicket);
        // Return success response
        return res.status(200).json({
            message: 'Support ticket deleted successfully',
            data: deletedTicket,
        });
    }
    catch (error) {
        console.error('Error deleting support ticket:', error);
        return res.status(500).json({
            message: 'There was an error deleting the support ticket',
        });
    }
});
exports.deleteSupportTicket = deleteSupportTicket;
const getAllNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        // Get all notifications for the user
        const notifications = yield notificatio_schema_1.default.aggregate([
            { $match: { userId: new mongoose_1.default.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'customer',
                    let: { customerId: { $toObjectId: "$customerid" } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$_id", "$$customerId"] }
                            }
                        }
                    ],
                    as: 'customer'
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $unwind: {
                    path: '$customer',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    message: 1,
                    subOrderId: 1,
                    deliveryBoyname: 1,
                    ismerchantdeliveryboy: 1,
                    type: 1,
                    orderId: 1,
                    isRead: 1,
                    createdAt: 1,
                    customerName: {
                        $concat: [
                            '$customer.firstName',
                            ' ',
                            '$customer.lastName'
                        ]
                    }
                }
            }
        ]);
        return res.status(200).json({
            message: 'Notifications retrieved successfully',
            data: notifications,
        });
    }
    catch (error) {
        console.error('Error getting notifications:', error);
        return res.status(500).json({
            message: 'There was an error retrieving notifications',
        });
    }
});
exports.getAllNotifications = getAllNotifications;
const markNotificationAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notificationId } = req.params;
        const userId = req.params.id;
        const notification = yield notificatio_schema_1.default.findOneAndUpdate({ _id: notificationId, userId }, { isRead: true }, { new: true });
        if (!notification) {
            return res.status(404).json({
                message: 'Notification not found',
            });
        }
        return res.status(200).json({
            message: 'Notification marked as read',
            data: notification,
        });
    }
    catch (error) {
        console.error('Error marking notification as read:', error);
        return res.status(500).json({
            message: 'There was an error updating the notification',
        });
    }
});
exports.markNotificationAsRead = markNotificationAsRead;
const markAllNotificationsAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        yield notificatio_schema_1.default.updateMany({ userId, isRead: false }, { isRead: true });
        return res.status(200).json({
            message: 'All notifications marked as read',
        });
    }
    catch (error) {
        console.error('Error marking all notifications as read:', error);
        return res.status(500).json({
            message: 'There was an error updating notifications',
        });
    }
});
exports.markAllNotificationsAsRead = markAllNotificationsAsRead;
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notificationId } = req.params;
        const userId = req.params.id;
        const deletedNotification = yield notificatio_schema_1.default.findOneAndDelete({
            _id: notificationId,
            userId,
        });
        if (!deletedNotification) {
            return res.status(404).json({
                message: 'Notification not found',
            });
        }
        return res.status(200).json({
            message: 'Notification deleted successfully',
            data: deletedNotification,
        });
    }
    catch (error) {
        console.error('Error deleting notification:', error);
        return res.status(500).json({
            message: 'There was an error deleting the notification',
        });
    }
});
exports.deleteNotification = deleteNotification;
const deleteAllNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notificationIds } = req.body;
        const userId = req.params.id;
        const deletedNotification = yield notificatio_schema_1.default.deleteMany({
            _id: { $in: notificationIds },
            userId,
        });
        if (!deletedNotification) {
            return res.status(404).json({
                message: 'Notification not found',
            });
        }
        return res.status(200).json({
            message: 'Notification deleted successfully',
            data: deletedNotification,
        });
    }
    catch (error) {
        console.error('Error deleting notification:', error);
        return res.status(500).json({
            message: 'There was an error deleting the notification',
        });
    }
});
exports.deleteAllNotifications = deleteAllNotifications;
const getUnreadNotificationCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const count = yield notificatio_schema_1.default.countDocuments({
            userId,
            isRead: false,
        });
        return res.status(200).json({
            message: 'Unread notification count retrieved successfully',
            data: { count },
        });
    }
    catch (error) {
        console.error('Error getting unread notification count:', error);
        return res.status(500).json({
            message: 'There was an error retrieving unread notification count',
        });
    }
});
exports.getUnreadNotificationCount = getUnreadNotificationCount;
const getAllDeliveryMans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { createdByAdmin } = req.query;
        var Query;
        if (createdByAdmin === 'true') {
            Query = {
                status: 'ENABLE',
                createdByAdmin: createdByAdmin === 'true',
            };
        }
        else {
            Query = {
                status: 'ENABLE',
            };
        }
        const data = yield deliveryMan_schema_1.default.aggregate([
            {
                $match: Object.assign({}, Query),
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
                    firstName: { $concat: ['Admin - ', '$firstName'] },
                    lastName: 1,
                    countryCode: 1,
                    contactNumber: 1,
                    email: 1,
                    status: 1,
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
        return res.ok({ data: data == null ? [] : data });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getAllDeliveryMans = getAllDeliveryMans;
const getSubscriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = req.query;
        return res.ok({
            data: yield subcription_schema_1.default.find().sort({ seconds: 1, amount: 1 }),
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getSubscriptions = getSubscriptions;
const SupportTicketUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, userId } = req.query;
        const data = yield SupportTicket_1.default.findById(id);
        console.log(data.userid, 'User', userId);
        if (data.userid == userId) {
            const updateData = yield SupportTicket_1.default.updateOne({ _id: id }, req.body, {
                new: true,
            });
            return res.status(200).json({
                message: 'Support ticket updated successfully',
                data: updateData,
            });
        }
        else {
            return res.status(400).json({
                message: 'You are not allowed to update this ticket',
            });
        }
    }
    catch (error) {
        console.error('Error updating support ticket:', error);
        return res.status(500).json({
            message: 'There was an error updating the support ticket',
        });
    }
});
exports.SupportTicketUpdate = SupportTicketUpdate;
const getAllTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tickets = yield SupportTicket_1.default.find({}, 'userid'); // Return only merchantName and _id
        res.json(tickets);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch tickets' });
    }
});
exports.getAllTickets = getAllTickets;
// Fetch messages for a specific ticket
const getMessagesByTicketId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticket = yield SupportTicket_1.default.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket.messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
});
exports.getMessagesByTicketId = getMessagesByTicketId;
// Add a new message to a specific ticket
const addMessageToTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text, sender } = req.body;
        if (!text || !['merchant', 'admin'].includes(sender)) {
            return res.status(400).json({ message: 'Invalid message data' });
        }
        const ticket = yield SupportTicket_1.default.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        // Add the new message
        ticket.messages.push({ text, sender });
        yield ticket.save();
        // Emit the new message to the ticket room
        index_1.io.to(req.params.id).emit('newMessage', { text, sender });
        res.json(ticket.messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to add message' });
    }
});
exports.addMessageToTicket = addMessageToTicket;
// Delete a message from a specific ticket
const deleteMessageFromTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Gfgeguefg');
        const { ticketId, messageId } = req.params;
        // Find the ticket by ID
        const ticket = yield SupportTicket_1.default.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        // Find the index of the message to delete
        const messageIndex = ticket.messages.findIndex((msg) => msg._id.toString() === messageId);
        if (messageIndex === -1) {
            return res.status(404).json({ message: 'Message not found' });
        }
        // Remove the message from the messages array
        ticket.messages.splice(messageIndex, 1);
        // Save the updated ticket
        yield ticket.save();
        // Emit the message deletion event via socket
        index_1.io.to(ticketId).emit('messageDeleted', { messageId });
        res.status(200).json({ message: 'Message deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete message' });
    }
});
exports.deleteMessageFromTicket = deleteMessageFromTicket;
const getDistance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { origin, destination, apiKey } = req.query;
    console.log(origin, 'Origin', destination, 'Destination', apiKey, 'Api Key');
    try {
        const response = yield axios_1.default.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: {
                origins: origin,
                destinations: destination,
                key: apiKey,
            },
        });
        console.log(response, 'Sdsdhdsfbsfsdfbf');
        res.json(response.data.rows[0].elements[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Error calling Google Maps API' });
    }
});
exports.getDistance = getDistance;
// export const forgotPassword = async (req: RequestParams, res: Response) => {
//   try {
//     const validateRequest = validateParamsWithJoi<{
//       email: string;
//       otp: number;
//       newPassword: string;
//     }>(req.body, forgotPasswordValidation);
//     if (!validateRequest.isValid) {
//       return res.badRequest({ message: validateRequest.message });
//     }
//     const { value } = validateRequest;
//     // Check if the user exists
//     const user = await merchantSchema.findOne({ email: value.email });
//     if (!user) {
//       return res.badRequest({ message: getLanguage('en').emailNotRegistered });
//     }
//     // Validate the OTP
//     const otpData = await otpSchema.findOne({
//       value: value.otp,
//       customerEmail: value.email,
//       expiry: { $gte: Date.now() },
//     });
//     if (!otpData) {
//       return res.badRequest({ message: getLanguage('en').otpExpired });
//     }
//     // Encrypt the new password
//     const encryptedPassword = await encryptPassword({ password: value.newPassword });
//     // Update the user's password
//     await merchantSchema.updateOne(
//       { email: value.email },
//       { $set: { password: encryptedPassword } }
//     );
//     // Optionally delete the OTP record after use
//     await otpSchema.deleteOne({ _id: otpData._id });
//     return res.ok({ message: getLanguage('en').passwordResetSuccess });
//   } catch (error) {
//     console.error('Error:', error);
//     return res.failureResponse({
//       message: getLanguage('en').somethingWentWrong,
//     });
//   }
// };
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.sendOtpValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        console.log(value);
        // Check if the user exists
        const user = yield user_schema_1.default.findOne({ email: value.email });
        console.log(user);
        if (!user) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').emailNotRegistered });
        }
        console.log('dfsad');
        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        yield (0, common_1.emailOrMobileOtp)(value.email, `This is your otp for Reset Password ${otp}`);
        yield otp_schema_1.default.create({
            value: otp,
            customerEmail: value.email,
            expiry: otpExpiry,
        });
        // Send OTP (mock or use an actual email/SMS service)
        console.log(`OTP for ${value.email}: ${otp}`);
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').otpSent });
    }
    catch (error) {
        console.error('Error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.sendOtp = sendOtp;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.verifyOtpValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        // Validate OTP
        const otpData = yield otp_schema_1.default.findOne({
            value: value.otp,
            expiry: { $gte: Date.now() },
        });
        if (!otpData) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').otpExpired });
        }
        // Optionally, mark OTP as used or delete it
        yield otp_schema_1.default.deleteOne({ _id: otpData._id });
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').otpVerified });
    }
    catch (error) {
        console.error('Error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.verifyOtp = verifyOtp;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.resetPasswordValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        // Check if the user exists
        const user = yield user_schema_1.default.findOne({ email: value.email });
        if (!user) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').emailNotRegistered });
        }
        // Encrypt the new password
        const encryptedPassword = yield (0, common_1.encryptPassword)({
            password: value.newPassword,
        });
        // Update the user's password
        yield user_schema_1.default.updateOne({ email: value.email }, { $set: { password: encryptedPassword } });
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').passwordResetSuccess });
    }
    catch (error) {
        console.error('Error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.resetPassword = resetPassword;
