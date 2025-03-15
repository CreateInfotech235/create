"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.stripPayment = exports.getApproveSubscription = exports.resetPassword = exports.verifyOtp = exports.sendOtp = exports.moveToTrashDeliveryMan = exports.updateDeliveryManProfile = exports.deleteDeliveryMan = exports.getDeliveryManLocation = exports.getDeliveryManProfile = exports.updateLocation = exports.getDeliveryBoysForMerchant = exports.updateDeliveryManStatus = exports.updateDeliveryManProfileAndPassword = exports.signUp = exports.verifyPassword = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const enum_1 = require("../../enum");
const languageHelper_1 = require("../../language/languageHelper");
const deliveryMan_schema_1 = __importDefault(require("../../models/deliveryMan.schema"));
const deliveryManDocument_schema_1 = __importDefault(require("../../models/deliveryManDocument.schema"));
const document_schema_1 = __importDefault(require("../../models/document.schema"));
const otp_schema_1 = __importDefault(require("../../models/otp.schema"));
const common_1 = require("../../utils/common");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const auth_validation_1 = require("../../utils/validation/auth.validation");
const auth_validation_2 = require("../../utils/validation/auth.validation");
const deliveryMan_validation_1 = require("../../utils/validation/deliveryMan.validation");
const bcrypt_1 = __importDefault(require("bcrypt"));
const orderAssigneeMulti_schema_1 = __importDefault(require("../../models/orderAssigneeMulti.schema"));
const subcriptionPurchase_schema_1 = __importDefault(require("../../models/subcriptionPurchase.schema"));
const user_schema_1 = __importDefault(require("../../models/user.schema"));
const stripe_1 = __importDefault(require("stripe"));
const subcription_schema_1 = __importDefault(require("../../models/subcription.schema"));
const stripe = new stripe_1.default('sk_test_51QWXp5FWojz9eoui3b20GWIoF6Yxged00OdF74C7SSSqnpYie13SsJWAm6ev4AvSaA8lLl3JjZJWvRxqeIB9wihP00AaiXdZKs');
const verifyPassword = (_a) => __awaiter(void 0, [_a], void 0, function* ({ password, hash, }) {
    return bcrypt_1.default.compare(password, hash);
});
exports.verifyPassword = verifyPassword;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.deliveryManSignUpValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        console.log(value);
        if (!value.image) {
            value.image = process.env.DEFAULT_PROFILE_IMAGE;
        }
        else {
            const Image = value.image.split(',');
            value.image = yield (0, common_1.uploadFile)(Image[0], Image[1], 'DELIVERYMAN-PROFILE');
        }
        const isFromMerchantPanel = !!value.merchantId;
        let documents = yield document_schema_1.default.find({
            isRequired: true,
            status: enum_1.SWITCH.ENABLE,
        });
        if (!isFromMerchantPanel && documents.length !== value.documents.length) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').errorDocumentMissing,
            });
        }
        if (!isFromMerchantPanel && value.documents.length > 0) {
            documents = yield document_schema_1.default.find({
                _id: { $in: value.documents.map((i) => i.documentId) },
            });
            if ((documents === null || documents === void 0 ? void 0 : documents.length) === 0) {
                return res.badRequest({
                    message: (0, languageHelper_1.getLanguage)('en').errorInvalidDocument,
                });
            }
        }
        console.log(value.email, 'email');
        const userExist = yield deliveryMan_schema_1.default.findOne({
            email: value.email,
        });
        if (userExist) {
            console.log(userExist, 'userExist');
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').emailRegisteredAlready,
            });
        }
        if (!isFromMerchantPanel && (value === null || value === void 0 ? void 0 : value.otp)) {
            const otpData = yield otp_schema_1.default.findOne({
                value: value.otp,
                customerEmail: value.email,
                expiry: { $gte: Date.now() },
            });
            if (!otpData) {
                return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').otpExpired });
            }
        }
        value.password = yield (0, common_1.encryptPassword)({ password: value.password });
        const datamarcent = yield user_schema_1.default.findById(value.merchantId);
        yield user_schema_1.default.updateOne({ _id: value.merchantId }, {
            $set: { showDeliveryManNumber: datamarcent.showDeliveryManNumber + 1 },
        });
        const data = yield deliveryMan_schema_1.default.create(Object.assign(Object.assign({}, value), { location: {
                type: 'Point',
                coordinates: [value.location.longitude, value.location.latitude],
            }, defaultLocation: {
                type: 'Point',
                coordinates: [
                    value.defaultLocation.longitude,
                    value.defaultLocation.latitude,
                ],
            }, createdByMerchant: isFromMerchantPanel, isVerified: isFromMerchantPanel ? true : false, showDeliveryManNumber: datamarcent.showDeliveryManNumber }));
        if (((_b = value.documents) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            const documentNames = yield Promise.all(value.documents.map((i, j) => __awaiter(void 0, void 0, void 0, function* () {
                const document = i.image.split(',');
                return {
                    document: i.documentId,
                    image: yield (0, common_1.uploadFile)(document[0], document[1], `DOCUMENT-${j}-`),
                    documentNumber: i.documentNumber,
                    deliveryManId: data._id,
                };
            })));
            yield deliveryManDocument_schema_1.default.insertMany(documentNames);
        }
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').userRegistered, data });
    }
    catch (error) {
        console.log('🚀 ~ signUp ~ error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.signUp = signUp;
const updateDeliveryManProfileAndPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        console.log(updateData);
        // Update Password Logic
        if ((updateData === null || updateData === void 0 ? void 0 : updateData.oldPassword) ||
            (updateData === null || updateData === void 0 ? void 0 : updateData.newPassword) ||
            (updateData === null || updateData === void 0 ? void 0 : updateData.confirmPassword)) {
            const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_2.updatePasswordValidation);
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
            const isPasswordValid = yield (0, exports.verifyPassword)({
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
        if (updateData === null || updateData === void 0 ? void 0 : updateData.address) {
            try {
                const apiKey = 'AIzaSyDB4WPFybdVL_23rMMOAcqIEsPaSsb-jzo';
                const response = yield fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(updateData.address)}&key=${apiKey}`);
                const data = yield response.json();
                if (data.results && data.results.length > 0) {
                    const { lat, lng } = data.results[0].geometry.location;
                    updateData.defaultLocation = {
                        type: 'Point',
                        coordinates: [lng, lat],
                    };
                }
                else {
                    alert('Address not found. Please try again.');
                }
            }
            catch (error) {
                console.error('Error fetching geocode data:', error);
                alert('An error occurred while processing the address. Please try again.');
            }
        }
        else {
            alert('Please enter an address.');
        }
        console.log(updateData.defaultLocation, 'Loc');
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
const updateDeliveryManStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // DeliveryMan ID
        const { status } = req.body; // New status (ENABLE/DISABLE)
        if (![enum_1.SWITCH.ENABLE, enum_1.SWITCH.DISABLE].includes(status)) {
            return res.badRequest({ message: 'Invalid status value.' });
        }
        const deliveryMan = yield deliveryMan_schema_1.default.findById(id);
        if (!deliveryMan) {
            return res.status(404).json({ message: 'Delivery man not found.' });
        }
        // Update status
        deliveryMan.status = status;
        yield deliveryMan.save();
        return res.ok({
            message: 'Status updated successfully.',
            data: deliveryMan,
        });
    }
    catch (error) {
        console.log('🚀 ~ updateDeliveryManStatus ~ error:', error);
        return res.failureResponse({
            message: 'Something went wrong while updating the status.',
        });
    }
});
exports.updateDeliveryManStatus = updateDeliveryManStatus;
const getDeliveryBoysForMerchant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const merchantId = req.params.merchantId;
        const deliveryBoys = yield deliveryMan_schema_1.default.find({
            createdByMerchant: true,
            merchantId,
        });
        if (!deliveryBoys || deliveryBoys.length === 0) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').noDeliveryBoysFound });
        }
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').deliveryBoysFetched,
            data: deliveryBoys,
        });
    }
    catch (error) {
        console.log('🚀 ~ getDeliveryBoysForMerchant ~ error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getDeliveryBoysForMerchant = getDeliveryBoysForMerchant;
const updateLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, deliveryMan_validation_1.updateLocationValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        console.log(value);
        console.log(req.id);
        yield deliveryMan_schema_1.default.updateOne({ _id: req.id }, {
            $set: {
                // countryId: value.country,
                // cityId: value.city,
                location: {
                    type: 'Point',
                    coordinates: [value.location.longitude, value.location.latitude],
                },
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
exports.updateLocation = updateLocation;
// export const getDeliveryManProfile = async (req: RequestParams, res: Response) => {
//   try {
//     const { id } = req.params;
//     const deliveryMan = await deliveryManSchema.findById(id);
//     if (!deliveryMan) {
//       return res.badRequest({ message: getLanguage('en').deliveryManNotFound });
//     }
//     return res.ok({ data: deliveryMan });
//   } catch (error) {
//     console.error('Error fetching delivery man profile:', error);
//     return res.failureResponse({ message: getLanguage('en').somethingWentWrong });
//   }
// };
const getDeliveryManProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate ID before using it
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            return res.badRequest({ message: 'Invalid delivery man ID' });
        }
        // const totalOrders = await OrderAssigneeSchema.countDocuments({
        //   deliveryBoy: req.params.id,
        // });
        console.log(req.params.id, 'id');
        const totalsuboder = yield orderAssigneeMulti_schema_1.default.aggregate([
            {
                $match: {
                    deliveryBoy: new mongoose_1.default.Types.ObjectId(req.params.id), // Use the ID from the request parameters
                },
            },
            {
                $lookup: {
                    from: 'ordermultis',
                    localField: 'order',
                    foreignField: 'orderId',
                    as: 'orderMultiData',
                },
            },
        ]);
        console.log(totalsuboder, 'totalsuboder');
        let totalOrderCount = 0;
        let totalAssignedOrdersCount = 0;
        let totalCancelledOrders = 0;
        let totalDeliveredOrders = 0;
        for (const item of totalsuboder) {
            if (item.orderMultiData && Array.isArray(item.orderMultiData)) {
                for (const orderMulti of item.orderMultiData) {
                    if (orderMulti.deliveryDetails &&
                        Array.isArray(orderMulti.deliveryDetails)) {
                        for (const deliveryDetail of orderMulti.deliveryDetails) {
                            if (deliveryDetail.status === enum_1.ORDER_STATUS.ASSIGNED) {
                                totalAssignedOrdersCount++;
                            }
                            else if (deliveryDetail.status === enum_1.ORDER_STATUS.CANCELLED) {
                                totalCancelledOrders++;
                            }
                            else if (deliveryDetail.status === enum_1.ORDER_STATUS.DELIVERED) {
                                totalDeliveredOrders++;
                            }
                            totalOrderCount++;
                        }
                    }
                }
            }
        }
        console.log(totalOrderCount, 'totalOrderCount');
        console.log(totalAssignedOrdersCount, 'totalAssignedOrdersCount');
        console.log(totalCancelledOrders, 'totalCancelledOrders');
        console.log(totalDeliveredOrders, 'totalDeliveredOrders');
        const result = yield deliveryMan_schema_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(req.params.id),
                },
            },
            {
                $lookup: {
                    from: 'orderAssign',
                    let: { deliveryBoyId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$deliveryBoy', '$$deliveryBoyId'],
                                },
                            },
                        },
                    ],
                    as: 'allOrders',
                },
            },
            {
                $lookup: {
                    from: 'orders',
                    let: { orderIds: '$allOrders.order' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $in: ['$orderId', '$$orderIds'] },
                                        { $eq: ['$status', 'DELIVERED'] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'orderDetails',
                },
            },
            {
                $lookup: {
                    from: 'orderAssign',
                    let: { deliveryBoyId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$deliveryBoy', '$$deliveryBoyId'] },
                                        { $eq: ['$status', enum_1.ORDER_REQUEST.ACCEPTED] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'acceptedOrders',
                },
            },
            {
                $lookup: {
                    from: 'orderAssign',
                    let: { deliveryBoyId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$deliveryBoy', '$$deliveryBoyId'] },
                                        { $eq: ['$status', enum_1.ORDER_REQUEST.REJECT] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'rejectedOrders',
                },
            },
            {
                $addFields: {
                    totalOrderCount: totalOrderCount,
                    totalAcceptedOrders: totalAssignedOrdersCount,
                    totalCancelledOrders: totalCancelledOrders,
                    totalDeliveredOrders: totalDeliveredOrders,
                    totalAssignedOrdersCount: totalAssignedOrdersCount,
                },
            },
            {
                $project: {
                    _id: 1,
                    cityId: 1,
                    countryId: 1,
                    address: 1,
                    firstName: {
                        $ifNull: [
                            '$firstName',
                            {
                                $ifNull: [
                                    { $arrayElemAt: [{ $split: ['$name', ' '] }, 0] },
                                    '',
                                ],
                            },
                        ],
                    },
                    lastName: {
                        $ifNull: [
                            '$lastName',
                            {
                                $ifNull: [
                                    { $arrayElemAt: [{ $split: ['$name', ' '] }, 1] },
                                    '',
                                ],
                            },
                        ],
                    },
                    email: 1,
                    contactNumber: 1,
                    image: 1,
                    status: 1,
                    isVerified: 1,
                    createdDate: '$createdAt',
                    totalOrderCount: 1,
                    totalAcceptedOrders: 1,
                    totalCancelledOrders: 1,
                    totalDeliveredOrders: 1,
                    totalAssignedOrdersCount: 1,
                    location: 1,
                    postCode: 1,
                    balance: {
                        $round: ['$balance', 2],
                    },
                    earning: {
                        $ifNull: [
                            {
                                $round: ['$earning', 2]
                            },
                            0
                        ]
                    },
                },
            },
        ]);
        console.log(result);
        if (!result || !result.length) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').deliveryManNotFound });
        }
        const data = result[0];
        return res.ok({ data });
    }
    catch (error) {
        console.error('Error fetching delivery man profile:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getDeliveryManProfile = getDeliveryManProfile;
const getDeliveryManLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const merchantId = req.params.merchantId;
        const deliveryManId = req.query.deliveryManId;
        console.log(deliveryManId);
        // Fetch only specific fields, for example: name, location, and contact
        const deliveryBoys = yield deliveryMan_schema_1.default.find({ createdByMerchant: true, merchantId, _id: deliveryManId }, { email: 1, location: 1, defaultLocation: 1, status: 1 });
        if (!deliveryBoys || deliveryBoys.length === 0) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').noDeliveryBoysFound });
        }
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').deliveryBoysFetched,
            data: deliveryBoys,
        });
    }
    catch (error) {
        console.log('🚀 ~ getDeliveryBoysForMerchant ~ error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getDeliveryManLocation = getDeliveryManLocation;
const deleteDeliveryMan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validate the ID
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.failureResponse({
                message: 'Invalid delivery man ID.',
            });
        }
        // Find and delete the delivery man by ID
        const deletedDeliveryMan = yield deliveryMan_schema_1.default.findByIdAndDelete(id);
        if (!deletedDeliveryMan) {
            return res.failureResponse({
                message: 'Delivery man not found.',
            });
        }
        // Send success response
        return res.ok({
            message: 'Delivery man deleted successfully.',
            data: deletedDeliveryMan, // Optional: Send deleted data if needed
        });
    }
    catch (error) {
        console.error('Error deleting delivery man:', error);
        return res.failureResponse({
            message: 'Something went wrong. Please try again.',
        });
    }
});
exports.deleteDeliveryMan = deleteDeliveryMan;
const updateDeliveryManProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (updateData === null || updateData === void 0 ? void 0 : updateData.image) {
            const Image = updateData.image.split(',');
            const deliveryManData = yield deliveryMan_schema_1.default.findOne({ _id: id }, { image: 1 });
            if (deliveryManData === null || deliveryManData === void 0 ? void 0 : deliveryManData.image) {
                (0, common_1.removeUploadedFile)(deliveryManData.image);
            }
            updateData.image = yield (0, common_1.uploadFile)(Image[0], Image[1], 'DELIVERYMAN-PROFILE');
        }
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
        console.error('Error updating delivery man profile:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.updateDeliveryManProfile = updateDeliveryManProfile;
const moveToTrashDeliveryMan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidDeliveryMan });
        }
        const deliveryManData = yield deliveryMan_schema_1.default.findById(id);
        if (!deliveryManData) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').deliveryManNotFound });
        }
        const trash = deliveryManData.trashed === true ? false : true;
        yield deliveryMan_schema_1.default.findByIdAndUpdate(id, { trashed: trash });
        return res.ok({
            message: trash
                ? (0, languageHelper_1.getLanguage)('en').deliveryManMoveToTrash
                : (0, languageHelper_1.getLanguage)('en').deliveryManUndoToTrash,
        });
    }
    catch (error) {
        console.log('🚀 ~ moveToTrashDeliveryMan ~ error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.moveToTrashDeliveryMan = moveToTrashDeliveryMan;
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.sendOtpValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        // Check if the user exists
        const user = yield deliveryMan_schema_1.default.findOne({ email: value.email });
        if (!user) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').emailNotRegistered });
        }
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
            customerEmail: value.email,
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
        const user = yield deliveryMan_schema_1.default.findOne({ email: value.email });
        if (!user) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').emailNotRegistered });
        }
        // Encrypt the new password
        const encryptedPassword = yield (0, common_1.encryptPassword)({
            password: value.newPassword,
        });
        // Update the user's password
        yield deliveryMan_schema_1.default.updateOne({ email: value.email }, { $set: { password: encryptedPassword } });
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
const getApproveSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(id, 'id123445');
        // Validate ID
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            return res.status(400).json({
                status: false,
                // message: "Invalid customer ID.",
                message: 'Invalid merchant ID.',
            });
        }
        // Fetch subscriptions
        const data = yield subcriptionPurchase_schema_1.default
            .find({
            //   status: "APPROVED",
            // customer: id,
            merchant: id,
        })
            .populate('subcriptionId');
        console.log(data, 'data1234');
        // Handle case with no results
        // if (!data.length) {
        //   return res.status(404).json({
        //     status: false,
        //     // message: "No approved subscriptions found for this customer.",
        //     message: 'No approved subscriptions found for this merchant.',
        //   });
        // }
        // Success response
        return res.status(200).json({
            status: true,
            data,
        });
    }
    catch (error) {
        console.error('Error in getApproveSubscription:', error.message);
        return res.status(500).json({
            status: false,
            message: 'Something went wrong while fetching subscriptions.',
        });
    }
});
exports.getApproveSubscription = getApproveSubscription;
const stripPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, planId, duration, expiryDate, merchantId } = req.body;
    console.log('Received Payment Data:', amount, planId, duration, expiryDate, merchantId);
    try {
        // Ensure amount is in the smallest currency unit (e.g., cents for USD, pennies for GBP)
        const formattedAmount = Math.round(amount * 100);
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: formattedAmount, // Amount in smallest currency unit
            currency: 'gbp', // Replace with your currency code
            payment_method_types: ['card'], // Allow card payments
            metadata: {
                planId,
                duration,
                expiryDate,
                merchantId,
            },
        });
        // if subscription plan is already expired then return error
        // Create subscription purchase record
        console.log(paymentIntent, 'paymentIntent');
        const getuserallsubcription = yield subcriptionPurchase_schema_1.default.find({
            merchant: merchantId,
        });
        // get last subcription expiry date
        const lastsubcriptionexpirydate = getuserallsubcription.reduce((latest, current) => {
            if (!latest || !latest.expiry)
                return current;
            if (!current || !current.expiry)
                return latest;
            return new Date(current.expiry) > new Date(latest.expiry)
                ? current
                : latest;
        }, null);
        console.log(lastsubcriptionexpirydate, 'lastsubcriptionexpirydate');
        // get day of lastsubcriptionexpirydate
        const subcriptiondata = yield subcription_schema_1.default.findById(planId);
        const startDate = lastsubcriptionexpirydate
            ? new Date(lastsubcriptionexpirydate.expiry) > new Date()
                ? new Date(lastsubcriptionexpirydate.expiry)
                : new Date()
            : new Date();
        //  add day of subcriptiondata to startDate
        const expiry = new Date(startDate.getTime() + subcriptiondata.seconds * 1000);
        yield subcriptionPurchase_schema_1.default.create({
            subcriptionId: planId,
            merchant: merchantId,
            // if last subcription expiry date is greater than current date then add 1 month to the expiry date
            expiry: expiry,
            status: 'APPROVED',
            startDate: startDate,
        });
        console.log('Payment Intent Created:', paymentIntent);
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    }
    catch (error) {
        console.error('Stripe Payment Error:', error);
        res.status(500).send({
            message: 'Something went wrong while processing the payment.',
        });
    }
});
exports.stripPayment = stripPayment;
