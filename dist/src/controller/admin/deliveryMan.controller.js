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
exports.deleteDeliveryMan = exports.addDeliveryMan = exports.getUserWithdrawHistory = exports.getDeliveryManWalletHistory = exports.getUserNames = exports.getDeliveryManNames = exports.getDeliveryManInfo = exports.getDeliveryManOrders = exports.getAllDeliveryMansFromAdmin = exports.getAllDeliveryMans = exports.getDeliveryMans = exports.getDeliveryManProfileById = exports.getOrderLocations = exports.getDeliveryManLocations = exports.getDeliveryManDocuments = exports.updateVerificationStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../../enum");
const languageHelper_1 = require("../../language/languageHelper");
const deliveryMan_schema_1 = __importDefault(require("../../models/deliveryMan.schema"));
const deliveryManDocument_schema_1 = __importDefault(require("../../models/deliveryManDocument.schema"));
const order_schema_1 = __importDefault(require("../../models/order.schema"));
const user_schema_1 = __importDefault(require("../../models/user.schema"));
const wallet_schema_1 = __importDefault(require("../../models/wallet.schema"));
const common_1 = require("../../utils/common");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const auth_validation_1 = require("../../utils/validation/auth.validation");
const deliveryManDocument_schema_2 = __importDefault(require("../../models/deliveryManDocument.schema"));
const common_2 = require("../../utils/common");
const adminSide_validation_1 = require("../../utils/validation/adminSide.validation");
const updateVerificationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, adminSide_validation_1.verificationStatusValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const Query = { deliveryManId: value.deliveryManId, document: value.documentId, status: enum_1.SUBCRIPTION_REQUEST.PENDING };
        const checkDocumentExist = yield deliveryManDocument_schema_1.default.findOne(Query);
        if (!checkDocumentExist) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)("en").errorDocumentNotFound });
        }
        const documentUpdated = yield deliveryManDocument_schema_1.default.updateOne(Query, { $set: { status: value.status } });
        if (documentUpdated) {
            yield deliveryManDocument_schema_1.default.updateOne({ _id: value.deliveryManId }, { $set: { isVerified: true } });
        }
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').documentVerificationUpdatedSuccessfully,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.updateVerificationStatus = updateVerificationStatus;
const getDeliveryManDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.query, adminSide_validation_1.paginationValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const data = yield deliveryManDocument_schema_1.default.aggregate([
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $lookup: {
                    from: 'documents',
                    localField: 'document',
                    foreignField: '_id',
                    as: 'documentData',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$documentData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$deliveryManId',
                    data: {
                        $push: {
                            documentId: '$documentData._id',
                            documentName: '$documentData.name',
                            createdAt: '$createdAt',
                            document: '$image',
                            status: '$status',
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: 'deliveryMan',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'deliveryManData',
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
                    path: '$deliveryManData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    deliveryManId: '$_id',
                    deliveryManName: '$deliveryManData.name',
                    documents: '$data',
                },
            },
            {
                $unwind: {
                    path: '$documents',
                    preserveNullAndEmptyArrays: true,
                },
            },
            ...(0, common_1.getMongoCommonPagination)({
                pageCount: value.pageCount,
                pageLimit: value.pageLimit,
            }),
        ]);
        return res.ok({ data: data[0] });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getDeliveryManDocuments = getDeliveryManDocuments;
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
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getDeliveryManLocations = getDeliveryManLocations;
const getOrderLocations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.query, adminSide_validation_1.orderLocationValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const Query = { status: value.status };
        const AssignQuery = {
            status: value.status !== enum_1.ADMIN_ORDER_LOCATIONS.ACCEPTED
                ? enum_1.ORDER_STATUS.ACCEPTED
                : value.status,
        };
        if (value.status === enum_1.ADMIN_ORDER_LOCATIONS.ACCEPTED) {
            Query.status = enum_1.ADMIN_ORDER_LOCATIONS.ASSIGNED;
        }
        else if (value.status === enum_1.ADMIN_ORDER_LOCATIONS.ARRIVED) {
            Query.status = enum_1.ORDER_STATUS.CREATED;
            AssignQuery.status = enum_1.SUBCRIPTION_REQUEST.PENDING;
        }
        const data = yield order_schema_1.default.aggregate([
            {
                $match: Query,
            },
            {
                $lookup: {
                    from: 'orderAssign',
                    localField: 'orderId',
                    foreignField: 'order',
                    as: 'orderAssignData',
                    pipeline: [{ $match: AssignQuery }],
                },
            },
            {
                $unwind: {
                    path: '$orderAssignData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: { "orderAssignData": { $exists: true } }
            },
            {
                $project: {
                    _id: 0,
                    orderId: 1,
                    pickupLocation: '$pickupDetails.location.coordinates',
                    deliveryLocation: '$deliveryLocation.coordinates',
                },
            },
        ]);
        return res.ok({ data: data[0] });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getOrderLocations = getOrderLocations;
const getDeliveryManProfileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.params, adminSide_validation_1.deliveryManIdValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const data = yield deliveryMan_schema_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(value.deliveryManId),
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
                $lookup: {
                    from: 'deliveryManDocuments',
                    localField: '_id',
                    foreignField: 'deliveryManId',
                    as: 'documents',
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                documentNumber: 1,
                                document: '$image',
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    image: 1,
                    mobileNumber: 1,
                    location: {
                        $concat: ['$cityData.cityName', ',', '$countryData.countryName'],
                    },
                    address: 1,
                    documents: 1,
                },
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
exports.getDeliveryManProfileById = getDeliveryManProfileById;
const getDeliveryMans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.query, adminSide_validation_1.deliveryManListValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const Query = {
            isVerified: value.isVerified,
            isCustomer: false,
        };
        if (value.searchValue) {
            Query.name = { $regex: new RegExp(value.searchValue, 'i') };
        }
        const data = yield deliveryMan_schema_1.default.aggregate([
            {
                $match: Query,
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
                $project: {
                    name: 1,
                    countryCode: 1,
                    contactNumber: 1,
                    email: 1,
                    status: 1,
                    country: '$countryData.countryName',
                    city: '$cityData.cityName',
                    registerDate: '$createdAt',
                    isVerified: 1,
                    location: {
                        latitude: { $arrayElemAt: ['$location.coordinates', 0] },
                        longitude: { $arrayElemAt: ['$location.coordinates', 1] },
                    },
                },
            },
            ...(0, common_1.getMongoCommonPagination)({
                pageCount: value.pageCount,
                pageLimit: value.pageLimit,
            }),
        ]);
        return res.ok({ data: data[0] });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getDeliveryMans = getDeliveryMans;
const getAllDeliveryMans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield deliveryMan_schema_1.default.aggregate([
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
        return res.ok({ data });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getAllDeliveryMans = getAllDeliveryMans;
const getAllDeliveryMansFromAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield deliveryMan_schema_1.default.aggregate([
            {
                $match: { createdByAdmin: true }
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
        return res.ok({ data });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getAllDeliveryMansFromAdmin = getAllDeliveryMansFromAdmin;
const getDeliveryManOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Object.assign(req.params, req.query);
        const validateRequest = (0, validateRequest_1.default)(req.params, adminSide_validation_1.deliveryManOrderListValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const Query = {
            'orderAssignInfo.deliveryBoy': new mongoose_1.default.Types.ObjectId(value.deliveryManId),
            'orderAssignInfo.status': enum_1.ORDER_REQUEST.ACCEPTED,
            status: { $ne: enum_1.ORDER_HISTORY.DELIVERED }
        };
        if (value.orderListType === enum_1.ORDER_LIST.COMPLETED) {
            Query.status = enum_1.ORDER_HISTORY.DELIVERED;
        }
        const data = yield order_schema_1.default.aggregate([
            {
                $lookup: {
                    from: 'orderAssign',
                    localField: 'orderId',
                    foreignField: 'order',
                    as: 'orderAssignInfo',
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                deliveryBoy: 1,
                                status: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$orderAssignInfo',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: Query,
            },
            {
                $sort: {
                    createdAt: 1,
                },
            },
            {
                $lookup: {
                    from: 'country',
                    localField: 'country',
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
                    localField: 'city',
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
                $lookup: {
                    from: 'users',
                    // localField: 'customer',
                    localField: 'merchant',
                    foreignField: '_id',
                    as: 'userData',
                },
            },
            {
                $unwind: {
                    path: '$userData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'deliveryMan',
                    localField: 'orderAssignData.deliveryBoy',
                    foreignField: '_id',
                    as: 'deliveryManData',
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
                    path: '$deliveryManData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    orderId: 1,
                    createdAt: 1,
                    customerName: '$userData.name',
                    pickupAddress: '$pickupDetails.address',
                    deliveryAddress: '$deliveryDetails.address',
                    deliveryMan: '$deliveryManData.name',
                    pickupDate: '$pickupDetails.orderTimestamp',
                    deliveryDate: '$deliveryDetails.orderTimestamp',
                    pickupRequest: '$pickupDetails.request',
                    postCode: '$pickupDetails.postCode',
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
exports.getDeliveryManOrders = getDeliveryManOrders;
const getDeliveryManInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Object.assign(req.params, req.query);
        const validateRequest = (0, validateRequest_1.default)(req.params, adminSide_validation_1.orderWiseDeliveryManValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const data = yield order_schema_1.default.aggregate([
            {
                $match: {
                    orderId: value.orderId,
                },
            },
            {
                $lookup: {
                    from: 'deliveryMan',
                    localField: 'city',
                    foreignField: 'cityId',
                    as: 'deliveryMans',
                },
            },
            {
                $unwind: {
                    path: '$deliveryMans',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $replaceRoot: {
                    newRoot: '$deliveryMans',
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
                $project: {
                    deliveryManId: '$_id',
                    deliveryManName: '$name',
                    city: '$cityData.cityName',
                },
            },
            ...(0, common_1.getMongoCommonPagination)({
                pageCount: value.pageCount,
                pageLimit: value.pageLimit,
            }),
        ]);
        return res.ok({ data: data[0] });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getDeliveryManInfo = getDeliveryManInfo;
const getDeliveryManNames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.query, adminSide_validation_1.paginationValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const data = yield deliveryMan_schema_1.default.aggregate([
            {
                $project: {
                    deliveryManId: '$_id',
                    deliveryManName: '$name',
                },
            },
            ...(0, common_1.getMongoCommonPagination)({
                pageCount: value.pageCount,
                pageLimit: value.pageLimit,
            }),
        ]);
        return res.ok({ data: data[0] });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getDeliveryManNames = getDeliveryManNames;
const getUserNames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.query, adminSide_validation_1.paginationValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const data = yield user_schema_1.default.aggregate([
            {
                $project: {
                    userId: '$_id',
                    userName: '$name',
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
exports.getUserNames = getUserNames;
const getDeliveryManWalletHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Object.assign(req.params, req.query);
        const validateRequest = (0, validateRequest_1.default)(req.params, adminSide_validation_1.deliveryManWalletListValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const data = yield wallet_schema_1.default.aggregate([
            {
                $match: {
                    personId: new mongoose_1.default.Types.ObjectId(value.deliveryManId),
                    userFlag: enum_1.PERSON_TYPE.DELIVERY_BOY,
                    type: value.transactionType,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $lookup: {
                    from: 'deliveryMan',
                    localField: 'personId',
                    foreignField: '_id',
                    as: 'deliveryManData',
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
                    path: '$deliveryManData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    walletId: '$_id',
                    name: '$deliveryManData.name',
                    amount: 1,
                    availableBalance: 1,
                    createdAt: 1,
                    status: 1,
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
exports.getDeliveryManWalletHistory = getDeliveryManWalletHistory;
const getUserWithdrawHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Object.assign(req.params, req.query);
        const validateRequest = (0, validateRequest_1.default)(req.params, adminSide_validation_1.userWalletListValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const data = yield wallet_schema_1.default.aggregate([
            {
                $match: {
                    userFlag: enum_1.PERSON_TYPE.CUSTOMER,
                    type: enum_1.TRANSACTION_TYPE.WITHDRAW,
                    status: value.transactionStatus,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'personId',
                    foreignField: '_id',
                    as: 'userData',
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
                    path: '$userData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    walletId: '$_id',
                    name: '$userData.name',
                    amount: 1,
                    availableBalance: 1,
                    createdAt: 1,
                    type: 1,
                    status: 1,
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
exports.getUserWithdrawHistory = getUserWithdrawHistory;
const addDeliveryMan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.deliveryManSignUpValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const userExist = yield deliveryMan_schema_1.default.findOne({ email: value.email });
        if (userExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').emailRegisteredAlready,
            });
        }
        value.password = yield (0, common_2.encryptPassword)({ password: value.password });
        const data = yield deliveryMan_schema_1.default.create(Object.assign(Object.assign({}, value), { createdByAdmin: true, isVerified: true }));
        if (((_a = value.documents) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            const documentNames = yield Promise.all(value.documents.map((i, j) => __awaiter(void 0, void 0, void 0, function* () {
                const document = i.image.split(',');
                return {
                    document: i.documentId,
                    image: yield (0, common_2.uploadFile)(document[0], document[1], `DOCUMENT-${j}-`),
                    documentNumber: i.documentNumber,
                    deliveryManId: data._id,
                };
            })));
            yield deliveryManDocument_schema_2.default.insertMany(documentNames);
        }
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').userRegistered, data });
    }
    catch (error) {
        console.log('🚀 ~ addDeliveryMan ~ error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.addDeliveryMan = addDeliveryMan;
const deleteDeliveryMan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deliveryManId } = req.params;
        if (!deliveryManId) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidDeliveryMan });
        }
        const deliveryMan = yield deliveryMan_schema_1.default.findById(deliveryManId);
        if (!deliveryMan) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').deliveryManNotFound });
        }
        yield deliveryMan_schema_1.default.deleteOne({ _id: deliveryManId });
        yield deliveryManDocument_schema_2.default.deleteMany({ deliveryManId });
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').deliveryBoysDeleted });
    }
    catch (error) {
        console.log('🚀 ~ deleteDeliveryMan ~ error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.deleteDeliveryMan = deleteDeliveryMan;
