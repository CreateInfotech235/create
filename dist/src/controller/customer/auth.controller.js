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
exports.deleteCustomerById = exports.moveToTrashCustomer = exports.getCountries = exports.getCities = exports.getCustomers = exports.updateCustomer = exports.createCustomerExal = exports.createCustomer = void 0;
const customer_schema_1 = __importDefault(require("../../models/customer.schema"));
const languageHelper_1 = require("../../language/languageHelper");
const city_schema_1 = __importDefault(require("../../models/city.schema"));
const country_schema_1 = __importDefault(require("../../models/country.schema"));
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const auth_validation_1 = require("../../utils/validation/auth.validation");
const mongoose_1 = __importDefault(require("mongoose"));
const user_schema_1 = __importDefault(require("../../models/user.schema"));
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.customerSignUpValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        // const userExist = await customerSchema.findOne({ email: value.email });
        // if (userExist) {
        //   return res.badRequest({
        //     message: getLanguage('en').emailRegisteredAlready,
        //   });
        // }
        console.log(value.email, 'value.email');
        const datamarcent = yield user_schema_1.default.findById(req.body.merchantId);
        yield user_schema_1.default.updateOne({ _id: req.body.merchantId }, { $set: { showCustomerNumber: datamarcent.showCustomerNumber + 1 } });
        console.log(value.email, 'value.email');
        console.log(datamarcent.showCustomerNumber, value, 'datamarcent.showCustomerNumber');
        if (value.NHS_Number !== undefined) {
            const isexiste = yield customer_schema_1.default.findOne({
                NHS_Number: value.NHS_Number,
                merchantId: value.merchantId,
            });
            if (isexiste) {
                return res.badRequest({
                    message: 'NHS Number already exists for this merchant',
                });
            }
        }
        const data = yield customer_schema_1.default.create(Object.assign(Object.assign({}, value), { showCustomerNumber: datamarcent.showCustomerNumber }));
        console.log(value.email, 'value.email');
        console.log(data, 'safdsdgsfdgdfhdghfgh');
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').userRegistered, data });
    }
    catch (error) {
        console.log(error, 'safdsdgsfdgdfhdghfgh');
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.createCustomer = createCustomer;
const createCustomerExal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const customers = req.body;
        if (!Array.isArray(customers)) {
            return res.badRequest({
                message: 'Request body must be an array of customers',
            });
        }
        const failed = [];
        const updated = [];
        const created = [];
        const successful = [];
        // Get merchant data
        const merchantId = (_a = customers[0]) === null || _a === void 0 ? void 0 : _a.merchantId;
        if (!merchantId) {
            return res.badRequest({
                message: 'merchantId is required',
            });
        }
        const merchantData = yield user_schema_1.default.findById(merchantId).lean();
        if (!merchantData) {
            return res.badRequest({
                message: 'Merchant not found',
            });
        }
        let currentCustomerNumber = merchantData.showCustomerNumber;
        // Get existing customers for this merchant
        const existingCustomers = yield customer_schema_1.default
            .find({
            merchantId: merchantId,
        })
            .lean();
        // Process each customer
        for (const customerData of customers) {
            try {
                // Validate customer data
                const validateRequest = (0, validateRequest_1.default)(customerData, auth_validation_1.customerSignUpValidationmul);
                if (!validateRequest.isValid) {
                    failed.push({
                        success: false,
                        data: customerData,
                        error: validateRequest.message,
                    });
                    continue;
                }
                const { value } = validateRequest;
                // Check if customer exists by NHS number
                const existingCustomer = existingCustomers.find((c) => c.NHS_Number === value.NHS_Number);
                if (existingCustomer) {
                    // Update existing customer
                    updated.push(Object.assign(Object.assign({}, existingCustomer), value));
                    successful.push(existingCustomer);
                }
                else {
                    // Create new customer
                    created.push(Object.assign(Object.assign({}, value), { showCustomerNumber: currentCustomerNumber }));
                    currentCustomerNumber++;
                }
            }
            catch (err) {
                failed.push({
                    success: false,
                    data: customerData,
                    error: err,
                });
            }
        }
        // create customer
        const createCustomer = yield customer_schema_1.default.create(created);
        console.log(createCustomer, 'createCustomer');
        // update customer
        console.log(updated, 'updated');
        for (let index = 0; index < updated.length; index++) {
            const element = updated[index];
            console.log(element, 'element');
            yield customer_schema_1.default.findByIdAndUpdate(element._id, Object.assign({}, element));
        }
        console.log(updated.length, 'updated length');
        // Update merchant's customer counter
        yield user_schema_1.default.findByIdAndUpdate(merchantId, {
            showCustomerNumber: currentCustomerNumber,
        });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').userRegistered,
            data: {
                successful: Object.assign(Object.assign({}, successful), updated),
                failed,
                totalSuccessful: successful.length + updated.length,
                totalFailed: failed.length,
            },
        });
    }
    catch (error) {
        console.error('Error creating customers:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.createCustomerExal = createCustomerExal;
// export const createCustomerExal2 = async (
//   req: RequestParams,
//   res: Response,
// ) => {
//   try {
//     const customers = req.body;
//     if (!Array.isArray(customers)) {
//       return res.badRequest({
//         message: 'Request body must be an array of customers',
//       });
//     }
//     const successful = [];
//     const failed = [];
//     // Process customers in parallel batches
//     const batchSize = 10;
//     for (let i = 0; i < customers.length; i += batchSize) {
//       const batch = customers.slice(i, i + batchSize);
//       const results = await Promise.all(
//         batch.map(async (customerData) => {
//           try {
//             const validateRequest = validateParamsWithJoi<{
//               firstName: string;
//               lastName: string;
//               customerId: string;
//               country: string;
//               city: string;
//               address: string;
//               postCode: string;
//               mobileNumber: string;
//               email: string;
//               location: {
//                 latitude: number;
//                 longitude: number;
//               };
//               merchantId: string;
//               trashed: boolean;
//               NHS_Number: string; // Added Patient_ID to the validation schema
//             }>(customerData, customerSignUpValidationmul);
//             if (!validateRequest.isValid) {
//               return {
//                 success: false,
//                 data: customerData,
//                 error: validateRequest.message,
//               };
//             }
//             const { value } = validateRequest;
//             console.log(value);
//             // Check customer existence by Patient_ID and merchant in parallel
//             const [existingCustomer, merchant] = await Promise.all([
//               customerSchema
//                 .findOne({
//                   NHS_Number: value.NHS_Number,
//                   merchantId: value.merchantId,
//                 })
//                 .lean(),
//               await merchantSchema.findById(value.merchantId).lean(),
//             ]);
//             if (existingCustomer) {
//               // Update existing customer if Patient_ID is repeated
//               console.log(existingCustomer, 'existingCustomer');
//               const updatedCustomer = await customerSchema.findByIdAndUpdate(
//                 existingCustomer._id,
//                 {
//                   ...value,
//                   showCustomerNumber: existingCustomer.showCustomerNumber,
//                 },
//                 { new: true },
//               );
//               return {
//                 success: true,
//                 data: updatedCustomer,
//               };
//             }
//             if (!merchant) {
//               return {
//                 success: false,
//                 data: customerData,
//                 error: 'Merchant not found',
//               };
//             }
//             // Update merchant count and create customer
//             const [newCustomer] = await Promise.all([
//               customerSchema.create({
//                 ...value,
//                 showCustomerNumber: merchant.showCustomerNumber,
//               }),
//               await merchantSchema.updateOne(
//                 { _id: value.merchantId },
//                 { $inc: { showCustomerNumber: 1 } },
//               ),
//             ]);
//             return {
//               success: true,
//               data: newCustomer,
//             };
//           } catch (error) {
//             return {
//               success: false,
//               data: customerData,
//               error: 'Unexpected error occurred while creating customer',
//             };
//           }
//         }),
//       );
//       // Process results
//       for (const result of results) {
//         if (result.success) {
//           successful.push(result.data);
//         } else {
//           failed.push({
//             data: result.data,
//             error: result.error,
//             attemptedAt: new Date(),
//             resolved: false,
//           });
//         }
//       }
//     }
//     return res.ok({
//       message: getLanguage('en').userRegistered,
//       data: {
//         successful,
//         failed,
//       },
//     });
//   } catch (error) {
//     console.error('Error creating customers:', error);
//     return res.failureResponse({
//       message: getLanguage('en').somethingWentWrong,
//     });
//   }
// };
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
        if (value.NHS_Number && value.NHS_Number !== customer.NHS_Number) {
            const existingCustomer = yield customer_schema_1.default.findOne({ NHS_Number: value.NHS_Number, merchantId: customer.merchantId });
            if (existingCustomer) {
                return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').NHSNumberAlreadyExists });
            }
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
        const merchantId = yield req.query.merchantId;
        // const { currentPage = 1, itemsPerPage = 10, searchQuery } = req.query;
        console.log(merchantId);
        if (merchantId === undefined) {
            console.log(merchantId, 'merchantId');
        }
        // console.log(currentPage, itemsPerPage, searchQuery);
        var query = {
            merchantId: new mongoose_1.default.Types.ObjectId(merchantId),
            // ...(searchQuery
            //   ? {
            //       $or: [
            //         { firstName: { $regex: searchQuery, $options: 'i' } },
            //         { lastName: { $regex: searchQuery, $options: 'i' } },
            //         { email: { $regex: searchQuery, $options: 'i' } },
            //         { NHS_Number: { $regex: searchQuery, $options: 'i' } },
            //         { address: { $regex: searchQuery, $options: 'i' } },
            //         { postCode: { $regex: searchQuery, $options: 'i' } },
            //         { mobileNumber: { $regex: searchQuery, $options: 'i' } },
            //         { showCustomerNumber: { $regex: searchQuery, $options: 'i' } },
            //       ],
            //     }
            //   : {}),
        };
        console.log(query, 'query');
        const data = yield customer_schema_1.default.aggregate([
            {
                $match: query,
            },
            {
                $sort: {
                    showCustomerNumber: -1, // Sort by createdAt in descending order
                },
            },
            // {
            //   $skip: currentPage * itemsPerPage,
            // },
            // {
            //   $limit: itemsPerPage,
            // },
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
        const totell = yield customer_schema_1.default.countDocuments(query);
        // console.log(data);
        return res.ok({ data: data === null ? [] : data });
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
