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
exports.deleteCustomerById = exports.moveToTrashCustomer = exports.getCountries = exports.getCities = exports.getCustomers = exports.updateCustomer = exports.createCustomer = void 0;
const customer_schema_1 = __importDefault(require("../../models/customer.schema"));
const languageHelper_1 = require("../../language/languageHelper");
const city_schema_1 = __importDefault(require("../../models/city.schema"));
const country_schema_1 = __importDefault(require("../../models/country.schema"));
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const auth_validation_1 = require("../../utils/validation/auth.validation");
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.customerSignUpValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const userExist = yield customer_schema_1.default.findOne({ email: value.email });
        if (userExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').emailRegisteredAlready,
            });
        }
        const data = yield customer_schema_1.default.create(Object.assign({}, value));
        console.log(data);
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').userRegistered, data });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.createCustomer = createCustomer;
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
const getCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield customer_schema_1.default.aggregate([
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
                    createdDate: '$createdAt',
                    customerId: 1,
                    trashed: {
                        $ifNull: ['$trashed', false],
                    },
                },
            },
        ]);
        return res.ok({ data: data });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getCustomers = getCustomers;
const getCities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield city_schema_1.default.aggregate([
            {
                $lookup: {
                    from: 'country',
                    localField: 'countryID',
                    foreignField: '_id',
                    as: 'countryData',
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                countryName: 1,
                                currency: 1,
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
                    from: 'ProductCharges',
                    localField: '_id',
                    foreignField: 'cityId',
                    as: 'productChargeData',
                    pipeline: [
                        {
                            $match: {
                                isCustomer: false,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$productChargeData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    cityId: '$_id',
                    cityName: '$cityName',
                    countryID: 1,
                    countryName: '$countryData.countryName',
                    currency: '$countryData.currency',
                    productChargeId: '$productChargeData._id',
                    minimumDistance: '$productChargeData.minimumDistance',
                    minimumWeight: '$productChargeData.minimumWeight',
                    cancelCharge: '$productChargeData.cancelCharge',
                    perDistanceCharge: '$productChargeData.perDistanceCharge',
                    perWeightCharge: '$productChargeData.perWeightCharge',
                    adminCommission: '$productChargeData.adminCommission',
                    commissionType: '$productChargeData.commissionType',
                    createdDate: '$createdAt',
                    isActive: 1,
                },
            },
        ]);
        return res.ok({ data: data });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getCities = getCities;
const getCountries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield country_schema_1.default.aggregate([
            {
                $project: {
                    _id: 0,
                    countryId: '$_id',
                    countryName: '$countryName',
                    distanceType: 1,
                    weightType: 1,
                    createdDate: '$createdAt',
                    isActive: 1,
                },
            },
        ]);
        return res.ok({ data: data });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getCountries = getCountries;
const moveToTrashCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidcustomer });
        }
        const customerData = yield customer_schema_1.default.findById(id);
        const trash = customerData.trashed === true ? false : true;
        if (!customerData) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').customerNotFound });
        }
        yield customer_schema_1.default.findByIdAndUpdate(id, { trashed: trash });
        return res.ok({
            message: trash
                ? (0, languageHelper_1.getLanguage)('en').customerMoveToTrash
                : (0, languageHelper_1.getLanguage)('en').customerUndoToTrash,
        });
    }
    catch (error) {
        console.log('🚀 ~ deleteDeliveryMan ~ error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.moveToTrashCustomer = moveToTrashCustomer;
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
