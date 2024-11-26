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
exports.moveToTrash = exports.deleteOrderFormMerchant = exports.getAllRecentOrdersFromMerchant = exports.getAllOrdersFromMerchant = exports.cancelOrder = exports.orderUpdate = exports.orderCreation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../../enum");
const languageHelper_1 = require("../../language/languageHelper");
const admin_schema_1 = __importDefault(require("../../models/admin.schema"));
const deliveryMan_schema_1 = __importDefault(require("../../models/deliveryMan.schema"));
const order_schema_1 = __importDefault(require("../../models/order.schema"));
const orderAssignee_schema_1 = __importDefault(require("../../models/orderAssignee.schema"));
const orderHistory_schema_1 = __importDefault(require("../../models/orderHistory.schema"));
const paymentInfo_schema_1 = __importDefault(require("../../models/paymentInfo.schema"));
const productCharges_schema_1 = __importDefault(require("../../models/productCharges.schema"));
const user_schema_1 = __importDefault(require("../../models/user.schema"));
const wallet_schema_1 = __importDefault(require("../../models/wallet.schema"));
const common_1 = require("../../utils/common");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const order_validation_1 = require("../../utils/validation/order.validation");
const orderCreation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('in order route');
        const validateRequest = (0, validateRequest_1.default)(req.body, order_validation_1.newOrderCreation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        // console.log(value.merchant, req.id.toString(), 'VAlue');
        // return;
        // const customerData = await customerSchema.findOne({ address: deliveryDetails.address });
        // if (!customerData) {
        //   return res.badRequest({ message: getLanguage('en').invalidCustomer });
        // }
        let checkLastOrder = yield order_schema_1.default
            .findOne({}, { _id: 0, orderId: 1 })
            .sort({ orderId: -1 });
        if (checkLastOrder) {
            checkLastOrder.orderId += 1;
        }
        else {
            checkLastOrder = { orderId: 1 };
        }
        value.orderId = checkLastOrder.orderId;
        // value.customer = req.id.toString();
        value.merchant = req.id.toString();
        const newOrder = yield order_schema_1.default.create(value);
        // console.log(newOrder, 'New Order');
        if (value.deliveryManId) {
            value.isCustomer = true;
            yield orderAssignee_schema_1.default.create({
                deliveryBoy: value.deliveryManId,
                // customer: req.id,
                merchant: req.id,
                order: newOrder.orderId,
                status: enum_1.ORDER_HISTORY.ACCEPTED,
            });
        }
        yield orderHistory_schema_1.default.create({
            message: 'New order has been created',
            order: newOrder.orderId,
            merchantID: newOrder.merchant,
        });
        const paymentData = {
            // customer: req.id.toString(),
            merchant: req.id.toString(),
            paymentThrough: value.paymentCollection,
            paymentCollectFrom: value.paymentOrderLocation,
            order: value.orderId,
        };
        yield paymentInfo_schema_1.default.create(paymentData);
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').orderCreatedSuccessfully,
            data: { orderId: newOrder.orderId },
        });
    }
    catch (error) {
        console.log('error', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.orderCreation = orderCreation;
const orderUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('in order update route');
        const orderId = req.params.orderId; // Get orderId from request parameters
        const updateData = req.body; // Get the fields to update from request body
        // Validate the incoming data using Joi (if needed)
        const validateRequest = (0, validateRequest_1.default)(updateData, order_validation_1.newOrderCreation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        // Check if the order exists
        const existingOrder = yield order_schema_1.default.findOne({ _id: orderId });
        if (!existingOrder) {
            return res.badRequest({ message: 'Order not found' });
        }
        console.log(existingOrder);
        // Update fields in the order
        const updatedOrder = yield order_schema_1.default.findOneAndUpdate({ _id: orderId }, { $set: value }, { new: true });
        if (!updatedOrder) {
            return res.failureResponse({
                message: 'Failed to update order',
            });
        }
        // If deliveryManId is updated, update the assignee table too
        if (value.deliveryManId) {
            yield orderAssignee_schema_1.default.updateOne({ _id: orderId }, { deliveryBoy: value.deliveryManId });
        }
        // Log the order history for this update
        // await OrderHistorySchema.create({
        //   message: 'Order has been updated',
        //   order: updatedOrder.orderId,
        // });
        return res.ok({
            message: 'Order updated successfully',
            data: { orderId: updatedOrder._id },
        });
    }
    catch (error) {
        console.log('Error in order update route', error);
        return res.failureResponse({
            message: 'Something went wrong, please try again later',
        });
    }
});
exports.orderUpdate = orderUpdate;
// export const orderCreation = async (req: RequestParams, res: Response) => {
//   try {
//     const validateRequest = validateParamsWithJoi<OrderCreateType>(
//       req.body,
//       orderCreateValidation,
//     );
//     if (!validateRequest.isValid) {
//       return res.badRequest({ message: validateRequest.message });
//     }
//     const { value } = validateRequest;
//     const countryData = await countrySchema.findById(value.country);
//     if (!countryData) {
//       return res.badRequest({ message: getLanguage('en').invalidCountry });
//     }
//     const cityData = await citySchema.findOne({
//       _id: value.city,
//       countryID: countryData?._id,
//     });
//     if (!cityData) {
//       return res.badRequest({ message: getLanguage('en').invalidCountry });
//     }
//     let checkLastOrder = await orderSchema
//       .findOne({}, { _id: 0, orderId: 1 })
//       .sort({ orderId: -1 });
//     if (checkLastOrder) {
//       checkLastOrder.orderId += 1;
//     } else {
//       checkLastOrder = { orderId: 1 } as any;
//     }
//     const productQuery: ProductChargeQueryType = {
//       cityId: cityData._id,
//       isCustomer: Boolean(value.deliveryManId),
//       pickupRequest: value.pickupDetails.pickupRequest,
//     };
//     if (value.deliveryManId) {
//       productQuery.customer = req.id.toString();
//     }
//     const [productCharges] =
//       await ProductChargesSchema.aggregate<IProductCharge>([
//         {
//           $match: productQuery,
//         },
//         {
//           $lookup: {
//             from: 'daywisefixedcharges',
//             localField: '_id',
//             foreignField: 'productChargeId',
//             as: 'charges',
//             pipeline: [
//               {
//                 $match: { dayNumber: 1 },
//               },
//             ],
//           },
//         },
//         {
//           $unwind: {
//             path: '$charges',
//             preserveNullAndEmptyArrays: true,
//           },
//         },
//       ]);
//     if (!productCharges) {
//       return res.badRequest({ message: getLanguage('en').invalidCountry });
//     }
//     const orderSettings = await adminSettingsSchema.findOne();
//     if (!value.deliveryManId && orderSettings?.orderAutoAssign) {
//       const nearestDeliveryMans = await deliveryManSchema.aggregate([
//         {
//           $geoNear: {
//             near: {
//               type: 'Point',
//               coordinates: [
//                 value.pickupDetails.location.longitude,
//                 value.pickupDetails.location.latitude,
//               ],
//             },
//             distanceField: 'distance',
//             spherical: true,
//           },
//         },
//         {
//           $limit: 1,
//         },
//       ]);
//       if (nearestDeliveryMans.length > 0) {
//         // TODO: Order auto assign
//       }
//     }
//     const Query: ExtraChargesQueryType = {
//       country: countryData._id.toString(),
//       city: cityData._id.toString(),
//       status: SWITCH.ENABLE,
//       isCustomer: false,
//     };
//     if (value.deliveryManId) {
//       Query.isCustomer = true;
//       Query.customer = req.id?.toString();
//     }
//     const data = await extraChargesSchema.aggregate<ExtraChargesType>([
//       {
//         $match: Query,
//       },
//       {
//         $group: {
//           _id: { chargeType: '$chargeType', cashOnDelivery: '$cashOnDelivery' },
//           totalCharge: {
//             $sum: '$charge',
//           },
//           charges: {
//             $addToSet: {
//               title: '$title',
//               charge: '$charge',
//               chargeId: '$_id',
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           '_id.cashOnDelivery': value.cashOnDelivery
//             ? { $in: [true, false] }
//             : false,
//         },
//       },
//     ]);
//     let charges: ChargeHistoryType[] = [
//       {
//         title: `delivery charge  courier type: ${value.pickupDetails.pickupRequest}`,
//         charge: productCharges.charges.charge,
//       },
//     ];
//     let totalFinalCharge = data.reduce((acc, curr) => {
//       const fixedChargeCondition = curr._id.chargeType === CHARGE_TYPE.FIXED;
//       charges = charges.concat(curr.charges as unknown as ChargeHistoryType[]);
//       if (fixedChargeCondition) {
//         acc += curr.totalCharge;
//       } else if (!fixedChargeCondition) {
//         acc += acc * (curr.totalCharge / 100);
//       }
//       return acc;
//     }, productCharges.charges.charge);
//     value.country = countryData._id.toString();
//     value.city = cityData._id.toString();
//     value.pickupDetails.location = {
//       type: 'Point',
//       coordinates: [
//         value.pickupDetails.location.longitude,
//         value.pickupDetails.location.latitude,
//       ],
//     };
//     value.deliveryLocation = {
//       type: 'Point',
//       coordinates: [
//         value.deliveryDetails.location.longitude,
//         value.deliveryDetails.location.latitude,
//       ],
//     };
//     value.orderId = checkLastOrder.orderId;
//     value.pickupDetails.orderTimestamp = value.pickupDetails.dateTime;
//     value.deliveryDetails.orderTimestamp = value.deliveryDetails.dateTime;
//     if (
//       value.cashOnDelivery &&
//       value.paymentOrderLocation === ORDER_LOCATION.PICK_UP
//     ) {
//       value.pickupDetails.cashOnDelivery = true;
//     } else if (value.cashOnDelivery) {
//       value.deliveryDetails.cashOnDelivery = true;
//     }
//     value.customer = req.id.toString();
//     const orderData = await orderSchema.create(value);
//     let [orderDistance] = await orderSchema.aggregate([
//       {
//         $geoNear: {
//           near: {
//             type: 'Point',
//             coordinates: [
//               value.pickupDetails.location.coordinates[0],
//               value.pickupDetails.location.coordinates[1],
//             ],
//           },
//           distanceField: 'distance',
//           distanceMultiplier:
//             countryData.distanceType === DISTANCE_TYPE.KM ? 0.001 : 0.000621371,
//           spherical: true,
//         },
//       },
//       {
//         $match: {
//           _id: orderData._id,
//         },
//       },
//       {
//         $project: {
//           distance: 1,
//         },
//       },
//     ]);
//     orderDistance.distance = +orderDistance.distance.toFixed(2);
//     if (
//       productCharges?.minimumDistance &&
//       productCharges?.perDistanceCharge &&
//       orderDistance.distance >= productCharges.minimumDistance
//     ) {
//       let charge =
//         (orderDistance.distance - productCharges.minimumDistance) *
//         productCharges.perDistanceCharge;
//       charges.push({ title: 'per distance charge', charge });
//       totalFinalCharge += charge;
//     }
//     if (
//       productCharges?.minimumWeight &&
//       productCharges?.perWeightCharge &&
//       value.weight >= productCharges.minimumWeight
//     ) {
//       let charge =
//         (value.weight - productCharges.minimumWeight) *
//         productCharges.perWeightCharge;
//       charges.push({ title: 'per weight charge', charge });
//       totalFinalCharge += charge;
//     }
//     await orderSchema.updateOne(
//       { orderId: orderData.orderId },
//       {
//         $set: {
//           distance: orderDistance.distance,
//           totalCharge: totalFinalCharge,
//           charges,
//         },
//       },
//     );
//     if (value.deliveryManId) {
//       value.isCustomer = true;
//       await OrderAssigneeSchema.create({
//         deliveryBoy: value.deliveryManId,
//         customer: req.id,
//         order: orderData.orderId,
//         status: ORDER_HISTORY.ACCEPTED,
//       });
//     }
//     const [pickupPostCode, deliveryPostCode] = await Promise.all([
//       PostCodeSchema.findOne({ postCode: value.pickupDetails.postCode }),
//       PostCodeSchema.findOne({ postCode: value.deliveryDetails.postCode }),
//     ]);
//     const arr = [];
//     if (!pickupPostCode) {
//       arr.push({ postCode: value.pickupDetails.postCode });
//     }
//     if (!deliveryPostCode) {
//       arr.push({ postCode: value.deliveryDetails.postCode });
//     }
//     if (arr.length > 0) {
//       await PostCodeSchema.insertMany(arr);
//     }
//     await OrderHistorySchema.create({
//       message: 'New order has been created',
//       order: orderData.orderId,
//     });
//     const paymentData: PaymentInfoType = {
//       customer: req.id.toString(),
//       paymentThrough: value.paymentCollection,
//       paymentCollectFrom: value.paymentOrderLocation,
//       order: value.orderId,
//     };
//     await PaymentInfoSchema.create(paymentData);
//     return res.ok({
//       message: getLanguage('en').orderCreatedSuccessfully,
//       data: { orderId: orderData.orderId, totalFinalCharge, charges },
//     });
//   } catch (error) {
//     return res.failureResponse({
//       message: getLanguage('en').somethingWentWrong,
//     });
//   }
// };
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, order_validation_1.orderCancelValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const isCreated = yield order_schema_1.default.findOne({
            orderId: value.orderId,
            status: { $ne: enum_1.ORDER_HISTORY.DELIVERED },
        });
        if (!isCreated) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidOrder });
        }
        const admin = yield admin_schema_1.default.findOne();
        const paymentInfo = yield paymentInfo_schema_1.default.findOne({ order: value.orderId }, { _id: 0, paymentThrough: 1 });
        const data = yield productCharges_schema_1.default.findById({
            city: isCreated.city,
            pickupRequest: isCreated.pickupDetails.request,
            isCustomer: isCreated.isCustomer,
        }, { _id: 0, cancelCharge: 1 });
        const isAssigned = isCreated.status !== enum_1.ORDER_HISTORY.CREATED;
        const $set = {
            status: enum_1.ORDER_HISTORY.CANCELLED,
            reason: value.reason,
        };
        const message = `Order ${value.orderId} Cancelled Refund`;
        if (isAssigned) {
            $set.totalCharge = data.cancelCharge;
            if (paymentInfo.paymentThrough === enum_1.PAYMENT_TYPE.CASH &&
                paymentInfo.status === enum_1.PAYMENT_INFO.SUCCESS) {
                const deliveryMan = yield orderAssignee_schema_1.default.findOne({
                    order: value.orderId,
                });
                const userAmountAfterCharge = isCreated.totalCharge - data.cancelCharge;
                const userData = yield user_schema_1.default.findOneAndUpdate({ _id: req.id }, { $inc: { balance: userAmountAfterCharge } }, { new: true });
                const deliveryManData = yield deliveryMan_schema_1.default.findOneAndUpdate({ _id: deliveryMan._id }, { $inc: { balance: -isCreated.totalCharge } }, { new: true });
                yield Promise.all([
                    wallet_schema_1.default.insertMany([
                        {
                            personId: deliveryMan._id,
                            message,
                            type: enum_1.TRANSACTION_TYPE.WITHDRAW,
                            user: enum_1.PERSON_TYPE.DELIVERY_BOY,
                            availableBalance: deliveryManData.balance,
                            amount: isCreated.totalCharge,
                        },
                        {
                            personId: req.id,
                            message: `Order ${value.orderId} Cancelled Refund After Cancel Charge`,
                            type: enum_1.TRANSACTION_TYPE.DEPOSIT,
                            user: enum_1.PERSON_TYPE.CUSTOMER,
                            availableBalance: userData.balance,
                            amount: userAmountAfterCharge,
                        },
                    ]),
                    admin_schema_1.default.updateOne({ _id: admin._id }, { $inc: { balance: data.cancelCharge } }),
                ]);
            }
            else if (paymentInfo.paymentThrough !== enum_1.PAYMENT_TYPE.ONLINE) {
                yield (0, common_1.updateWallet)(data.cancelCharge, admin._id.toString(), req.id.toString(), enum_1.TRANSACTION_TYPE.WITHDRAW, `Order ${value.orderId} Cancelled`);
            }
            else {
                const amtAfterCharge = isCreated.totalCharge - data.cancelCharge;
                yield Promise.all([
                    (0, common_1.updateWallet)(amtAfterCharge, admin._id.toString(), req.id.toString(), enum_1.TRANSACTION_TYPE.DEPOSIT, message),
                    admin_schema_1.default.updateOne({ _id: admin._id }, { $inc: { balance: -amtAfterCharge } }),
                ]);
            }
        }
        else if (paymentInfo.paymentThrough === enum_1.PAYMENT_TYPE.ONLINE) {
            yield (0, common_1.updateWallet)(isCreated.totalCharge, admin._id.toString(), req.id.toString(), enum_1.TRANSACTION_TYPE.DEPOSIT, message);
        }
        yield Promise.all([
            order_schema_1.default.updateOne({ orderId: value.orderId }, {
                $set,
            }),
            orderHistory_schema_1.default.create({
                message: `Your order ${value.orderId} has been cancelled`,
                order: value.orderId,
                status: enum_1.ORDER_HISTORY.CANCELLED,
                merchantID: isCreated.merchant,
            }),
        ]);
        return res.badRequest({
            message: (0, languageHelper_1.getLanguage)('en').orderUpdatedSuccessfully,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.cancelOrder = cancelOrder;
const getAllOrdersFromMerchant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query; // Get startDate and endDate from query params
        // Initialize dateFilter object
        let dateFilter = {};
        // If startDate and endDate are provided, convert them to Date objects with time set to the start and end of the day
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            // Adjust start and end dates to include the full day (UTC time)
            start.setUTCHours(0, 0, 0, 0); // Set startDate to 00:00:00 UTC
            end.setUTCHours(23, 59, 59, 999); // Set endDate to 23:59:59 UTC
            // Add date range filter
            dateFilter = {
                dateTime: {
                    $gte: start, // Greater than or equal to start date
                    $lte: end, // Less than or equal to end date
                },
            };
        }
        const data = yield order_schema_1.default.aggregate([
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $match: Object.assign({ 
                    // customer: new mongoose.Types.ObjectId(req.params.id),
                    merchant: new mongoose_1.default.Types.ObjectId(req.params.id) }, dateFilter),
            },
            {
                $lookup: {
                    from: 'orderAssign',
                    localField: 'orderId',
                    foreignField: 'order',
                    as: 'orderAssignData',
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                deliveryBoy: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$orderAssignData',
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
                $lookup: {
                    from: 'deliveryMan',
                    localField: 'orderAssignData.deliveryBoy',
                    foreignField: '_id',
                    as: 'deliveryManData',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                firstName: 1,
                                lastName: 1,
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
                    _id: 1,
                    orderId: 1,
                    customerName: '$deliveryDetails.name',
                    pickupAddress: '$pickupDetails',
                    deliveryAddress: '$deliveryDetails',
                    deliveryMan: {
                        $concat: [
                            '$deliveryManData.firstName',
                            ' ',
                            '$deliveryManData.lastName',
                        ],
                    },
                    deliveryManId: '$deliveryManData._id',
                    pickupDate: {
                        $dateToString: {
                            format: '%d-%m-%Y , %H:%M',
                            date: '$pickupDetails.dateTime',
                        },
                    },
                    merchantId: '$pickupDetails.merchantId',
                    deliveryDate: {
                        $dateToString: {
                            format: '%d-%m-%Y , %H:%M',
                            date: '$deliveryDetails.orderTimestamp',
                        },
                    },
                    createdDate: {
                        $dateToString: {
                            format: '%d-%m-%Y , %H:%M',
                            date: '$createdAt',
                        },
                    },
                    pickupRequest: '$pickupDetails.request',
                    postCode: '$pickupDetails.postCode',
                    cashOnDelivery: 1,
                    status: 1,
                    dateTime: 1,
                    trashed: {
                        $ifNull: ['$trashed', false],
                    },
                    paymentCollectionRupees: 1,
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
exports.getAllOrdersFromMerchant = getAllOrdersFromMerchant;
const getAllRecentOrdersFromMerchant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query; // Get startDate and endDate from query params
        // Initialize dateFilter object
        let dateFilter = {};
        // If startDate and endDate are provided, convert them to Date objects with time set to the start and end of the day
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            // Adjust start and end dates to include the full day (UTC time)
            start.setUTCHours(0, 0, 0, 0); // Set startDate to 00:00:00 UTC
            end.setUTCHours(23, 59, 59, 999); // Set endDate to 23:59:59 UTC
            // Add date range filter
            dateFilter = {
                dateTime: {
                    $gte: start, // Greater than or equal to start date
                    $lte: end, // Less than or equal to end date
                },
            };
        }
        const data = yield order_schema_1.default.aggregate([
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $limit: 10, // Limit the results to the last 10 orders
            },
            {
                $match: Object.assign({ 
                    // customer: new mongoose.Types.ObjectId(req.params.id),
                    merchant: new mongoose_1.default.Types.ObjectId(req.params.id) }, dateFilter),
            },
            {
                $lookup: {
                    from: 'orderAssign',
                    localField: 'orderId',
                    foreignField: 'order',
                    as: 'orderAssignData',
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                deliveryBoy: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$orderAssignData',
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
                $lookup: {
                    from: 'deliveryMan',
                    localField: 'orderAssignData.deliveryBoy',
                    foreignField: '_id',
                    as: 'deliveryManData',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                firstName: 1,
                                lastName: 1,
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
                    _id: 1,
                    orderId: 1,
                    customerName: '$deliveryDetails.name',
                    pickupAddress: '$pickupDetails',
                    deliveryAddress: '$deliveryDetails',
                    deliveryMan: {
                        $concat: [
                            '$deliveryManData.firstName',
                            ' ',
                            '$deliveryManData.lastName',
                        ],
                    },
                    deliveryManId: '$deliveryManData._id',
                    pickupDate: {
                        $dateToString: {
                            format: '%d-%m-%Y , %H:%M',
                            date: '$pickupDetails.dateTime',
                        },
                    },
                    merchantId: '$pickupDetails.merchantId',
                    deliveryDate: {
                        $dateToString: {
                            format: '%d-%m-%Y , %H:%M',
                            date: '$deliveryDetails.orderTimestamp',
                        },
                    },
                    createdDate: {
                        $dateToString: {
                            format: '%d-%m-%Y , %H:%M',
                            date: '$createdAt',
                        },
                    },
                    pickupRequest: '$pickupDetails.request',
                    postCode: '$pickupDetails.postCode',
                    cashOnDelivery: 1,
                    status: 1,
                    dateTime: 1,
                    trashed: {
                        $ifNull: ['$trashed', false],
                    },
                    paymentCollectionRupees: 1,
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
exports.getAllRecentOrdersFromMerchant = getAllRecentOrdersFromMerchant;
const deleteOrderFormMerchant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidOrder });
        }
        const OrderData = yield order_schema_1.default.findById(id);
        if (!OrderData) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').orderNotFound });
        }
        yield order_schema_1.default.findByIdAndDelete(id);
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').orderDeleted });
    }
    catch (error) {
        console.log('🚀 ~ deleteDeliveryMan ~ error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.deleteOrderFormMerchant = deleteOrderFormMerchant;
const moveToTrash = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidOrder });
        }
        const OrderData = yield order_schema_1.default.findById(id);
        const trash = OrderData.trashed === true ? false : true;
        if (!OrderData) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').orderNotFound });
        }
        yield order_schema_1.default.findByIdAndUpdate(id, { trashed: trash });
        return res.ok({
            message: trash
                ? (0, languageHelper_1.getLanguage)('en').orderMoveToTrash
                : (0, languageHelper_1.getLanguage)('en').orderUndoToTrash,
        });
    }
    catch (error) {
        console.log('🚀 ~ deleteDeliveryMan ~ error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.moveToTrash = moveToTrash;
// export const getAllOrdersFromMerchantt = async (req: RequestParams, res: Response) => {
//   try {
//     const all = await orderSchema.find().countDocuments()
//     res.status(200).json({
//       data : all
//     })
//   } catch (error) {
//     return res.failureResponse({
//       message: getLanguage('en').somethingWentWrong,
//     });
//   }
// }
