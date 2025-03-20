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
exports.deleteCustomerById = exports.updateCustomer = exports.getAllCustomer = exports.addCustomer = void 0;
const customer_schema_1 = __importDefault(require("../../models/customer.schema"));
const languageHelper_1 = require("../../language/languageHelper");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const auth_validation_1 = require("../../utils/validation/auth.validation");
const admin_schema_1 = __importDefault(require("../../models/admin.schema"));
const mongoose_1 = __importDefault(require("mongoose"));
const addCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.customerSignUpValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        console.log(value);
        const userExist = yield customer_schema_1.default.findOne({ email: value.email });
        if (userExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').emailRegisteredAlready,
            });
        }
        const datamarcent = yield admin_schema_1.default.findById(req.id);
        yield admin_schema_1.default.updateOne({ _id: req.id }, { $set: { showCustomerNumber: datamarcent.showCustomerNumber + 1 } });
        const data = yield customer_schema_1.default.create(Object.assign(Object.assign({}, value), { createdByAdmin: true, showCustomerNumber: datamarcent.showCustomerNumber, location: {
                type: 'Point',
                coordinates: [(_a = value === null || value === void 0 ? void 0 : value.location) === null || _a === void 0 ? void 0 : _a.longitude, (_b = value === null || value === void 0 ? void 0 : value.location) === null || _b === void 0 ? void 0 : _b.latitude],
            } }));
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').userRegistered, data });
    }
    catch (error) {
        console.log('🚀 ~ addCustomer ~ error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.addCustomer = addCustomer;
const getAllCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const merchantId = yield req.query.merchantId;
        if (!merchantId) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').merchantIdRequired,
            });
        }
        var query = {
            merchantId: new mongoose_1.default.Types.ObjectId(merchantId),
        };
        const data = yield customer_schema_1.default.aggregate([
            {
                $match: query,
            },
            {
                $sort: {
                    showCustomerNumber: -1,
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
                $project: {
                    _id: 1,
                    cityId: '$cityData._id',
                    city: '$city',
                    country: '$country',
                    countryName: '$countryData.countryName',
                    address: '$address',
                    firstName: { $ifNull: ['$firstName', ''] },
                    lastName: { $ifNull: ['$lastName', ''] },
                    email: '$email',
                    mobileNumber: '$mobileNumber',
                    postCode: '$postCode',
                    location: '$location',
                    NHS_Number: '$NHS_Number',
                    createdDate: '$createdAt',
                    customerId: 1,
                    merchantId: 1,
                    showCustomerNumber: '$showCustomerNumber',
                    trashed: {
                        $ifNull: ['$trashed', false],
                    },
                },
            },
        ]);
        return res.ok({ data: data === null ? [] : data });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getAllCustomer = getAllCustomer;
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.customerUpdateValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        // Validate customer existence
        const customer = yield customer_schema_1.default.findById(req.params.id);
        if (!customer) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').customerNotFound,
            });
        }
        // Check for unique email (if updating email)
        if (value.email && value.email !== customer.email) {
            const emailExists = yield customer_schema_1.default.findOne({ email: value.email });
            if (emailExists) {
                return res.badRequest({
                    message: (0, languageHelper_1.getLanguage)('en').emailRegisteredAlready,
                });
            }
        }
        // Update customer data
        Object.assign(customer, value);
        // Optional: Handle location updates
        if (value.location) {
            customer.location = {
                type: 'Point',
                coordinates: [value.location.longitude, value.location.latitude],
            };
        }
        yield customer.save();
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').customerUpdated,
            data: customer,
        });
    }
    catch (error) {
        console.error('Error updating customer:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.updateCustomer = updateCustomer;
const deleteCustomerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Extract the customer ID from the request parameters.
        // Check if the provided ID is valid.
        if (!id) {
            return res.badRequest({
                message: 'Customer ID is required.',
            });
        }
        // Attempt to find and delete the customer by ID.
        const deletedCustomer = yield customer_schema_1.default.findByIdAndDelete(id);
        if (!deletedCustomer) {
            return res.badRequest({
                message: 'Customer not found.',
            });
        }
        // Successfully deleted.
        return res.ok({
            message: 'Customer deleted successfully.',
        });
    }
    catch (error) {
        console.error('Error deleting customer:', error);
        // Handle unexpected errors.
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.deleteCustomerById = deleteCustomerById;
