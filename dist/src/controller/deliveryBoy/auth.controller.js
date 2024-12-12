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
exports.moveToTrashDeliveryMan = exports.updateDeliveryManProfile = exports.deleteDeliveryMan = exports.getDeliveryManProfile = exports.updateLocation = exports.getDeliveryBoysForMerchant = exports.updateDeliveryManStatus = exports.updateDeliveryManProfileAndPassword = exports.signUp = exports.verifyPassword = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
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
const user_schema_1 = __importDefault(require("../../models/user.schema"));
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
        const userExist = yield deliveryMan_schema_1.default.findOne({ email: value.email });
        if (userExist) {
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
        const data = yield deliveryMan_schema_1.default.create(Object.assign(Object.assign({}, value), { createdByMerchant: isFromMerchantPanel, isVerified: isFromMerchantPanel ? true : false, showDeliveryManNumber: datamarcent.showDeliveryManNumber }));
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
        // Update Profile Image Logic
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
        // const allOrders = await OrderAssigneeSchema.find({ deliveryBoy: req.params.id });
        // const order = await OrderSchema.findOne({ orderId: allOrders?.order });
        const result = yield deliveryMan_schema_1.default
            .aggregate([
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
                    localField: 'allOrders.order',
                    foreignField: 'orderId',
                    as: 'orderDetails',
                },
            },
            {
                $match: {
                    'orderDetails.status': 'DELIVERED',
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
                    totalOrderCount: { $size: '$allOrders' },
                    totalAcceptedOrders: { $size: '$acceptedOrders' },
                    totalCancelledOrders: { $size: '$rejectedOrders' },
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
                    totalDeliveredOrders: { $size: '$orderDetails' },
                    location: 1,
                    postCode: 1,
                    balance: 1,
                    earning: { $ifNull: ['$earning', 0] },
                },
            },
        ])
            .catch((err) => {
            console.error('Aggregation error:', err);
            return [];
        });
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
