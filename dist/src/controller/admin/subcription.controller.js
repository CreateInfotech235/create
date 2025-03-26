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
exports.updateStatus = exports.deleteMerchant = exports.updateProfileOfMerchant = exports.exportFreeSubscription = exports.addUser = exports.getAllUsersFromAdmin = exports.getAllUsers = exports.getUsers = exports.getPendingSubscription = exports.acceptSubscription = exports.getApproveSubscription = exports.deletePurchaseSubscription = exports.deleteSubscription = exports.getSubscriptions = exports.manageSubscriptions = void 0;
const enum_1 = require("../../enum");
const languageHelper_1 = require("../../language/languageHelper");
const subcription_schema_1 = __importDefault(require("../../models/subcription.schema"));
const subcriptionPurchase_schema_1 = __importDefault(require("../../models/subcriptionPurchase.schema"));
const user_schema_1 = __importDefault(require("../../models/user.schema"));
const common_1 = require("../../utils/common");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const adminSide_validation_1 = require("../../utils/validation/adminSide.validation");
const common_2 = require("../../utils/common");
const auth_validation_1 = require("../../utils/validation/auth.validation");
const manageSubscriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, adminSide_validation_1.manageSubscriptionValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        if (value.subscriptionId) {
            const checkSubcriptionExist = yield subcription_schema_1.default.findById(value.subscriptionId);
            if (!checkSubcriptionExist) {
                return res.badRequest({
                    message: (0, languageHelper_1.getLanguage)('en').subcriptionDataNotFound,
                });
            }
            yield subcription_schema_1.default.updateOne({ _id: value.subscriptionId }, {
                $set: Object.assign(Object.assign(Object.assign({}, value), (value.days && { seconds: value.days * 86400 })), (value.isDesable && { isDesable: value.isDesable })),
            });
        }
        else {
            value.seconds = value.days * 86400;
            if (yield subcription_schema_1.default.findOne(value)) {
                return res.badRequest({
                    message: (0, languageHelper_1.getLanguage)('en').subcriptionAlreadyCreated,
                });
            }
            yield subcription_schema_1.default.create(value);
        }
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').dataUpdatedSuccessfully });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.manageSubscriptions = manageSubscriptions;
const getSubscriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.query, adminSide_validation_1.paginationValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        return res.ok({
            data: yield subcription_schema_1.default
                .find()
                .sort({ seconds: 1, amount: 1 })
                .skip((value.pageCount - 1) * value.pageLimit)
                .limit(value.pageLimit),
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getSubscriptions = getSubscriptions;
const deleteSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request parameters to ensure the subscription ID is provided and valid
        const validateRequest = (0, validateRequest_1.default)(req.params, adminSide_validation_1.subscription);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { id } = validateRequest.value;
        // Attempt to delete the subscription from the database
        const deletedSubscription = yield subcription_schema_1.default.findByIdAndDelete(id);
        if (!deletedSubscription) {
            return res.badRequest({
                message: 'Subscription not found or already deleted',
            });
        }
        return res.ok({
            message: 'Subscription deleted successfully',
            data: deletedSubscription,
        });
    }
    catch (error) {
        // Handle any unexpected errors
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.deleteSubscription = deleteSubscription;
const deletePurchaseSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request parameters to ensure the subscription ID is provided and valid
        const validateRequest = (0, validateRequest_1.default)(req.params, adminSide_validation_1.subscription);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { id } = validateRequest.value;
        // Attempt to delete the subscription from the database
        const deletedSubscription = yield subcriptionPurchase_schema_1.default.findByIdAndDelete(id);
        if (!deletedSubscription) {
            return res.badRequest({
                message: 'Subscription not found or already deleted',
            });
        }
        return res.ok({
            message: 'Subscription deleted successfully',
            data: deletedSubscription,
        });
    }
    catch (error) {
        // Handle any unexpected errors
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.deletePurchaseSubscription = deletePurchaseSubscription;
const getApproveSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield subcriptionPurchase_schema_1.default.find({ status: 'APPROVED' });
        res.status(200).json({
            data: data,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getApproveSubscription = getApproveSubscription;
const acceptSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, adminSide_validation_1.subcriptionStatusValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const subcriptionExist = yield subcriptionPurchase_schema_1.default.findOne({
            _id: value.subscriptionId,
            status: enum_1.SUBCRIPTION_REQUEST.PENDING,
        });
        if (!subcriptionExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').errorActivation,
            });
        }
        const filter = {
            status: enum_1.SUBCRIPTION_REQUEST.PENDING,
        };
        const data = yield subcription_schema_1.default.findById(subcriptionExist.subcriptionId);
        yield subcriptionPurchase_schema_1.default.updateOne(filter, {
            $set: {
                status: value.subscriptionStatus,
                expiry: Date.now() + data.seconds * 1000,
            },
        });
        return res.ok({});
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.acceptSubscription = acceptSubscription;
const getPendingSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.query, adminSide_validation_1.paginationValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        console.log(value);
        const data = yield user_schema_1.default.aggregate([
            {
                $lookup: {
                    from: 'subcriptionPurchase',
                    localField: '_id',
                    // foreignField: 'customer',
                    foreignField: 'merchant',
                    as: 'subcriptionData',
                    pipeline: [
                        {
                            $match: {
                                expiry: { $gte: new Date() },
                                status: enum_1.SUBCRIPTION_REQUEST.PENDING,
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                status: 1,
                                createdAt: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$subcriptionData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    subcriptionData: { $exists: true },
                },
            },
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    userName: '$name',
                    medicalCertificate: 1,
                    medicalCertificateNumber: 1,
                    subcriptionId: '$subcriptionData._id',
                    subcriptionStatus: '$subcriptionData.status',
                    subcriptionCreatedAt: '$subcriptionData.createdAt',
                },
            },
            ...(0, common_1.getMongoCommonPagination)({
                pageCount: value.pageCount,
                pageLimit: value.pageLimit,
            }),
        ]);
        return res.ok({ data });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getPendingSubscription = getPendingSubscription;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.query, adminSide_validation_1.subcriptionStatusListValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        value.isSubscribed = value.isSubscribed === 'true';
        const data = yield user_schema_1.default.aggregate([
            {
                $lookup: {
                    from: 'subcriptionPurchase',
                    localField: '_id',
                    // foreignField: 'customer',
                    foreignField: 'merchant',
                    as: 'subcriptionData',
                    pipeline: [
                        {
                            $match: Object.assign(Object.assign({}, (value.isSubscribed && { expiry: { $gte: new Date() } })), { status: value.isSubscribed
                                    ? enum_1.SUBCRIPTION_REQUEST.APPROVED
                                    : {
                                        $in: Object.keys(enum_1.SUBCRIPTION_REQUEST),
                                    } }),
                        },
                        {
                            $project: {
                                _id: 1,
                                createdAt: -1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$subcriptionData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    'subcriptionData._id': { $exists: value.isSubscribed },
                },
            },
            {
                $sort: {
                    'subcriptionData.createdAt': -1,
                },
            },
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    // userName: '$name',
                    firstName: 1,
                    lastName: 1,
                    registerDate: '$createdAt',
                    contactNumber: 1,
                    countryCode: 1,
                    country: 1,
                    city: 1,
                    address: 1,
                    email: 1,
                    medicalCertificateNumber: 1,
                    status: 1,
                    isVerified: 1,
                },
            },
            ...(0, common_1.getMongoCommonPagination)({
                pageCount: value.pageCount,
                pageLimit: value.pageLimit,
            }),
        ]);
        return res.ok({ data });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getUsers = getUsers;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield user_schema_1.default.aggregate([
            {
                $sort: { createdAt: -1 },
            },
            {
                $project: {
                    _id: 1,
                    // userName: '$name',
                    firstName: 1,
                    lastName: 1,
                    registerDate: {
                        $dateToString: {
                            format: '%d-%m-%Y | %H:%M',
                            date: '$createdAt',
                        },
                    },
                    contactNumber: 1,
                    countryCode: 1,
                    address: 1,
                    email: 1,
                    medicalCertificateNumber: 1,
                    status: 1,
                    isVerified: 1,
                    createdByAdmin: 1,
                },
            },
        ]);
        console.log(data);
        return res.ok({ data });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getAllUsers = getAllUsers;
const getAllUsersFromAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield user_schema_1.default.aggregate([
            {
                $sort: { createdAt: -1 },
            },
            {
                $project: {
                    _id: 1,
                    // userName: '$name',
                    firstName: '$firstName',
                    lastName: '$lastName',
                    registerDate: '$createdAt',
                    contactNumber: 1,
                    countryCode: 1,
                    address: 1,
                    email: 1,
                    medicalCertificateNumber: 1,
                    status: 1,
                    isApproved: 1,
                    isVerified: 1,
                    reason: 1,
                    createdByAdmin: 1,
                },
            },
            {
                $match: (() => {
                    if (req.query.existss === 'true') {
                        return { createdByAdmin: true };
                    }
                    if (req.query.existss === 'false') {
                        return { createdByAdmin: false };
                    }
                    return {};
                })(),
            },
        ]);
        return res.ok({ data });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getAllUsersFromAdmin = getAllUsersFromAdmin;
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.userSignUpValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
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
            value.image = yield (0, common_2.uploadFile)(Image[0], Image[1], 'MERCHANT(USER)-PROFILE');
        }
        value.password = yield (0, common_2.encryptPassword)({ password: value.password });
        yield user_schema_1.default.create(Object.assign(Object.assign({}, value), { createdByAdmin: true, isVerified: true }));
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').userRegistered });
    }
    catch (error) {
        console.log('🚀 ~ merchant ~ error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.addUser = addUser;
const exportFreeSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield subcriptionPurchase_schema_1.default.aggregate([
            {
                $lookup: {
                    from: 'subcriptions',
                    localField: 'subcriptionId',
                    foreignField: '_id',
                    as: 'subcriptionData',
                },
            },
            {
                $lookup: {
                    from: 'merchants',
                    localField: 'merchant',
                    foreignField: '_id',
                    as: 'merchantData',
                },
            },
            {
                $match: {
                    'subcriptionData.type': '1 Month Free Trial',
                    expiry: { $lt: new Date() },
                },
            },
            {
                $unwind: '$subcriptionData',
            },
            {
                $unwind: '$merchantData',
            },
            {
                $project: {
                    _id: 1,
                    // name: { $concat: ['$merchantData.firstName', ' ', '$merchantData.lastName'] },
                    firstName: '$merchantData.firstName',
                    lastName: '$merchantData.lastName',
                    contactNumber: { $toString: '$merchantData.contactNumber' },
                    email: '$merchantData.email',
                    country: '$merchantData.address.country',
                    city: '$merchantData.address.city',
                    registerDate: {
                        $dateToString: {
                            format: '%d-%m-%Y , %H:%M',
                            date: '$merchantData.createdAt',
                        },
                    },
                    status: 'Disable',
                    expiry: {
                        $dateToString: {
                            format: '%d-%m-%Y , %H:%M',
                            date: '$expiry',
                        },
                    },
                },
            },
        ]);
        res.status(200).json({ data });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.exportFreeSubscription = exportFreeSubscription;
const updateProfileOfMerchant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
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
const deleteMerchant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedMerchant = yield user_schema_1.default.findByIdAndDelete(id);
        if (!deletedMerchant) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').userNotFound });
        }
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').userDeleted });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.deleteMerchant = deleteMerchant;
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        console.log(updateData, id);
        const updatedUser = yield user_schema_1.default.findByIdAndUpdate(id, { isApproved: updateData.status, reason: updateData.reason }, {
            new: true,
            runValidators: true,
        });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').dataUpdatedSuccessfully,
            data: updatedUser,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.updateStatus = updateStatus;
