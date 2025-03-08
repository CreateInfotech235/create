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
exports.logoutdeliveryboy = exports.getSubOrderData = exports.getMultiOrderById = exports.getMultiOrder = exports.getPaymentDataForDeliveryBoy = exports.getAllCancelledOrdersMulti = exports.getAllCancelledOrders = exports.getOrderById = exports.allPaymentInfo = exports.OrderAssigneeSchemaData = exports.deliverOrderMulti = exports.deliverOrder = exports.sendEmailOrMobileOtpMultiForDelivery = exports.sendEmailOrMobileOtpMulti = exports.sendEmailOrMobileOtp = exports.pickUpOrderMulti = exports.pickUpOrder = exports.departOrderMulti = exports.departOrder = exports.cancelMultiSubOrder = exports.cancelMultiOrder = exports.cancelOrder = exports.arriveOrderMulti = exports.arriveOrder = exports.acceptOrder = exports.getOederForDeliveryMan = exports.getAssignedOrdersMulti = exports.getAssignedOrders = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../../enum");
const languageHelper_1 = require("../../language/languageHelper");
const admin_schema_1 = __importDefault(require("../../models/admin.schema"));
const city_schema_1 = __importDefault(require("../../models/city.schema"));
const orderMulti_schema_1 = __importDefault(require("../../models/orderMulti.schema"));
const deliveryMan_schema_1 = __importDefault(require("../../models/deliveryMan.schema"));
const order_schema_1 = __importDefault(require("../../models/order.schema"));
const orderAssignee_schema_1 = __importDefault(require("../../models/orderAssignee.schema"));
const orderAssigneeMulti_schema_1 = __importDefault(require("../../models/orderAssigneeMulti.schema"));
const orderHistory_schema_1 = __importDefault(require("../../models/orderHistory.schema"));
const otp_schema_1 = __importDefault(require("../../models/otp.schema"));
const paymentInfo_schema_1 = __importDefault(require("../../models/paymentInfo.schema"));
const productCharges_schema_1 = __importDefault(require("../../models/productCharges.schema"));
const cancelOderbyDeliveryManSchema_1 = __importDefault(require("../../models/cancelOderbyDeliveryManSchema"));
const getimgurl_1 = require("../getimgurl/getimgurl");
const parcel_schema_1 = __importDefault(require("../../models/parcel.schema"));
const common_1 = require("../../utils/common");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const order_validation_1 = require("../../utils/validation/order.validation");
const billing_Schema_1 = __importDefault(require("../../models/billing.Schema"));
const paymentGet_schema_1 = __importDefault(require("../../models/paymentGet.schema"));
const axios_1 = __importDefault(require("axios"));
const getAssignedOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const validateRequest = (0, validateRequest_1.default)(req.query, order_validation_1.orderListByDeliveryManValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const query = {
            deliveryBoy: new mongoose_1.default.Types.ObjectId(req.id),
            // .toString(),
        };
        // If 'status' is provided, add it to the query, otherwise don't filter by status
        if (value.status) {
            query.status = value.status;
        }
        if (value.startDate && value.endDate) {
            const startDate = new Date(value.startDate);
            const endDate = new Date(value.endDate);
            endDate.setHours(23, 59, 59, 999);
            query.createdAt = {
                $gte: startDate,
                $lte: endDate,
            };
        }
        console.log('Constructed Query: ', query);
        const pageLimit = value.pageLimit || 10; // default to 10 if not provided
        const pageCount = value.pageCount || 1; // default to 1 if not provided
        const skip = (pageCount - 1) * pageLimit; // Calculate the number of documents to skip
        // console.log(req.id, 'req.id');
        // const demo = await OrderHistorySchema.find({
        //   status: ORDER_HISTORY.ARRIVED,
        //   deliveryBoy: req.id.toString() // Convert to string to match schema type
        // });
        // console.log(demo, 'demo');
        // Aggregation pipeline with pagination
        const data1 = yield orderAssignee_schema_1.default.aggregate([
            {
                $match: query,
            },
            {
                $lookup: {
                    from: 'orders',
                    localField: 'order',
                    foreignField: 'orderId',
                    as: 'orderData',
                },
            },
            {
                $unwind: {
                    path: '$orderData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'deliveryMan',
                    localField: 'deliveryBoy',
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
                    // order: '$orderData',
                    deliveryBoy: 1,
                    status: 1,
                    createdAt: 1,
                    order: {
                        orderId: '$orderData.orderId',
                        _id: '$orderData._id',
                        showOrderNumber: '$orderData.showOrderNumber',
                        parcelsCount: '$orderData.parcelsCount',
                        customerName: '$orderData.deliveryDetails.name',
                        cutomerEmail: '$orderData.deliveryDetails.email',
                        pickupDetails: '$orderData.pickupDetails',
                        deliveryDetails: '$orderData.deliveryDetails',
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
                                date: '$orderData.pickupDetails.dateTime',
                            },
                        },
                        deliveryDate: {
                            $dateToString: {
                                format: '%d-%m-%Y , %H:%M',
                                date: '$orderData.deliveryDetails.orderTimestamp',
                            },
                        },
                        createdDate: {
                            $dateToString: {
                                format: '%d-%m-%Y , %H:%M',
                                date: '$orderData.createdAt',
                            },
                        },
                        pickupRequest: '$orderData.pickupDetails.request',
                        postCode: '$orderData.pickupDetails.postCode',
                        cashOnDelivery: '$orderData.cashOnDelivery',
                        status: '$orderData.status',
                        dateTime: '$orderData.dateTime',
                        trashed: {
                            $ifNull: ['$orderData.trashed', false],
                        },
                        distance: '$orderData.distance',
                        duration: '$orderData.duration',
                        paymentCollectionRupees: '$orderData.paymentCollectionRupees',
                    },
                },
            },
            {
                $sort: {
                    'order.distance': 1,
                    createdAt: -1,
                },
            },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: pageLimit }],
                    totalCount: [{ $count: 'count' }],
                },
            },
        ]);
        const data = {
            data: data1[0].data,
            totalCount: ((_a = data1[0].totalCount[0]) === null || _a === void 0 ? void 0 : _a.count) || 0,
        };
        // Calculate total count for pagination
        const totalCount = yield orderAssignee_schema_1.default.countDocuments(query);
        // Calculate total pages
        const totalPages = Math.ceil(totalCount / pageLimit);
        return res.ok({
            data,
        });
    }
    catch (error) {
        // Handle errors and send failure response
        console.error('Error occurred: ', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getAssignedOrders = getAssignedOrders;
const getAssignedOrdersMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.query, order_validation_1.orderListByDeliveryManValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const query = {
            deliveryBoy: new mongoose_1.default.Types.ObjectId(req.id),
        };
        if (value.status) {
            query.status = value.status;
        }
        if (value.startDate && value.endDate) {
            const startDate = new Date(value.startDate);
            const endDate = new Date(value.endDate);
            endDate.setHours(23, 59, 59, 999);
            query.createdAt = { $gte: startDate, $lte: endDate };
        }
        const pageLimit = value.pageLimit || 10;
        const pageCount = value.pageCount || 1;
        const skip = (pageCount - 1) * pageLimit;
        const pipeline = [
            { $match: query },
            {
                $lookup: {
                    from: 'orderMultis',
                    localField: 'order',
                    foreignField: 'orderId',
                    as: 'orderData',
                },
            },
            // { $unwind: { path: '$orderData', preserveNullAndEmptyArrays: true } },
            // {
            //   $sort: {
            //     'orderData.distance': 1,
            //   },
            // },
            // {
            //   $lookup: {
            //     from: 'deliveryMan',
            //     localField: 'deliveryBoy',
            //     foreignField: '_id',
            //     as: 'deliveryManData',
            //     pipeline: [{ $project: { _id: 1, firstName: 1, lastName: 1 } }],
            //   },
            // },
            // {
            //   $unwind: { path: '$deliveryManData', preserveNullAndEmptyArrays: true },
            // },
            // {
            //   $project: {
            //     _id: 1,
            //     deliveryBoy: 1,
            //     status: 1,
            //     createdAt: 1,
            //     order: {
            //       orderId: '$orderData.orderId',
            //       _id: '$orderData._id',
            //       showOrderNumber: '$orderData.showOrderNumber',
            //       parcelsCount: '$orderData.parcelsCount',
            //       customerName: '$orderData.deliveryDetails.name',
            //       customerEmail: '$orderData.deliveryDetails.email',
            //       pickupDetails: '$orderData.pickupDetails',
            //       deliveryDetails: '$orderData.deliveryDetails',
            //       deliveryMan: {
            //         $concat: [
            //           '$deliveryManData.firstName',
            //           ' ',
            //           '$deliveryManData.lastName',
            //         ],
            //       },
            //       deliveryManId: '$deliveryManData._id',
            //       pickupDate: {
            //         $dateToString: {
            //           format: '%d-%m-%Y , %H:%M',
            //           date: '$orderData.pickupDetails.dateTime',
            //         },
            //       },
            //       deliveryDate: {
            //         $dateToString: {
            //           format: '%d-%m-%Y , %H:%M',
            //           date: '$orderData.deliveryDetails.orderTimestamp',
            //         },
            //       },
            //       createdDate: {
            //         $dateToString: {
            //           format: '%d-%m-%Y , %H:%M',
            //           date: '$orderData.createdAt',
            //         },
            //       },
            //       pickupRequest: '$orderData.pickupDetails.request',
            //       postCode: '$orderData.pickupDetails.postCode',
            //       cashOnDelivery: '$orderData.cashOnDelivery',
            //       status: '$orderData.status',
            //       dateTime: '$orderData.dateTime',
            //       trashed: { $ifNull: ['$orderData.trashed', false] },
            //       distance: '$orderData.distance',
            //       duration: '$orderData.duration',
            //       paymentCollectionRupees: '$orderData.paymentCollectionRupees',
            //     },
            //   },
            // },
            // { $sort: { 'order.distance': 1, createdAt: -1 } },
            // {
            //   $facet: {
            //     data: [{ $skip: skip }, { $limit: pageLimit }],
            //     totalCount: [{ $count: 'count' }],
            //   },
            // },
        ];
        const result = yield orderAssigneeMulti_schema_1.default.find({
            deliveryBoy: new mongoose_1.default.Types.ObjectId(req.id),
        });
        // console.log(result, 'result');
        // const data = {
        //   data: result[0]?.data || [],
        //   totalCount: result[0]?.totalCount[0]?.count || 0,
        // };
        const data = yield orderAssigneeMulti_schema_1.default.aggregate(pipeline);
        console.log(data, 'data');
        return res.ok({ data });
    }
    catch (error) {
        console.error('Error occurred: ', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getAssignedOrdersMulti = getAssignedOrdersMulti;
const getOederForDeliveryMan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { startDate, endDate, status, pageCount = 1, pageLimit = 10, } = req.query; // Add pageCount and pageLimit params
        // Calculate pagination values
        const pageNumber = parseInt(pageCount);
        const pageLimitt = parseInt(pageLimit);
        const skip = (pageNumber - 1) * pageLimitt;
        // Initialize dateFilter object
        let dateFilter = {};
        console.log(req.id, 'req.id');
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            // Adjust start and end dates to include the full day (UTC time)
            start.setUTCHours(0, 0, 0, 0); // Set startDate to 00:00:00 UTC
            end.setUTCHours(23, 59, 59, 999); // Set endDate to 23:59:59 UTC
            // Add date range filter
            dateFilter = {
                'order.dateTime': {
                    $gte: start, // Greater than or equal to start date
                    $lte: end, // Less than or equal to end date
                },
            };
        }
        console.log(dateFilter, 'dateFilter');
        // Initialize status filter
        let statusFilter = {};
        if (status) {
            statusFilter = { status };
        }
        // Build match condition for count
        const matchCondition = Object.assign(Object.assign({ 'order.deliveryManId': new mongoose_1.default.Types.ObjectId(req.id) }, statusFilter), dateFilter);
        console.log(matchCondition);
        const data1 = yield order_schema_1.default.aggregate([
            {
                $sort: {
                    distance: 1,
                    createdAt: -1,
                },
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
                    deliveryBoy: '$deliveryManData._id',
                    status: 1,
                    createdAt: 1,
                    showDeliveryManNumber: 1,
                    order: {
                        orderId: '$orderId',
                        _id: '$_id',
                        showOrderNumber: '$showOrderNumber',
                        parcelsCount: '$parcelsCount',
                        customerName: '$deliveryDetails.name',
                        cutomerEmail: '$deliveryDetails.email',
                        pickupDetails: '$pickupDetails',
                        deliveryDetails: '$deliveryDetails',
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
                        cashOnDelivery: '$cashOnDelivery',
                        status: '$status',
                        dateTime: '$dateTime',
                        trashed: {
                            $ifNull: ['$trashed', false],
                        },
                        distance: '$distance',
                        duration: '$duration',
                        paymentCollectionRupees: '$paymentCollectionRupees',
                    },
                },
            },
            {
                $match: Object.assign({}, matchCondition),
            },
            {
                $match: {
                    status: { $ne: 'UNASSIGNED' },
                },
            },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: pageLimitt }],
                    totalCount: [{ $count: 'count' }],
                },
            },
        ]);
        const data = {
            data: data1[0].data,
            totalCount: ((_b = data1[0].totalCount[0]) === null || _b === void 0 ? void 0 : _b.count) || 0,
        };
        // Get total count for pagination
        const totalCount = yield order_schema_1.default.countDocuments(matchCondition);
        const totalPages = Math.ceil(totalCount / pageLimitt);
        return res.ok({
            data,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getOederForDeliveryMan = getOederForDeliveryMan;
const acceptOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, order_validation_1.orderAcceptValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        value.deliveryManId = req.id.toString();
        const isCreated = yield order_schema_1.default.findOne({
            orderId: value.orderId,
            status: {
                $in: [
                    enum_1.ORDER_HISTORY.CREATED,
                    enum_1.ORDER_HISTORY.ASSIGNED,
                    enum_1.ORDER_HISTORY.UNASSIGNED,
                ],
            },
        });
        console.log(isCreated, 'isCreated');
        if (!isCreated) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidOrder });
        }
        const isAssigned = yield orderAssignee_schema_1.default.findOne({
            order: value.orderId,
            deliveryBoy: value.deliveryManId,
        });
        if (!isAssigned) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').orderAlreadyAssigned,
            });
        }
        yield orderAssignee_schema_1.default.findByIdAndUpdate(isAssigned._id, {
            $set: { status: value.status },
        });
        yield paymentGet_schema_1.default.findOneAndUpdate({ orderId: value.orderId }, { $set: { statusOfOrder: 'ACCEPTED' } });
        if (value.status === enum_1.ORDER_REQUEST.ACCEPTED) {
            yield order_schema_1.default.findOneAndUpdate({ orderId: value.orderId }, {
                $set: {
                    status: enum_1.ORDER_HISTORY.ASSIGNED,
                },
            });
            const data = yield deliveryMan_schema_1.default.findById(value.deliveryManId, {
                _id: 0,
                name: 1,
            });
            yield orderHistory_schema_1.default.create({
                message: `Your order ${value.orderId} has been assigned to ${data.firstName}`,
                order: value.orderId,
                status: enum_1.ORDER_HISTORY.ASSIGNED,
                merchantID: isCreated.merchant,
                deliveryBoy: value.deliveryManId,
            });
        }
        // await createNotification({
        //   userId: isCreated.merchant,
        //   orderId: isCreated.orderId,
        //   title: 'Order Accepted',
        //   message: `Your order ${isCreated.orderId} has been accepted`,
        //   type: 'MERCHANT',
        // });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').orderUpdatedSuccessfully,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.acceptOrder = acceptOrder;
const arriveOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, order_validation_1.orderArriveValidation);
        // TODO: get distance from google map api
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        value.deliveryManId = req.id.toString();
        const isCreated = yield order_schema_1.default.findOne({
            orderId: value.orderId,
            status: { $eq: enum_1.ORDER_HISTORY.ASSIGNED },
        });
        if (!isCreated) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidOrder });
        }
        const isAssigned = yield orderAssignee_schema_1.default.findOne({
            order: value.orderId,
            deliveryBoy: value.deliveryManId,
        });
        if (!isAssigned) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').invalidDeliveryMan,
            });
        }
        // TODO: add distance to the order
        yield paymentGet_schema_1.default.findOneAndUpdate({ orderId: value.orderId }, { $set: { statusOfOrder: 'ARRIVED' } });
        yield order_schema_1.default.findOneAndUpdate({ orderId: value.orderId }, {
            $set: {
                status: enum_1.ORDER_HISTORY.ARRIVED,
                time: {
                    start: Date.now(),
                },
            },
        });
        yield orderHistory_schema_1.default.create({
            message: `Your order ${value.orderId} has been arrived`,
            order: value.orderId,
            status: enum_1.ORDER_HISTORY.ARRIVED,
            merchantID: isCreated.merchant,
            deliveryBoy: value.deliveryManId,
        });
        yield orderHistory_schema_1.default.deleteOne({
            order: value.orderId,
            status: enum_1.ORDER_HISTORY.ASSIGNED,
        });
        // await createNotification({
        //   userId: isCreated.merchant,
        //   orderId: isCreated.orderId,
        //   title: 'Order Arrived',
        //   message: `Your order ${isCreated.orderId} has been arrived`,
        //   type: 'MERCHANT',
        // });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').orderUpdatedSuccessfully,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.arriveOrder = arriveOrder;
const arriveOrderMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, order_validation_1.orderArriveValidationMulti);
        // TODO: get distance from google map api
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        console.log(value);
        value.deliveryManId = req.id.toString();
        const isCreated = yield orderMulti_schema_1.default.findOne({
            orderId: value.orderId,
        });
        console.log(isCreated, 'isCreated');
        if (!isCreated) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidOrder });
        }
        const isAssigned = yield orderAssigneeMulti_schema_1.default.findOne({
            order: value.orderId,
            deliveryBoy: value.deliveryManId,
        });
        if (!isAssigned) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').invalidDeliveryMan,
            });
        }
        if (isCreated.deliveryDetails.some((item) => item.status === enum_1.ORDER_HISTORY.ARRIVED)) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').orderAlreadyArrived });
        }
        // TODO: add distance to the order
        console.log('fgsdfsdfsdhiffh 1');
        yield paymentGet_schema_1.default.findOneAndUpdate({ orderId: value.orderId }, { $set: { statusOfOrder: 'ARRIVED' } });
        const orderData = yield orderMulti_schema_1.default.findOneAndUpdate({
            orderId: value.orderId, // Match the document by `orderId`
        }, {
            $set: {
                status: enum_1.ORDER_HISTORY.ARRIVED,
                'deliveryDetails.$[elem].status': enum_1.ORDER_HISTORY.ARRIVED, // Update all elements to ARRIVED
            },
        }, {
            arrayFilters: [{ 'elem.status': enum_1.ORDER_HISTORY.ASSIGNED }], // Filter to only update ASSIGNED sub-orders
            new: true,
        });
        for (const item of isCreated.deliveryDetails) {
            yield orderHistory_schema_1.default.create({
                message: `Your order ${item.subOrderId} has been arrived`,
                order: value.orderId,
                showOrderId: orderData.showOrderNumber,
                subOrderId: item.subOrderId,
                status: enum_1.ORDER_HISTORY.ARRIVED,
                merchantID: isCreated.merchant,
                deliveryBoy: value.deliveryManId,
            });
        }
        console.log(isCreated, 'isCreated.deliveryDetails');
        const deliveryBoydata = yield deliveryMan_schema_1.default.findById(value.deliveryManId);
        if (isCreated.deliveryDetails && Array.isArray(isCreated.deliveryDetails)) {
            let billingData = [];
            const deliveryBoyId = value.deliveryManId;
            const merchantId = isCreated.merchant;
            const orderId = value.orderId;
            for (const item of isCreated.deliveryDetails) {
                if (item.status === enum_1.ORDER_HISTORY.ARRIVED ||
                    item.status === enum_1.ORDER_HISTORY.CANCELLED) {
                    continue;
                }
                try {
                    billingData.push({
                        showOrderId: orderData.showOrderNumber,
                        subOrderId: item.subOrderId,
                        chargeMethod: deliveryBoydata.chargeMethod,
                        amountOfPackage: item.paymentCollectionRupees,
                        orderStatus: enum_1.ORDER_HISTORY.ARRIVED,
                        pickupAddress: isCreated.pickupDetails.address,
                        deliveryAddress: item.address,
                    });
                }
                catch (error) {
                    console.log(error, 'error');
                }
            }
            const billingDataPayload = {
                deliveryBoyId: deliveryBoyId,
                showOrderId: orderData.showOrderNumber,
                merchantId: merchantId,
                orderId: orderId,
                chargeMethod: deliveryBoydata.chargeMethod,
                orderStatus: enum_1.ORDER_HISTORY.ARRIVED,
                subOrderdata: billingData,
                charge: deliveryBoydata.charge,
            };
            console.log(billingDataPayload, 'billingDataPayload');
            try {
                const billing = yield billing_Schema_1.default.create(billingDataPayload);
                console.log(billing, 'billing');
            }
            catch (error) {
                console.log(error, 'error');
            }
        }
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').orderUpdatedSuccessfully,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.arriveOrderMulti = arriveOrderMulti;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body, 'order cancel');
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, order_validation_1.orderCancelValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        value.deliveryManId = req.id.toString();
        // Check if the order exists and is not yet completed
        const existingOrder = yield order_schema_1.default.findOne({
            orderId: value.orderId,
            status: {
                $in: [
                    enum_1.ORDER_HISTORY.CREATED,
                    enum_1.ORDER_HISTORY.ASSIGNED,
                    enum_1.ORDER_HISTORY.ARRIVED,
                ],
            },
        });
        console.log(existingOrder, 'First');
        if (!existingOrder) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidOrder });
        }
        // Check if the delivery man is assigned to the order
        const isAssigned = yield orderAssignee_schema_1.default.findOne({
            order: value.orderId,
            deliveryBoy: value.deliveryManId,
        });
        console.log(isAssigned, 'Secound');
        if (!isAssigned) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').orderNotAssignedToYou,
            });
        }
        // Update the order status to canceled
        yield order_schema_1.default.findOneAndUpdate({ orderId: value.orderId }, {
            $set: {
                status: enum_1.ORDER_HISTORY.UNASSIGNED,
                time: {
                    end: Date.now(),
                },
            },
        });
        console.log('Third');
        // Update the assignee status (if needed)
        yield orderAssignee_schema_1.default.findByIdAndUpdate(isAssigned._id, {
            // $set: {
            status: enum_1.ORDER_REQUEST.REJECT,
            // deliveryBoy: '',
            // },
        });
        console.log('Four');
        const history = yield orderHistory_schema_1.default.find({
            order: value.orderId,
            status: enum_1.ORDER_HISTORY.ASSIGNED,
        });
        console.log(history, 'Fivedsjsdvsdhjfsdvfsdfjkfsdvf', existingOrder.merchant);
        yield orderHistory_schema_1.default.deleteMany({
            // message: `Order ${value.orderId} has been canceled by the delivery man`,
            order: value.orderId,
            status: enum_1.ORDER_HISTORY.ASSIGNED,
            merchantID: existingOrder.merchant,
        });
        const history1 = yield orderHistory_schema_1.default.find({
            order: value.orderId,
            status: enum_1.ORDER_HISTORY.ASSIGNED,
        });
        console.log(history1, 'Sixxxxxxxxxxxxxxxxxxxxxx');
        // Record the cancellation in the order history
        yield orderHistory_schema_1.default.create({
            message: `Order ${value.orderId} has been canceled by the delivery man.`,
            order: value.orderId,
            status: enum_1.ORDER_HISTORY.UNASSIGNED,
            merchantID: existingOrder.merchant,
            deliveryBoy: value.deliveryManId,
        });
        // TODO: send cancellation email to the customer and delivery man
        yield cancelOderbyDeliveryManSchema_1.default.create({
            deliveryBoy: value.deliveryManId,
            order: value.orderId,
        });
        yield paymentGet_schema_1.default.findOneAndUpdate({ orderId: value.orderId }, { $set: { statusOfOrder: 'CANCELLED' } });
        yield (0, common_1.sendMailService)(existingOrder.pickupDetails.email, 'Cancel Order ', 'Your order is cancelled by deliveryman plz assign order other deliveryman');
        console.log('Seaven');
        yield (0, common_1.createNotification)({
            userId: existingOrder.merchant,
            orderId: existingOrder.orderId,
            title: 'Order Cancelled',
            message: `Your order ${existingOrder.orderId} has been cancelled by deliveryman`,
            type: 'MERCHANT',
        });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').orderCancelledSuccessfully,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.cancelOrder = cancelOrder;
const cancelMultiOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, order_validation_1.orderCancelValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        console.log(value, 'value');
        value.deliveryManId = req.id.toString();
        console.log(value, 'value.orderId');
        // Check if the order exists and is not yet completed
        const existingOrder = yield orderMulti_schema_1.default.findOne({
            orderId: value.orderId,
            // 'deliveryDetails.subOrderId': value.subOrderId,
            'deliveryDetails.status': {
                $in: [
                    enum_1.ORDER_HISTORY.CREATED,
                    enum_1.ORDER_HISTORY.ASSIGNED,
                    enum_1.ORDER_HISTORY.ARRIVED,
                    enum_1.ORDER_HISTORY.PICKED_UP,
                    enum_1.ORDER_HISTORY.DEPARTED,
                ],
            },
        });
        console.log(existingOrder, 'First');
        if (!existingOrder) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidOrder });
        }
        // Check if the delivery man is assigned to the order
        const isAssigned = yield orderAssigneeMulti_schema_1.default.findOne({
            order: value.orderId,
            deliveryBoy: value.deliveryManId,
        });
        console.log(isAssigned, 'Secound');
        if (!isAssigned) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').orderNotAssignedToYou,
            });
        }
        // Update the order status to canceled
        yield orderMulti_schema_1.default.findOneAndUpdate({
            orderId: value.orderId,
            'deliveryDetails.subOrderId': value.orderId,
        }, {
            $set: {
                'deliveryDetails.$.status': enum_1.ORDER_HISTORY.UNASSIGNED,
                'deliveryDetails.$.time.end': Date.now(),
            },
        });
        console.log('Third');
        // Update the assignee status
        yield orderAssigneeMulti_schema_1.default.findByIdAndUpdate(isAssigned._id, {
            status: enum_1.ORDER_REQUEST.REJECT,
        });
        yield orderMulti_schema_1.default.findOneAndUpdate({ orderId: value.orderId }, {
            $set: {
                status: enum_1.ORDER_HISTORY.UNASSIGNED,
            },
        });
        console.log('Four');
        const history = yield orderHistory_schema_1.default.find({
            order: value.orderId,
            status: enum_1.ORDER_HISTORY.ASSIGNED,
        });
        console.log(history, 'Fivedsjsdvsdhjfsdvfsdfjkfsdvf', existingOrder.merchant);
        const history1 = yield orderHistory_schema_1.default.find({
            order: value.orderId,
            status: enum_1.ORDER_HISTORY.ASSIGNED,
        });
        console.log(history1, 'Sixxxxxxxxxxxxxxxxxxxxxx');
        // Record the cancellation in the order history
        yield orderHistory_schema_1.default.create({
            message: `Order ${value.orderId} has been canceled by the delivery man.`,
            order: value.orderId,
            status: enum_1.ORDER_HISTORY.UNASSIGNED,
            merchantID: existingOrder.merchant,
            deliveryBoy: value.deliveryManId,
        });
        yield cancelOderbyDeliveryManSchema_1.default.create({
            deliveryBoy: value.deliveryManId,
            order: value.orderId,
        });
        yield paymentGet_schema_1.default.findOneAndUpdate({ orderId: value.orderId }, { $set: { statusOfOrder: 'CANCELLED' } });
        yield (0, common_1.sendMailService)(existingOrder.pickupDetails.email, 'Cancel Order ', 'Your order is cancelled by deliveryman plz assign order other deliveryman');
        console.log('Seaven');
        yield (0, common_1.createNotification)({
            userId: existingOrder.merchant,
            orderId: existingOrder.orderId,
            title: 'Order Cancelled',
            message: `Order ${existingOrder.orderId} has been cancelled by deliveryman`,
            type: 'MERCHANT',
        });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').orderCancelledSuccessfully,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.cancelMultiOrder = cancelMultiOrder;
const cancelMultiSubOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, order_validation_1.orderCancelMultiValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        value.deliveryManId = req.id.toString();
        console.log(value, 'value');
        const dataofdeliveryboy = yield deliveryMan_schema_1.default.findOne({
            _id: value.deliveryManId,
        });
        // Check if the order exists and is not yet completed
        const existingOrder = yield orderMulti_schema_1.default.findOne({
            orderId: value.orderId,
            deliveryDetails: {
                $elemMatch: {
                    subOrderId: { $in: value.subOrderId },
                    status: {
                        $in: [
                            enum_1.ORDER_HISTORY.CREATED,
                            enum_1.ORDER_HISTORY.ASSIGNED,
                            enum_1.ORDER_HISTORY.ARRIVED,
                            enum_1.ORDER_HISTORY.PICKED_UP,
                            enum_1.ORDER_HISTORY.DEPARTED,
                        ],
                    },
                },
            },
        });
        console.log(existingOrder, 'existingOrder');
        if (!existingOrder) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidOrder });
        }
        // console.log(existingOrder, 'First');
        const isAssigned = yield orderAssigneeMulti_schema_1.default.findOne({
            order: value.orderId,
            deliveryBoy: value.deliveryManId,
        });
        console.log(isAssigned, 'Secound');
        if (!isAssigned) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').orderNotAssignedToYou,
            });
        }
        const nowdata = existingOrder;
        // console.log(value.subOrderId, 'value');
        for (const item of nowdata.deliveryDetails) {
            if (Array.isArray(value.subOrderId) &&
                value.subOrderId.includes(item.subOrderId)) {
                if (item.status !== enum_1.ORDER_HISTORY.CANCELLED) {
                    item.status = enum_1.ORDER_HISTORY.CANCELLED;
                }
                else {
                    return res.badRequest({
                        message: (0, languageHelper_1.getLanguage)('en').orderAlreadyCancelled,
                    });
                }
            }
        }
        console.log(nowdata, 'nowdata');
        // Check if all sub-orders are cancelled
        const allCancelled = nowdata.deliveryDetails.every((item) => item.status === enum_1.ORDER_HISTORY.CANCELLED);
        console.log(allCancelled, 'allCancelled');
        const updateData = Object.assign({ deliveryDetails: nowdata.deliveryDetails }, (allCancelled && { status: enum_1.ORDER_HISTORY.CANCELLED }));
        const newoder = yield orderMulti_schema_1.default.findOneAndUpdate({ orderId: value.orderId }, { $set: updateData }, { new: true });
        if (newoder) {
            // console.log(value.reason, 'value.reason');
            // Handle type safety by ensuring subOrderId is an array
            if (Array.isArray(value.subOrderId)) {
                for (const subOrder of value.subOrderId) {
                    yield cancelOderbyDeliveryManSchema_1.default.create({
                        deliveryBoy: value.deliveryManId,
                        merchantId: existingOrder.merchant,
                        order: value.orderId,
                        subOrderId: subOrder,
                        reason: value.reason,
                    });
                }
                const alldataoforder = yield orderMulti_schema_1.default.findOne({
                    orderId: value.orderId,
                });
                const allsuborderidofcancelled = yield alldataoforder.deliveryDetails
                    .filter((item) => item.status == enum_1.ORDER_HISTORY.CANCELLED)
                    .map((item) => item.subOrderId);
                const isallodercancelled = yield alldataoforder.deliveryDetails.every((item) => item.status == enum_1.ORDER_HISTORY.CANCELLED);
                yield (0, common_1.createNotification)({
                    userId: existingOrder.merchant,
                    orderId: value.orderId,
                    subOrderId: allsuborderidofcancelled,
                    deliveryBoyname: dataofdeliveryboy.firstName + ' ' + dataofdeliveryboy.lastName,
                    ismerchantdeliveryboy: dataofdeliveryboy.createdByMerchant,
                    title: ` ${isallodercancelled ? 'All' : 'Some'}   Order Cancelled`,
                    message: `Order ${value.orderId} has been cancelled by deliveryman`,
                    type: 'MERCHANT',
                });
            }
        }
        yield orderHistory_schema_1.default.deleteMany({
            order: value.orderId,
            subOrderId: { $in: value.subOrderId },
            merchantID: existingOrder.merchant,
        });
        if (Array.isArray(value.subOrderId)) {
            for (const subOrder of value.subOrderId) {
                yield orderHistory_schema_1.default.create({
                    message: `Order ${value.orderId} suborder ${subOrder} has been canceled by the delivery man.`,
                    order: value.orderId,
                    subOrderId: subOrder,
                    status: enum_1.ORDER_HISTORY.UNASSIGNED,
                    merchantID: existingOrder.merchant,
                    deliveryBoy: value.deliveryManId,
                });
                yield billing_Schema_1.default.findOneAndUpdate({
                    orderId: value.orderId,
                    deliveryBoyId: value.deliveryManId,
                }, {
                    $set: {
                        orderStatus: enum_1.ORDER_HISTORY.CANCELLED,
                    },
                });
            }
        }
        // await createNotification({
        //   userId: existingOrder.merchant,
        //   orderId: existingOrder.orderId,
        //   subOrderId: value.subOrderId.map((item: any) => nu item),
        //   title: 'Order Cancelled',
        //   message: `Order ${existingOrder.orderId} has been cancelled by deliveryman`,
        //   type: 'MERCHANT',
        // });
        // const oderdata = await orderSchemaMulti.findOne({
        const oderdata = yield orderMulti_schema_1.default.findOne({
            orderId: value.orderId,
            // 'deliveryDetails.subOrderId': value.subOrderId,
        });
        // console.log(oderdata, 'oderdata');
        // IF ALL ODER IN CANCELLED OR DELIVERED THEN TRUE ELSE FALSE
        const isalloderdelevever = oderdata.deliveryDetails.every((item) => item.status === enum_1.ORDER_HISTORY.CANCELLED ||
            item.status === enum_1.ORDER_HISTORY.DELIVERED);
        const isanyoderdelevever = oderdata.deliveryDetails.some((item) => item.status === enum_1.ORDER_HISTORY.DELIVERED);
        console.log(isanyoderdelevever, 'isanyoderdelevever');
        console.log(isalloderdelevever, 'isalloderdelevever');
        if (isanyoderdelevever) {
            yield orderMulti_schema_1.default.findOneAndUpdate({
                orderId: value.orderId,
            }, { $set: { status: enum_1.ORDER_HISTORY.DELIVERED } });
        }
        // if ane oder is cancelled then get latest status of order and set it to status
        const lateststatusoforder = yield orderMulti_schema_1.default.findOne({
            orderId: value.orderId,
        });
        const statusoforderlist = [
            { priority: 1, status: enum_1.ORDER_HISTORY.ARRIVED },
            { priority: 2, status: enum_1.ORDER_HISTORY.PICKED_UP },
            { priority: 3, status: enum_1.ORDER_HISTORY.DEPARTED },
            { priority: 4, status: enum_1.ORDER_HISTORY.DELIVERED },
            { priority: 5, status: enum_1.ORDER_HISTORY.CANCELLED },
        ];
        // Get all sub order statuses
        const subOrderStatuses = lateststatusoforder.deliveryDetails
            .filter((item) => item.status !== enum_1.ORDER_HISTORY.CANCELLED)
            .map((item) => item.status);
        // If all sub orders are cancelled
        if (subOrderStatuses.length === 0) {
            yield orderMulti_schema_1.default.findOneAndUpdate({ orderId: value.orderId }, { $set: { status: enum_1.ORDER_HISTORY.CANCELLED } });
        }
        // If any sub orders exist
        else {
            // Find the highest priority status from statusoforderlist that exists in subOrderStatuses
            const highestPriorityStatus = statusoforderlist
                .sort((a, b) => a.priority - b.priority)
                .find(statusItem => subOrderStatuses.includes(statusItem.status));
            if (highestPriorityStatus) {
                yield orderMulti_schema_1.default.findOneAndUpdate({ orderId: value.orderId }, { $set: { status: highestPriorityStatus.status } });
            }
        }
        console.log(lateststatusoforder, 'lateststatusoforder');
        // try {
        //   await BileSchema.findOneAndUpdate(
        //     {
        //       orderId: value.orderId,
        //       deliveryBoyId: value.deliveryManId
        //     },
        //     {
        //       $set: {
        //         orderStatus: ORDER_HISTORY.CANCELLED
        //       }
        //     }
        //   );
        // } catch (error) {
        //   // Silently handle error if BileSchema not found
        //   console.log('Error updating BileSchema:', error);
        // }
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').orderCancelledSuccessfully,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.cancelMultiSubOrder = cancelMultiSubOrder;
const departOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, order_validation_1.orderArriveValidation);
        // TODO: get distance from google map api
        const tampdestens = 3.1;
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        value.deliveryManId = req.id.toString();
        const isCreated = yield order_schema_1.default.findOne({
            orderId: value.orderId,
            status: { $eq: enum_1.ORDER_HISTORY.PICKED_UP },
        });
        if (!isCreated) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidOrder });
        }
        const isAssigned = yield orderAssignee_schema_1.default.findOne({
            order: value.orderId,
            deliveryBoy: value.deliveryManId,
        });
        if (!isAssigned) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').invalidDeliveryMan,
            });
        }
        yield order_schema_1.default.findOneAndUpdate({ orderId: value.orderId }, {
            $set: { status: enum_1.ORDER_HISTORY.DEPARTED },
            $inc: { distance: tampdestens },
        });
        yield orderHistory_schema_1.default.create({
            message: `Your order ${value.orderId} has been out for delivery`,
            order: value.orderId,
            status: enum_1.ORDER_HISTORY.DEPARTED,
            merchantID: isCreated.merchant,
            deliveryBoy: value.deliveryManId,
        });
        yield orderHistory_schema_1.default.deleteOne({
            order: value.orderId,
            status: enum_1.ORDER_HISTORY.PICKED_UP,
        });
        // io.to(`order_${value.orderId}`).emit('locationUpdate', {
        //   latitude: value.latitude,
        //   longitude: value.longitude,
        //   deliveryManId: req.id,
        // });
        // await createNotification({
        //   userId: isCreated.merchant,
        //   orderId: isCreated.orderId,
        //   title: 'Order Departed',
        //   message: `Your order ${isCreated.orderId} has been departed`,
        //   type: 'MERCHANT',
        // });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').orderUpdatedSuccessfully,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.departOrder = departOrder;
const departOrderMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, order_validation_1.orderArriveValidationMulti);
        // TODO: get distance from google map api
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        console.log(value);
        value.deliveryManId = req.id.toString();
        const isCreated = yield orderMulti_schema_1.default.findOne({
            orderId: value.orderId,
            // status: { $eq: ORDER_HISTORY.PICKED_UP },
            deliveryDetails: {
                $elemMatch: {
                    status: { $eq: enum_1.ORDER_HISTORY.PICKED_UP },
                    subOrderId: value.subOrderId,
                },
            },
        });
        console.log(isCreated, 'isCreated');
        if (!isCreated) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidOrder });
        }
        const isAssigned = yield orderAssigneeMulti_schema_1.default.findOne({
            order: value.orderId,
            deliveryBoy: value.deliveryManId,
        });
        if (!isAssigned) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').invalidDeliveryMan,
            });
        }
        yield orderMulti_schema_1.default.findOneAndUpdate({
            orderId: value.orderId,
            'deliveryDetails.subOrderId': value.subOrderId,
        }, {
            $set: {
                'deliveryDetails.$.status': enum_1.ORDER_HISTORY.DEPARTED, // Update all elements
                'deliveryDetails.$.time.start': Date.now(), // Update all elements' time.start
            },
        });
        yield orderHistory_schema_1.default.create({
            message: `Your order ${value.orderId} suborder ${value.subOrderId} has been out for delivery`,
            order: value.orderId,
            subOrderId: value.subOrderId,
            status: enum_1.ORDER_HISTORY.DEPARTED,
            merchantID: isCreated.merchant,
            deliveryBoy: value.deliveryManId,
        });
        const isalloderdeparted = isCreated.deliveryDetails.every((item) => item.status == enum_1.ORDER_HISTORY.DEPARTED ||
            item.status == enum_1.ORDER_HISTORY.DELIVERED ||
            item.status == enum_1.ORDER_HISTORY.CANCELLED);
        try {
            yield billing_Schema_1.default.updateOne({
                orderId: value.orderId,
                'subOrderdata.subOrderId': value.subOrderId,
            }, {
                $set: {
                    'subOrderdata.$.orderStatus': enum_1.ORDER_HISTORY.DEPARTED,
                    orderStatus: isalloderdeparted
                        ? enum_1.ORDER_HISTORY.DEPARTED
                        : isCreated.status,
                },
            });
        }
        catch (error) {
            // Ignore error if document not found
        }
        // io.to(`order_${value.orderId}`).emit('locationUpdate', {
        //   latitude: value.latitude,
        //   longitude: value.longitude,
        //   deliveryManId: req.id,
        // });
        // await createNotification({
        //   userId: isCreated.merchant,
        //   orderId: isCreated.orderId,
        //   title: 'Order Departed',
        //   message: `Your order ${isCreated.orderId} has been departed`,
        //   type: 'MERCHANT',
        // });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').orderUpdatedSuccessfully,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.departOrderMulti = departOrderMulti;
const pickUpOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, order_validation_1.orderPickUpValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        // TODO: get distance from google map api
        const tampdestens = 1.2;
        const { value } = validateRequest;
        console.log(value, 'value');
        const isArrived = yield order_schema_1.default.findOne({
            orderId: value.orderId,
            status: enum_1.ORDER_HISTORY.ARRIVED,
        });
        if (!isArrived) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').errorOrderArrived });
        }
        // const otpData = await otpSchema.findOne({
        //   value: value.otp,
        //   customerEmail: isArrived.pickupDetails.email,
        //   expiry: { $gte: Date.now() },
        // });
        // if (!otpData) {
        //   return res.badRequest({ message: getLanguage('en').otpExpired });
        // }
        // const signDocs = value.userSignature;
        // value.userSignature = await uploadFile(
        //   signDocs[0],
        //   signDocs[1],
        //   'USER-SIGNATURE',
        // );
        // console.log(value.userSignature, 'value.userSignature');
        // console.log(value.pickupTimestamp, 'value.pickupTimestamp');
        yield order_schema_1.default.findOneAndUpdate({ orderId: value.orderId }, {
            $set: {
                'pickupDetails.userSignature': value.userSignature,
                'pickupDetails.orderTimestamp': value.pickupTimestamp,
                status: enum_1.ORDER_HISTORY.PICKED_UP,
            },
            $inc: { distance: tampdestens },
        });
        yield paymentGet_schema_1.default.findOneAndUpdate({ orderId: value.orderId }, { $set: { statusOfOrder: 'PICKED_UP' } }, { new: true });
        // if (isArrived.cashOnDelivery) {
        //   await PaymentInfoSchema.updateOne(
        //     { order: value.orderId },
        //     { $set: { status: PAYMENT_INFO.SUCCESS } },
        //   );
        // }
        yield orderHistory_schema_1.default.create({
            message: 'Delivery Person has been arrived at pick up location and waiting for client',
            order: value.orderId,
            status: enum_1.ORDER_HISTORY.PICKED_UP,
            merchantID: isArrived.merchant,
        });
        yield orderHistory_schema_1.default.deleteOne({
            order: value.orderId,
            status: enum_1.ORDER_HISTORY.ARRIVED,
        });
        // await createNotification({
        //   userId: isArrived.merchant,
        //   orderId: isArrived.orderId,
        //   title: 'Order Picked Up',
        //   message: `Your order ${isArrived.orderId} has been picked up`,
        //   type: 'MERCHANT',
        // });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').orderUpdatedSuccessfully,
        });
    }
    catch (error) {
        console.log('error', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.pickUpOrder = pickUpOrder;
const pickUpOrderMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, order_validation_1.orderPickUpValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        // TODO: get distance from google map api
        const { value } = validateRequest;
        // Get already picked up orders
        const order = yield orderMulti_schema_1.default.findOne({ orderId: value.orderId });
        if (!order) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidOrder });
        }
        const allDeliveryDetails = order.deliveryDetails;
        const allPickedUpOrderIds = allDeliveryDetails
            .filter((data) => data.status === enum_1.ORDER_HISTORY.ARRIVED &&
            value.subOrderId.includes(data.subOrderId))
            .map((data) => data.subOrderId) || [];
        const allolradepikupOrderIds = allDeliveryDetails
            .filter((data) => data.status === enum_1.ORDER_HISTORY.PICKED_UP)
            .map((data) => data.subOrderId) || [];
        const allid = [...allPickedUpOrderIds, ...allolradepikupOrderIds];
        console.log(allPickedUpOrderIds, 'allPickedUpOrderIds');
        console.log(allolradepikupOrderIds, 'allolradepikupOrderIds');
        console.log(allid, 'allid');
        // return;
        const arrayofpickupoder = allDeliveryDetails.filter((detail) => detail.status === enum_1.ORDER_HISTORY.PICKED_UP);
        // Filter out already picked up orders
        const newSubOrderIds = value.subOrderId.filter((subId) => !arrayofpickupoder.find((order) => order.subOrderId === subId));
        if (newSubOrderIds.length === 0) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').errorOrderPickedUp });
        }
        const pickupLocation = order.pickupDetails.location;
        const deliveryLocations = allDeliveryDetails.filter((detail) => newSubOrderIds.includes(detail.subOrderId) ||
            allolradepikupOrderIds.includes(detail.subOrderId));
        console.log(deliveryLocations, 'deliveryLocations');
        // console.log(allolradepikupOrderIds, 'allolradepikupOrderIds');
        // console.log(newSubOrderIds, 'newSubOrderIds');
        // check if any order id is not matched
        const isAnyOrderIdNotMatched = newSubOrderIds.some((subOrderId) => !allDeliveryDetails.some((data) => data.subOrderId === subOrderId));
        if (isAnyOrderIdNotMatched) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidSubOrderId });
        }
        // return;
        const apiKey = 'AIzaSyDB4WPFybdVL_23rMMOAcqIEsPaSsb-jzo';
        const optimizedRoute = [];
        let currentLocation = pickupLocation;
        // get all pikupoder oder id and all id of pikup
        // Find optimal route by getting nearest location each time
        while (optimizedRoute.length < allid.length) {
            let shortestDistance = Infinity;
            let nearestLocation = null;
            // Find nearest unvisited location from current position
            for (const delivery of deliveryLocations) {
                if (optimizedRoute.find((d) => d.subOrderId === delivery.subOrderId)) {
                    continue;
                }
                const response = yield axios_1.default.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
                    params: {
                        origins: `${currentLocation.latitude},${currentLocation.longitude}`,
                        destinations: `${delivery.location.latitude},${delivery.location.longitude}`,
                        key: apiKey,
                    },
                });
                // console.log(response.data.rows[0].elements[0],'response.data')
                const distance = (_g = (_f = (_e = (_d = (_c = response.data) === null || _c === void 0 ? void 0 : _c.rows[0]) === null || _d === void 0 ? void 0 : _d.elements[0]) === null || _e === void 0 ? void 0 : _e.distance) === null || _f === void 0 ? void 0 : _f.value) !== null && _g !== void 0 ? _g : 0;
                const duration = (_m = (_l = (_k = (_j = (_h = response.data) === null || _h === void 0 ? void 0 : _h.rows[0]) === null || _j === void 0 ? void 0 : _j.elements[0]) === null || _k === void 0 ? void 0 : _k.duration) === null || _l === void 0 ? void 0 : _l.value) !== null && _m !== void 0 ? _m : 0;
                console.log(distance, 'distance');
                console.log(duration, 'duration');
                console.log(shortestDistance, 'shortestDistance');
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    nearestLocation = {
                        subOrderId: delivery.subOrderId,
                        location: delivery.location,
                        distance: distance,
                        duration: duration,
                    };
                }
            }
            optimizedRoute.push(nearestLocation);
            currentLocation = nearestLocation.location;
        }
        // const leftOverDeliveryDetails= allDeliveryDetails.filter((detail:any)=> !newallDeliveryDetails.includes(detail))
        // newallDeliveryDetails.push(...leftOverDeliveryDetails)
        console.log('Optimized delivery route:', optimizedRoute);
        const isArrived = yield orderMulti_schema_1.default.findOne({
            orderId: value.orderId,
            deliveryDetails: {
                $elemMatch: {
                    status: enum_1.ORDER_HISTORY.ARRIVED,
                    subOrderId: { $in: newSubOrderIds },
                },
            },
        });
        if (!isArrived) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').errorOrderPickedUp });
        }
        const remainingDeliveryDetails = allDeliveryDetails.filter((detail) => !newSubOrderIds.includes(detail.subOrderId));
        const allPickedUp = remainingDeliveryDetails.every((detail) => detail.status !== enum_1.ORDER_HISTORY.ASSIGNED &&
            detail.status !== enum_1.ORDER_HISTORY.UNASSIGNED &&
            detail.status !== enum_1.ORDER_HISTORY.ARRIVED);
        const nowdata = allDeliveryDetails.map((data) => {
            if (optimizedRoute.includes(data.subOrderId)) {
                return Object.assign(Object.assign({}, data), { status: enum_1.ORDER_HISTORY.PICKED_UP, time: {
                        start: value.pickupTimestamp,
                        end: value.pickupTimestamp,
                    } });
            }
        });
        console.log(nowdata, 'nowdata');
        var totaltimedata = 0;
        for (const elem of optimizedRoute) {
            totaltimedata += elem.duration;
            // convert to minutes
            const time = totaltimedata / 60;
            console.log(time, 'time');
            console.log(totaltimedata, 'totaltimedata');
            console.log(value.orderId, 'order');
            console.log(elem.subOrderId, 'elem.subOrderId');
            console.log(optimizedRoute, 'optimizedRoute');
            console.log(pickupLocation, 'pickupLocation');
            try {
                const bile = yield billing_Schema_1.default.updateOne({
                    orderId: value.orderId,
                    'subOrderdata.subOrderId': elem.subOrderId,
                }, {
                    $set: {
                        'subOrderdata.$.averageTime': `${time.toFixed(2)} minutes`,
                        'subOrderdata.$.pickupLocation': pickupLocation,
                        'subOrderdata.$.pickupTime': value.pickupTimestamp,
                        'subOrderdata.$.deliveryLocation': elem.location,
                        'subOrderdata.$.orderStatus': enum_1.ORDER_HISTORY.PICKED_UP,
                        'subOrderdata.$.distance': (elem.distance / 1609.34).toFixed(2),
                        orderStatus: allPickedUp
                            ? enum_1.ORDER_HISTORY.PICKED_UP
                            : isArrived.status,
                    },
                }, { new: true });
                console.log(bile, 'bile');
            }
            catch (error) {
                console.log(error, 'error');
            }
        }
        const base64Image = value.userSignature; // Assuming userSignature is a base64 image
        const imgurl = yield (0, getimgurl_1.getimgurl)(base64Image);
        yield orderMulti_schema_1.default.findOneAndUpdate({ orderId: value.orderId }, {
            $set: {
                status: allPickedUp ? enum_1.ORDER_HISTORY.PICKED_UP : isArrived.status,
                'pickupDetails.userSignature': imgurl,
                'pickupDetails.orderTimestamp': value.pickupTimestamp,
                'deliveryDetails.$[elem].status': enum_1.ORDER_HISTORY.PICKED_UP,
                'deliveryDetails.$[elem].pickupsignature': imgurl,
                route: optimizedRoute,
            },
        }, {
            arrayFilters: [{ 'elem.subOrderId': { $in: allid } }],
        });
        console.log(newSubOrderIds, 'newSubOrderIds');
        console.log(isArrived, 'isArrived');
        // in milles
        for (const elem of allid) {
            const distance = ((_o = optimizedRoute.find((data) => data.subOrderId === elem)) === null || _o === void 0 ? void 0 : _o.distance) || 0;
            const duration = ((_p = optimizedRoute.find((data) => data.subOrderId === elem)) === null || _p === void 0 ? void 0 : _p.duration) || 0;
            if (distance) {
                yield orderMulti_schema_1.default.findOneAndUpdate({ orderId: value.orderId, 'deliveryDetails.subOrderId': elem }, { $set: { 'deliveryDetails.$.distance': distance / 1609.34 } });
            }
        }
        yield paymentGet_schema_1.default.findOneAndUpdate({ orderId: value.orderId }, { $set: { statusOfOrder: 'PICKED_UP' } }, { new: true });
        // if (isArrived.cashOnDelivery) {
        //   await PaymentInfoSchema.updateOne(
        //     { order: value.orderId },
        //     { $set: { status: PAYMENT_INFO.SUCCESS } },
        //   );
        // }
        newSubOrderIds.forEach((subOrderId) => __awaiter(void 0, void 0, void 0, function* () {
            yield orderHistory_schema_1.default.create({
                message: 'Delivery Person has been arrived at pick up location and waiting for client',
                order: value.orderId,
                subOrderId: subOrderId,
                status: enum_1.ORDER_HISTORY.PICKED_UP,
                merchantID: isArrived.merchant,
            });
        }));
        yield (0, common_1.createNotification)({
            userId: isArrived.merchant,
            orderId: isArrived.orderId,
            subOrderId: allid,
            title: 'Order Picked Up',
            message: `Your order ${isArrived.orderId} has been picked up`,
            type: 'MERCHANT',
        });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').orderUpdatedSuccessfully,
        });
    }
    catch (error) {
        console.log('error', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.pickUpOrderMulti = pickUpOrderMulti;
const sendEmailOrMobileOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, order_validation_1.orderIdValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const orderExist = yield order_schema_1.default.findOne({
            orderId: value.orderId,
            status: { $ne: enum_1.ORDER_HISTORY.DELIVERED },
        });
        if (!orderExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').invalidOrder,
            });
        }
        const otp = (0, common_1.generateIntRandomNo)(111111, 999999);
        if (orderExist.status === enum_1.ORDER_HISTORY.ARRIVED) {
            yield (0, common_1.emailOrMobileOtp)(orderExist.pickupDetails.email, `This is your otp for identity verification ${otp}`);
        }
        else if (orderExist.status === enum_1.ORDER_HISTORY.DEPARTED) {
            yield (0, common_1.emailOrMobileOtp)(orderExist.deliveryDetails.email, `This is your otp for identity verification ${otp}`);
        }
        const isAtPickUp = orderExist.status === enum_1.ORDER_HISTORY.ARRIVED;
        const email = isAtPickUp
            ? orderExist.pickupDetails.email
            : orderExist.deliveryDetails.email;
        const contactNumber = isAtPickUp
            ? orderExist.pickupDetails.mobileNumber
            : orderExist.deliveryDetails.mobileNumber;
        yield otp_schema_1.default.updateOne({
            value: otp,
            customerEmail: email,
            customerMobile: contactNumber,
        }, {
            value: otp,
            customerEmail: email,
            customerMobile: contactNumber,
            expiry: Date.now() + 600000,
        }, { upsert: true });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').otpSentSuccess,
            data: { otp },
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.sendEmailOrMobileOtp = sendEmailOrMobileOtp;
const sendEmailOrMobileOtpMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, order_validation_1.orderIdValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const orderExist = yield orderMulti_schema_1.default.findOne({
            orderId: value.orderId,
            deliveryDetails: {
                $elemMatch: {
                    status: { $ne: enum_1.ORDER_HISTORY.DELIVERED }, // Match the specific status
                },
            },
        });
        console.log(orderExist);
        if (!orderExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').invalidOrder,
            });
        }
        const otp = (0, common_1.generateIntRandomNo)(111111, 999999);
        if (orderExist.status === enum_1.ORDER_HISTORY.ARRIVED) {
            yield (0, common_1.emailOrMobileOtp)(orderExist.pickupDetails.email, `This is your otp for identity verification ${otp}`);
        }
        // else if (orderExist.status === ORDER_HISTORY.DEPARTED) {
        //   await emailOrMobileOtp(
        //     orderExist.deliveryDetails.email,
        //     `This is your otp for identity verification ${otp}`,
        //   );
        // }
        const isAtPickUp = orderExist.status === enum_1.ORDER_HISTORY.ARRIVED;
        console.log(isAtPickUp);
        // const email = isAtPickUp
        //   ? orderExist.pickupDetails.email
        //   : orderExist.deliveryDetails.email;
        const email = isAtPickUp ? orderExist.pickupDetails.email : null;
        // : orderExist.deliveryDetails[].email;
        // const contactNumber = isAtPickUp
        //   ? orderExist.pickupDetails.mobileNumber
        //   : orderExist.deliveryDetails.mobileNumber;
        const contactNumber = isAtPickUp
            ? orderExist.pickupDetails.mobileNumber
            : null;
        yield otp_schema_1.default.updateOne({
            value: otp,
            customerEmail: email,
            customerMobile: contactNumber,
        }, {
            value: otp,
            customerEmail: email,
            customerMobile: contactNumber,
            expiry: Date.now() + 600000,
        }, { upsert: true });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').otpSentSuccess,
            data: { otp },
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.sendEmailOrMobileOtpMulti = sendEmailOrMobileOtpMulti;
const sendEmailOrMobileOtpMultiForDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, order_validation_1.orderIdValidationForDelivery);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        console.log(value);
        const orderExist = yield orderMulti_schema_1.default.findOne({
            orderId: value.orderId,
            deliveryDetails: {
                $elemMatch: {
                    subOrderId: value.subOrderId, // Match the specific subOrderId
                },
            },
        });
        console.log(orderExist, 'Dastaaaa');
        const deliveryEmail = orderExist.deliveryDetails.filter((data) => data.subOrderId === value.subOrderId);
        console.log(deliveryEmail[0].email, 'Emaillllll');
        console.log(deliveryEmail[0].mobileNumber, 'Emaillllll');
        if (!orderExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').invalidOrder,
            });
        }
        const otp = (0, common_1.generateIntRandomNo)(111111, 999999);
        if (orderExist.status === enum_1.ORDER_HISTORY.ARRIVED) {
            yield (0, common_1.emailOrMobileOtp)(orderExist.pickupDetails.email, `This is your otp for identity verification ${otp}`);
        }
        // else if (orderExist.status === ORDER_HISTORY.DEPARTED) {
        //   await emailOrMobileOtp(
        //     orderExist.deliveryDetails.email,
        //     `This is your otp for identity verification ${otp}`,
        //   );
        // }
        const isAtPickUp = orderExist.status === enum_1.ORDER_HISTORY.ARRIVED;
        console.log(isAtPickUp);
        const email = isAtPickUp
            ? orderExist.pickupDetails.email
            : deliveryEmail[0].email;
        // const email = isAtPickUp
        // ? orderExist.pickupDetails.email : null
        // : orderExist.deliveryDetails[].email;
        const contactNumber = isAtPickUp
            ? orderExist.pickupDetails.mobileNumber
            : deliveryEmail[0].mobileNumber;
        // const contactNumber = isAtPickUp
        // ? orderExist.pickupDetails.mobileNumber
        // : null;
        yield otp_schema_1.default.updateOne({
            value: otp,
            customerEmail: email,
            customerMobile: contactNumber,
            subOrderId: value.subOrderId,
        }, {
            value: otp,
            customerEmail: email,
            customerMobile: contactNumber,
            expiry: Date.now() + 600000,
        }, { upsert: true });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').otpSentSuccess,
            data: { otp },
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.sendEmailOrMobileOtpMultiForDelivery = sendEmailOrMobileOtpMultiForDelivery;
// export const sendEmailOrMobileOtp = async (
//   req: RequestParams,
//   res: Response,
// ) => {
//   try {
//     const validateRequest = validateParamsWithJoi<{
//       orderId: number;
//     }>(req.body, orderIdValidation);
//     if (!validateRequest.isValid) {
//       return res.badRequest({ message: validateRequest.message });
//     }
//     const { value } = validateRequest;
//     const orderExist = await orderSchema.findOne({
//       orderId: value.orderId,
//       status: { $ne: ORDER_HISTORY.DELIVERED },
//     });
//     if (!orderExist) {
//       return res.badRequest({
//         message: getLanguage('en').invalidOrder,
//       });
//     }
//     const otp = await generateIntRandomNo(111111, 999999);
//     await emailOrMobileOtp(
//       orderExist.pickupDetails.email,
//       `This is your otp for identity verification ${otp}`,
//     );
//     const isAtPickUp = orderExist.status === ORDER_HISTORY.ARRIVED;
//     const email = isAtPickUp
//       ? orderExist.pickupDetails.email
//       : orderExist.deliveryDetails.email;
//     const contactNumber = isAtPickUp
//       ? orderExist.pickupDetails.mobileNumber
//       : orderExist.deliveryDetails.mobileNumber;
//     await otpSchema.updateOne(
//       {
//         value: otp,
//         customerEmail: email,
//         customerMobile: contactNumber,
//       },
//       {
//         value: otp,
//         customerEmail: email,
//         customerMobile: contactNumber,
//         expiry: Date.now() + 600000,
//       },
//       { upsert: true },
//     );
//     return res.ok({
//       message: getLanguage('en').otpSentSuccess,
//       data: { otp },
//     });
//   } catch (error) {
//     return res.failureResponse({
//       error: error,
//       message: getLanguage('en').somethingWentWrong,
//     });
//   }
// };
const deliverOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, order_validation_1.orderDeliverValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        console.log('Request Body:', value);
        const isArrived = yield order_schema_1.default.findOne({
            orderId: value.orderId,
        });
        console.log('Order Details:', isArrived);
        if (!isArrived) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidOrder });
        }
        // otp verification START
        // const otpData = await otpSchema.findOne({
        //   value: value.otp,
        //   customerEmail: isArrived.deliveryDetails.email,
        //   expiry: { $gte: Date.now() },
        // });
        // console.log('OTP Data:', otpData);
        // if (!otpData) {
        //   return res.badRequest({ message: getLanguage('en').otpExpired });
        // }
        // otp verification END
        // total amount to be paid
        const endTime = Date.now(); // Current time in milliseconds
        const startTime = new Date(isArrived.time.start).getTime();
        var totalAmount = isArrived.paymentCollectionRupees;
        // delivery boy charge
        var chargeofDeliveryBoy = 0;
        // admin balance
        var adminBalance = 0;
        // if delivery boy is created by admin
        // then totalamount - adminCommission
        //
        const [paymentInfo] = yield Promise.all([
            paymentInfo_schema_1.default.findOne({ order: value.orderId }),
            order_schema_1.default.updateOne({ orderId: value.orderId }, {
                $set: {
                    'deliveryDetails.deliveryBoySignature': value.deliveryManSignature,
                    'deliveryDetails.orderTimestamp': value.deliverTimestamp,
                    status: enum_1.ORDER_HISTORY.DELIVERED,
                    'time.end': endTime, // Use dot notation to set only the 'end' field
                },
            }, { new: true }),
        ]);
        console.log('Payment Info:', paymentInfo);
        const admin = yield admin_schema_1.default.findOne();
        console.log('Admin Details:', admin);
        const assignData = yield orderAssignee_schema_1.default.findOne({
            order: value.orderId,
        });
        console.log('Order Assignment:', assignData);
        console.log('Order Assignee details', assignData.deliveryBoy);
        // delivery boy details
        const DeliveryMan = yield deliveryMan_schema_1.default.findById(assignData.deliveryBoy);
        // charge of delivery boy
        if (DeliveryMan.chargeMethod === enum_1.CHARGE_METHOD.TIME) {
            // time in hours
            const timeTaken = endTime - startTime;
            console.log(endTime, 'endTime');
            console.log(startTime, 'startTime');
            console.log(timeTaken, 'timeTaken');
            const minutes = timeTaken / (1000 * 60); // Convert milliseconds to minutes
            // charge per hour
            chargeofDeliveryBoy = (minutes / 60) * DeliveryMan.charge; // Convert minutes to hours for hourly charge
            console.log(`Charge: ${chargeofDeliveryBoy}`);
            console.log(`Time taken: ${minutes} minutes`);
        }
        else if (DeliveryMan.chargeMethod === enum_1.CHARGE_METHOD.DISTANCE) {
            //  distance in miles
            const distance = isArrived.distance;
            chargeofDeliveryBoy = distance * DeliveryMan.charge;
            console.log(`Charge: ${chargeofDeliveryBoy}`);
            console.log(`Distance: ${distance} miles`);
        }
        // if delivery boy is created by admin
        if (DeliveryMan.createdByAdmin) {
            console.log('Processing Cash on Delivery Payment');
            if (paymentInfo.status !== enum_1.PAYMENT_INFO.SUCCESS) {
                yield paymentInfo_schema_1.default.updateOne({ order: value.orderId }, { $set: { status: enum_1.PAYMENT_INFO.SUCCESS } });
            }
            console.log('chargeofDeliveryBoy', chargeofDeliveryBoy);
            console.log(value.orderId);
            yield (0, common_1.updateWallet)(chargeofDeliveryBoy, admin._id.toString(), req.id.toString(), enum_1.TRANSACTION_TYPE.WITHDRAW, `Order ${value.orderId} Delivery Boy Commission`, false);
        }
        // Only update delivery boy balance if it's cash on delivery
        if (isArrived.cashOnDelivery) {
            const balance = totalAmount;
            const deliveryBoy = yield deliveryMan_schema_1.default.findByIdAndUpdate(assignData.deliveryBoy, { $inc: { balance: balance } }, { $inc: { earning: chargeofDeliveryBoy } });
            console.log('Delivery Boy Details', deliveryBoy);
        }
        else {
            console.log('Delivery Boy Details', 'Not updated');
            console.log('isArrived.cashOnDelivery is false');
        }
        const city = yield city_schema_1.default.findById(isArrived.city);
        console.log('City Details:', city);
        const chargeData = yield productCharges_schema_1.default.findOne({
            pickupRequest: isArrived.pickupDetails.request,
            isCustomer: isArrived.isCustomer,
        });
        console.log('Charge Data:', chargeData);
        const adminCommission = chargeData.adminCommission;
        console.log('Admin Commission:', adminCommission);
        const message = `Order ${value.orderId} Amount`;
        console.log('isArrived.cashOnDelivery', isArrived.cashOnDelivery);
        if (isArrived.cashOnDelivery) {
            // if cash on delivery
            console.log('Processing Cash on Delivery Payment');
            if (paymentInfo.status !== enum_1.PAYMENT_INFO.SUCCESS) {
                yield paymentInfo_schema_1.default.updateOne({ order: value.orderId }, { $set: { status: enum_1.PAYMENT_INFO.SUCCESS } });
            }
            console.log('adminCommission', adminCommission);
            console.log(value.orderId);
            yield (0, common_1.updateWallet)(adminCommission, admin._id.toString(), req.id.toString(), enum_1.TRANSACTION_TYPE.WITHDRAW, `Order ${value.orderId} Admin Commission`, false);
        }
        else if (paymentInfo.paymentThrough === enum_1.PAYMENT_TYPE.WALLET) {
            console.log('Processing Wallet Payment');
            yield Promise.all([
                (0, common_1.updateWallet)(isArrived.totalCharge, admin._id.toString(), assignData.merchant.toString(), enum_1.TRANSACTION_TYPE.WITHDRAW, message),
                (0, common_1.updateWallet)(isArrived.totalCharge - adminCommission, admin._id.toString(), req.id.toString(), enum_1.TRANSACTION_TYPE.DEPOSIT, message, false),
            ]);
        }
        else if (paymentInfo.paymentThrough === enum_1.PAYMENT_TYPE.ONLINE) {
            console.log('Processing Online Payment');
            const admin = yield admin_schema_1.default.findOneAndUpdate({}, {
                $inc: { balance: adminCommission },
            });
            yield (0, common_1.updateWallet)(isArrived.totalCharge - adminCommission, admin._id.toString(), req.id.toString(), enum_1.TRANSACTION_TYPE.DEPOSIT, message, false);
        }
        else {
            console.log('Processing Other Payment Type');
            yield (0, common_1.updateWallet)(adminCommission, admin._id.toString(), req.id.toString(), enum_1.TRANSACTION_TYPE.WITHDRAW, `Order ${value.orderId} Admin Commission`, false);
        }
        yield orderHistory_schema_1.default.create({
            message: `Your order ${value.orderId} has been successfully delivered`,
            order: value.orderId,
            status: enum_1.ORDER_HISTORY.DELIVERED,
            merchantID: isArrived.merchant,
        });
        console.log('Order History Created');
        yield orderHistory_schema_1.default.deleteOne({
            order: value.orderId,
            status: enum_1.ORDER_HISTORY.DEPARTED,
        });
        console.log('Old Order History Deleted');
        yield (0, common_1.createNotification)({
            userId: isArrived.merchant,
            orderId: isArrived.orderId,
            title: 'Order Delivered',
            message: `Your order ${isArrived.orderId} has been delivered`,
            type: 'MERCHANT',
        });
        console.log('Notification Created');
        console.log('Final Order Details:', {
            orderId: value.orderId,
            status: enum_1.ORDER_HISTORY.DELIVERED,
            paymentInfo: paymentInfo,
            adminCommission: adminCommission,
            totalCharge: isArrived.totalCharge,
        });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').orderUpdatedSuccessfully,
        });
    }
    catch (error) {
        console.error('Error in deliverOrder:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error',
        });
    }
});
exports.deliverOrder = deliverOrder;
const deliverOrderMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
    try {
        console.log('req.body', req.body);
        const validateRequest = (0, validateRequest_1.default)(req.body, order_validation_1.orderDeliverValidationMulti);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        console.log('Request Body:', value);
        const isArrived = yield orderMulti_schema_1.default.findOne({
            orderId: value.orderId,
            'deliveryDetails.subOrderId': value.subOrderId,
        });
        console.log('Order Details:', isArrived.deliveryDetails);
        const deliveryEmail = isArrived.deliveryDetails.filter((data) => data.subOrderId === value.subOrderId);
        if (!isArrived) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidOrder });
        }
        // Just update order status to delivered
        const updatedOrderData = yield orderMulti_schema_1.default.findOneAndUpdate({
            orderId: value.orderId,
            'deliveryDetails.subOrderId': value.subOrderId,
        }, {
            $set: {
                'deliveryDetails.$.deliverysignature': yield (0, getimgurl_1.getimgurl)(value.deliveryManSignature),
                'deliveryDetails.$.orderTimestamp': value.deliverTimestamp,
                'deliveryDetails.$.status': enum_1.ORDER_HISTORY.DELIVERED,
                'deliveryDetails.$.time.end': value.deliverTimestamp,
            },
        }, { new: true });
        // Check if all sub-orders are delivered
        const updatedOrder = yield orderMulti_schema_1.default.findOne({
            orderId: value.orderId,
        });
        const allDelivered = updatedOrder.deliveryDetails.every((detail) => detail.status === enum_1.ORDER_HISTORY.DELIVERED ||
            detail.status === enum_1.ORDER_HISTORY.CANCELLED ||
            detail.status === enum_1.ORDER_HISTORY.UNASSIGNED);
        if (allDelivered) {
            yield orderMulti_schema_1.default.updateOne({ orderId: value.orderId }, { $set: { status: enum_1.ORDER_HISTORY.DELIVERED } });
        }
        // Update payment status
        yield paymentInfo_schema_1.default.updateOne({ order: value.orderId }, { $set: { status: enum_1.PAYMENT_INFO.SUCCESS } });
        // Create order history
        yield orderHistory_schema_1.default.create({
            message: `Your order ${updatedOrderData === null || updatedOrderData === void 0 ? void 0 : updatedOrderData.showOrderNumber} suborder ${value.subOrderId} has been successfully delivered`,
            order: value.orderId,
            subOrderId: value.subOrderId,
            showOrderId: updatedOrderData === null || updatedOrderData === void 0 ? void 0 : updatedOrderData.showOrderNumber,
            status: enum_1.ORDER_HISTORY.DELIVERED,
            merchantID: isArrived.merchant,
        });
        // Update bile schema status
        yield billing_Schema_1.default.updateOne({
            orderId: value.orderId,
            'subOrderdata.subOrderId': value.subOrderId,
            'subOrderdata.orderStatus': enum_1.ORDER_STATUS.DEPARTED,
        }, {
            $set: {
                'subOrderdata.$.orderStatus': enum_1.ORDER_STATUS.DELIVERED,
                'subOrderdata.$.deliveryTime': value.deliverTimestamp,
                'subOrderdata.$.deliverysignature': value.deliveryManSignature,
                'subOrderdata.$.deliveryTimestamp': value.deliverTimestamp,
                orderStatus: allDelivered
                    ? enum_1.ORDER_STATUS.DELIVERED
                    : updatedOrder.status,
                totalamountOfPackage: (_r = (_q = isArrived.deliveryDetails.find((data) => data.subOrderId === value.subOrderId)) === null || _q === void 0 ? void 0 : _q.paymentCollectionRupees) !== null && _r !== void 0 ? _r : 0,
            },
        });
        const BileSchemaData = yield billing_Schema_1.default.findOne({
            orderId: value.orderId,
            'subOrderdata.subOrderId': value.subOrderId,
        });
        const dataofdeliveryboy = yield deliveryMan_schema_1.default.findById(BileSchemaData === null || BileSchemaData === void 0 ? void 0 : BileSchemaData.deliveryBoyId);
        const oderdata = yield orderMulti_schema_1.default.findOne({
            orderId: value.orderId,
        });
        const isalloderdelever = oderdata.deliveryDetails.every((detail) => detail.status === enum_1.ORDER_HISTORY.DELIVERED);
        // Create notification
        yield (0, common_1.createNotification)({
            userId: isArrived.merchant,
            orderId: isArrived.orderId,
            subOrderId: [value.subOrderId],
            title: isalloderdelever ? 'All Order Delivered' : 'Some Order Delivered',
            message: `Your order ${isArrived.showOrderNumber} has been delivered`,
            deliveryBoyname: (dataofdeliveryboy === null || dataofdeliveryboy === void 0 ? void 0 : dataofdeliveryboy.firstName) + ' ' + (dataofdeliveryboy === null || dataofdeliveryboy === void 0 ? void 0 : dataofdeliveryboy.lastName),
            ismerchantdeliveryboy: dataofdeliveryboy === null || dataofdeliveryboy === void 0 ? void 0 : dataofdeliveryboy.createdByMerchant,
            type: 'MERCHANT',
        });
        // console.log(dataofdeliveryboy, 'dataofdeliveryboy');
        const iscreatedByMerchant = dataofdeliveryboy === null || dataofdeliveryboy === void 0 ? void 0 : dataofdeliveryboy.createdByMerchant;
        console.log(dataofdeliveryboy, 'dataofdeliveryboy');
        const iscasondelivery = isArrived.deliveryDetails.find((data) => data.subOrderId == value.subOrderId).cashOnDelivery;
        let chargeofDeliveryBoy = 0;
        const ta = ((_s = BileSchemaData === null || BileSchemaData === void 0 ? void 0 : BileSchemaData.subOrderdata.find((data) => data.subOrderId == value.subOrderId)) === null || _s === void 0 ? void 0 : _s.pickupTime) || 0;
        console.log(ta, 'ta');
        const startTime = new Date(ta);
        const endTimeDate = new Date(value.deliverTimestamp);
        console.log(startTime, 'start time');
        console.log(endTimeDate, 'end time');
        const timeDiffMs = endTimeDate.getTime() - startTime.getTime();
        const hours = Math.floor(timeDiffMs / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiffMs % (1000 * 60)) / 1000);
        console.log(`Time difference: ${hours}h ${minutes}m ${seconds}s`);
        const totalMinutes = hours * 60 + minutes + (seconds >= 30 ? 1 : 0);
        // Calculate charge based on delivery boy type and charge method
        if (iscreatedByMerchant) {
            if (BileSchemaData.chargeMethod === enum_1.CHARGE_METHOD.TIME) {
                // For time-based charging, calculate based on total minutes
                chargeofDeliveryBoy = (totalMinutes / 60) * (dataofdeliveryboy === null || dataofdeliveryboy === void 0 ? void 0 : dataofdeliveryboy.charge);
                // if cash on delivery then add amount of package
                if (iscasondelivery) {
                    yield deliveryMan_schema_1.default.updateOne({ _id: dataofdeliveryboy._id }, {
                        $inc: {
                            earning: (_u = (_t = isArrived.deliveryDetails.find((data) => data.subOrderId === value.subOrderId)) === null || _t === void 0 ? void 0 : _t.paymentCollectionRupees) !== null && _u !== void 0 ? _u : 0,
                        },
                    });
                }
            }
            else if (BileSchemaData.chargeMethod === enum_1.CHARGE_METHOD.DISTANCE) {
                // For distance-based charging
                chargeofDeliveryBoy =
                    ((_v = BileSchemaData === null || BileSchemaData === void 0 ? void 0 : BileSchemaData.subOrderdata.find((data) => data.subOrderId === value.subOrderId)) === null || _v === void 0 ? void 0 : _v.distance) * (dataofdeliveryboy === null || dataofdeliveryboy === void 0 ? void 0 : dataofdeliveryboy.charge);
                if (iscasondelivery) {
                    yield deliveryMan_schema_1.default.updateOne({ _id: dataofdeliveryboy._id }, {
                        $inc: {
                            earning: (_x = (_w = isArrived.deliveryDetails.find((data) => data.subOrderId === value.subOrderId)) === null || _w === void 0 ? void 0 : _w.paymentCollectionRupees) !== null && _x !== void 0 ? _x : 0,
                        },
                    });
                }
            }
            // Round charge to 2 decimal places
            chargeofDeliveryBoy = Math.round(chargeofDeliveryBoy * 100) / 100;
        }
        else {
            if (BileSchemaData.chargeMethod === enum_1.CHARGE_METHOD.TIME) {
                // For time-based charging, calculate based on total minutes
                chargeofDeliveryBoy = (totalMinutes / 60) * (dataofdeliveryboy === null || dataofdeliveryboy === void 0 ? void 0 : dataofdeliveryboy.charge);
                // if cash on delivery then add amount of package
                if (iscasondelivery) {
                    yield deliveryMan_schema_1.default.updateOne({ _id: dataofdeliveryboy._id }, {
                        $inc: {
                            earning: (_z = (_y = isArrived.deliveryDetails.find((data) => data.subOrderId === value.subOrderId)) === null || _y === void 0 ? void 0 : _y.paymentCollectionRupees) !== null && _z !== void 0 ? _z : 0,
                        },
                    });
                }
            }
            else if (BileSchemaData.chargeMethod === enum_1.CHARGE_METHOD.DISTANCE) {
                // For distance-based charging
                chargeofDeliveryBoy =
                    ((_0 = BileSchemaData === null || BileSchemaData === void 0 ? void 0 : BileSchemaData.subOrderdata.find((data) => data.subOrderId === value.subOrderId)) === null || _0 === void 0 ? void 0 : _0.distance) * (dataofdeliveryboy === null || dataofdeliveryboy === void 0 ? void 0 : dataofdeliveryboy.charge);
                if (iscasondelivery) {
                    yield deliveryMan_schema_1.default.updateOne({ _id: dataofdeliveryboy._id }, {
                        $inc: {
                            earning: (_2 = (_1 = isArrived.deliveryDetails.find((data) => data.subOrderId === value.subOrderId)) === null || _1 === void 0 ? void 0 : _1.paymentCollectionRupees) !== null && _2 !== void 0 ? _2 : 0,
                        },
                    });
                }
            }
            // Round charge to 2 decimal places
            chargeofDeliveryBoy = Math.round(chargeofDeliveryBoy * 100) / 100;
        }
        const currentTime = Date.now();
        const base64Image = value.deliveryManSignature; // Assuming userSignature is a base64 image
        const prefixFilename = `${currentTime}`;
        fetch(process.env.IMAGE_STORAGE_UPLOAD_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                base64Image: base64Image,
                prefixfilename: prefixFilename,
            }),
        });
        console.log(chargeofDeliveryBoy, 'chargeofDeliveryBoy');
        yield billing_Schema_1.default.updateOne({
            orderId: value.orderId,
            'subOrderdata.subOrderId': value.subOrderId,
        }, {
            $set: {
                'subOrderdata.$.chargePer': chargeofDeliveryBoy,
                'subOrderdata.$.isCashOnDelivery': iscasondelivery,
                'subOrderdata.$.amountOfPackage': (_4 = (_3 = isArrived.deliveryDetails.find((data) => data.subOrderId == value.subOrderId)) === null || _3 === void 0 ? void 0 : _3.paymentCollectionRupees) !== null && _4 !== void 0 ? _4 : 0,
                totalamountOfPackage: (_6 = (_5 = isArrived.deliveryDetails.find((data) => data.subOrderId == value.subOrderId)) === null || _5 === void 0 ? void 0 : _5.paymentCollectionRupees) !== null && _6 !== void 0 ? _6 : 0,
            },
            $inc: {
                totalCharge: chargeofDeliveryBoy,
            },
        });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').orderUpdatedSuccessfully,
        });
    }
    catch (error) {
        console.error('Error in deliverOrder:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error',
        });
    }
});
exports.deliverOrderMulti = deliverOrderMulti;
const OrderAssigneeSchemaData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield orderAssignee_schema_1.default.find();
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
exports.OrderAssigneeSchemaData = OrderAssigneeSchemaData;
const allPaymentInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield paymentInfo_schema_1.default.find();
        res.status(200).json({
            data: data,
        });
    }
    catch (error) {
        console.log('🚀 ~ deliverOrder ~ error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.allPaymentInfo = allPaymentInfo;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params; // Extract orderId from the request parameters
        console.log(orderId);
        const data = yield order_schema_1.default
            .findById(orderId)
            .populate('country')
            .populate('city')
            .populate('vehicle');
        console.log(data, 'data');
        // Set city and country to null
        if (data) {
            data.city = null;
            data.country = null;
        }
        return res.ok({ data: data }); // Return the single order (since it's by ID)
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getOrderById = getOrderById;
const getAllCancelledOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = req.id;
        console.log(Id);
        if (!mongoose_1.default.Types.ObjectId.isValid(Id)) {
            return res.status(400).json({ message: 'Invalid delivery man ID' });
        }
        const data = yield cancelOderbyDeliveryManSchema_1.default.aggregate([
            {
                $match: {
                    deliveryBoy: Id,
                    status: 'CANCELLED',
                },
            },
            {
                $lookup: {
                    from: 'orders', // Collection name in your database
                    localField: 'order', // Field in the cancelOderbyDeliveryMan schema
                    foreignField: 'orderId', // Field in the order collection
                    as: 'order', // Alias for the resulting joined documents
                },
            },
            {
                $lookup: {
                    from: 'merchants',
                    localField: 'order.merchant', // Field in the cancelOderbyDeliveryMan schema
                    foreignField: '_id', // Field in the merchants collection
                    as: 'merchant', // Alias for the resulting joined documents
                },
            },
            {
                $unwind: '$merchant',
            },
            {
                $unwind: '$order', // Flatten the array of orders
            },
            {
                $project: {
                    _id: 1,
                    orderId: '$order.orderId',
                    // new
                    customerMobilNumber: '$order.deliveryDetails.mobileNumber',
                    customerName: '$order.deliveryDetails.name',
                    status: 1,
                    merchantName: '$merchant.name',
                    merchantMobilNumber: '$merchant.contactNumber',
                },
            },
        ]);
        console.log(data);
        return res.ok({ data: data });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getAllCancelledOrders = getAllCancelledOrders;
const getAllCancelledOrdersMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = req.id;
        console.log(Id);
        if (!mongoose_1.default.Types.ObjectId.isValid(Id)) {
            return res.status(400).json({ message: 'Invalid delivery man ID' });
        }
        const data = yield cancelOderbyDeliveryManSchema_1.default.aggregate([
            // { $sort: { createdAt: -1 } },
            {
                $match: {
                    deliveryBoy: Id,
                    status: 'CANCELLED',
                },
            },
            {
                $lookup: {
                    from: 'ordermultis', // Collection name in your database
                    localField: 'order', // Field in the cancelOderbyDeliveryMan schema
                    foreignField: 'orderId', // Field in the order collection
                    as: 'order', // Alias for the resulting joined documents
                },
            },
            {
                $lookup: {
                    from: 'merchants',
                    localField: 'order.merchant', // Field in the cancelOderbyDeliveryMan schema
                    foreignField: '_id', // Field in the merchants collection
                    as: 'merchant', // Alias for the resulting joined documents
                },
            },
            {
                $unwind: '$merchant',
            },
            {
                $unwind: '$order', // Flatten the array of orders
            },
            {
                $group: {
                    _id: '$order.orderId',
                    status: { $first: '$status' },
                    customerdata: {
                        $push: {
                            customerMobilNumber: {
                                $arrayElemAt: ['$order.deliveryDetails.mobileNumber', 0],
                            },
                            customerName: {
                                $arrayElemAt: ['$order.deliveryDetails.name', 0],
                            },
                        },
                    },
                    createdAt: { $first: '$createdAt' },
                    merchantMobilNumber: { $first: '$merchant.contactNumber' },
                },
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $project: {
                    _id: 1,
                    orderId: '$_id',
                    customerdata: 1,
                    status: 1,
                    merchantMobilNumber: 1,
                },
            },
        ]);
        console.log(data);
        return res.ok({ data: data });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getAllCancelledOrdersMulti = getAllCancelledOrdersMulti;
const getPaymentDataForDeliveryBoy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentData = yield paymentGet_schema_1.default
            .find({ deliveryManId: req.id })
            .populate('merchantId', 'name email contactNumber')
            .populate('adminId', 'name email contactNumber');
        console.log(paymentData, 'paymentData');
        return res.ok({ data: paymentData });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getPaymentDataForDeliveryBoy = getPaymentDataForDeliveryBoy;
const getMultiOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _7, _8, _9, _10, _11, _12;
    console.log(req.id, 'req.id');
    try {
        const { startDate, endDate, status, pageLimit = 10, pageCount = 1, } = req.query;
        const allParcelType = (yield parcel_schema_1.default.find()) || [];
        if (status === enum_1.ORDER_HISTORY.CANCELLED) {
        }
        const data = yield orderAssigneeMulti_schema_1.default.aggregate([
            {
                $match: Object.assign({ deliveryBoy: new mongoose_1.default.Types.ObjectId(req.id) }, (startDate &&
                    endDate && {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                })),
            },
            {
                $lookup: {
                    from: 'ordermultis',
                    localField: 'order',
                    foreignField: 'orderId',
                    as: 'orderData',
                },
            },
            {
                $unwind: {
                    path: '$orderData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    'orderData.deliveryDetails': {
                        $cond: {
                            if: { $isArray: '$orderData.deliveryDetails' },
                            then: {
                                $map: {
                                    input: {
                                        $sortArray: {
                                            input: '$orderData.deliveryDetails',
                                            sortBy: { sortOrder: 1 },
                                        },
                                    },
                                    as: 'detail',
                                    in: {
                                        $mergeObjects: [
                                            '$$detail',
                                            {
                                                sortOrder: {
                                                    $add: [
                                                        {
                                                            $switch: {
                                                                branches: [
                                                                    {
                                                                        case: {
                                                                            $eq: [
                                                                                '$$detail.status',
                                                                                enum_1.ORDER_HISTORY.DEPARTED,
                                                                            ],
                                                                        },
                                                                        then: 1,
                                                                    },
                                                                    {
                                                                        case: {
                                                                            $eq: [
                                                                                '$$detail.status',
                                                                                enum_1.ORDER_HISTORY.PICKED_UP,
                                                                            ],
                                                                        },
                                                                        then: 2,
                                                                    },
                                                                    {
                                                                        case: {
                                                                            $eq: [
                                                                                '$$detail.status',
                                                                                enum_1.ORDER_HISTORY.ARRIVED,
                                                                            ],
                                                                        },
                                                                        then: 3,
                                                                    },
                                                                    {
                                                                        case: {
                                                                            $eq: [
                                                                                '$$detail.status',
                                                                                enum_1.ORDER_HISTORY.ASSIGNED,
                                                                            ],
                                                                        },
                                                                        then: 4,
                                                                    },
                                                                    {
                                                                        case: {
                                                                            $eq: [
                                                                                '$$detail.status',
                                                                                enum_1.ORDER_HISTORY.DELIVERED,
                                                                            ],
                                                                        },
                                                                        then: 5,
                                                                    },
                                                                    {
                                                                        case: {
                                                                            $eq: [
                                                                                '$$detail.status',
                                                                                enum_1.ORDER_HISTORY.CANCELLED,
                                                                            ],
                                                                        },
                                                                        then: 5,
                                                                    },
                                                                ],
                                                                default: 6,
                                                            },
                                                        },
                                                    ],
                                                },
                                                distance: {
                                                    $cond: {
                                                        if: { $gt: ['$$detail.distance', 0] },
                                                        then: {
                                                            $round: [
                                                                { $divide: ['$$detail.distance', 1609.34] },
                                                                2,
                                                            ],
                                                        },
                                                        else: 0,
                                                    },
                                                },
                                                // paymentCollectionRupees: {
                                                //   $toString: '$$detail.paymentCollectionRupees'
                                                // }
                                            },
                                        ],
                                    },
                                },
                            },
                            else: '$orderData.deliveryDetails',
                        },
                    },
                },
            },
            {
                $match: Object.assign({}, (status && { 'orderData.status': status })),
            },
            {
                $addFields: {
                    'orderData.totalDeliveredOrders': {
                        $size: {
                            $filter: {
                                input: { $ifNull: ['$orderData.deliveryDetails', []] },
                                as: 'detail',
                                cond: { $eq: ['$$detail.status', enum_1.ORDER_HISTORY.DELIVERED] },
                            },
                        },
                    },
                    'orderData.totalOrders': {
                        $size: { $ifNull: ['$orderData.deliveryDetails', []] },
                    },
                    'orderData.totalParcelsCount': {
                        $sum: { $ifNull: ['$orderData.deliveryDetails.parcelsCount', 0] },
                    },
                },
            },
            {
                $addFields: {
                    'orderData.deliveryDetails': {
                        $cond: {
                            if: {
                                $and: [
                                    { $isArray: '$orderData.route' },
                                    { $isArray: '$orderData.deliveryDetails' },
                                ],
                            },
                            then: {
                                $let: {
                                    vars: {
                                        routedDeliveries: {
                                            $map: {
                                                input: '$orderData.route',
                                                as: 'routeItem',
                                                in: {
                                                    $mergeObjects: [
                                                        {
                                                            $arrayElemAt: [
                                                                {
                                                                    $filter: {
                                                                        input: '$orderData.deliveryDetails',
                                                                        as: 'detail',
                                                                        cond: {
                                                                            $eq: [
                                                                                '$$detail.subOrderId',
                                                                                '$$routeItem.subOrderId',
                                                                            ],
                                                                        },
                                                                    },
                                                                },
                                                                0,
                                                            ],
                                                        },
                                                        {
                                                            distance: {
                                                                $round: [
                                                                    {
                                                                        $divide: [
                                                                            { $ifNull: ['$$routeItem.distance', 0] },
                                                                            1609.34,
                                                                        ],
                                                                    },
                                                                    2, // rounding to 2 decimal places
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                    in: {
                                        $concatArrays: [
                                            '$$routedDeliveries',
                                            {
                                                $filter: {
                                                    input: '$orderData.deliveryDetails',
                                                    as: 'detail',
                                                    cond: {
                                                        $not: {
                                                            $in: [
                                                                '$$detail.subOrderId',
                                                                '$orderData.route.subOrderId',
                                                            ],
                                                        },
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                            else: '$orderData.deliveryDetails',
                        },
                    },
                },
            },
            {
                $addFields: {
                    'orderData.totalUnDeliveredOrders': {
                        $subtract: [
                            { $ifNull: ['$orderData.totalOrders', 0] },
                            { $ifNull: ['$orderData.totalDeliveredOrders', 0] },
                        ],
                    },
                },
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $skip: (Number(pageCount) - 1) * Number(pageLimit),
            },
            {
                $limit: Number(pageLimit),
            },
            {
                $match: {
                    'orderData.status': { $ne: enum_1.ORDER_HISTORY.CANCELLED },
                },
            },
            {
                $project: {
                    'orderData.route': 0,
                },
            },
        ]);
        const Nowdata = data.map((item) => {
            var _a, _b;
            return (Object.assign(Object.assign({}, item), { orderData: Object.assign(Object.assign({}, item === null || item === void 0 ? void 0 : item.orderData), { deliveryDetails: (_b = (_a = item === null || item === void 0 ? void 0 : item.orderData) === null || _a === void 0 ? void 0 : _a.deliveryDetails) === null || _b === void 0 ? void 0 : _b.map((detail) => {
                        var _a;
                        const parcelType = (_a = detail === null || detail === void 0 ? void 0 : detail.parcelType2) === null || _a === void 0 ? void 0 : _a.map((type) => {
                            const foundType = allParcelType.find((e) => { var _a; return ((_a = e._id) === null || _a === void 0 ? void 0 : _a.toString()) == (type === null || type === void 0 ? void 0 : type.toString()); });
                            return foundType ? { label: foundType.label } : null;
                        }).filter(Boolean);
                        detail === null || detail === void 0 ? true : delete detail.parcelType2; // Correctly delete parcelType2 from detail
                        return Object.assign(Object.assign({}, detail), { parcelType });
                    }) }) }));
        });
        console.log(Nowdata, 'Nowdata');
        for (const item of Nowdata) {
            (_8 = (_7 = item === null || item === void 0 ? void 0 : item.orderData) === null || _7 === void 0 ? void 0 : _7.deliveryDetails) === null || _8 === void 0 ? void 0 : _8.sort((a, b) => a.sortOrder - b.sortOrder);
        }
        for (const item of Nowdata) {
            (_10 = (_9 = item === null || item === void 0 ? void 0 : item.orderData) === null || _9 === void 0 ? void 0 : _9.deliveryDetails) === null || _10 === void 0 ? void 0 : _10.forEach((detail, index) => {
                detail.index = index + 1;
            });
        }
        for (const item of Nowdata) {
            (_12 = (_11 = item === null || item === void 0 ? void 0 : item.orderData) === null || _11 === void 0 ? void 0 : _11.deliveryDetails) === null || _12 === void 0 ? void 0 : _12.forEach((detail, index) => {
                var _a, _b, _c, _d;
                if (detail.status == enum_1.ORDER_HISTORY.PICKED_UP) {
                    const nextOrder = (_b = (_a = item === null || item === void 0 ? void 0 : item.orderData) === null || _a === void 0 ? void 0 : _a.deliveryDetails[index + 1]) === null || _b === void 0 ? void 0 : _b.subOrderId;
                    if (((_d = (_c = item === null || item === void 0 ? void 0 : item.orderData) === null || _c === void 0 ? void 0 : _c.deliveryDetails[index + 1]) === null || _d === void 0 ? void 0 : _d.status) ==
                        enum_1.ORDER_HISTORY.PICKED_UP) {
                        detail.nextOrder = nextOrder;
                    }
                }
            });
        }
        return res.ok({
            data: Nowdata || [],
        });
    }
    catch (error) {
        console.error('getMultiOrder error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getMultiOrder = getMultiOrder;
const getMultiOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        console.log('id', id);
        const allParcelType = (yield parcel_schema_1.default.find()) || [];
        const [multiOrder] = yield orderMulti_schema_1.default
            .aggregate([
            { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
            {
                $addFields: {
                    deliveryDetails: {
                        $cond: {
                            if: { $isArray: '$deliveryDetails' },
                            then: {
                                $map: {
                                    input: '$deliveryDetails',
                                    as: 'detail',
                                    in: {
                                        $mergeObjects: [
                                            '$$detail',
                                            {
                                                sortOrder: {
                                                    $switch: {
                                                        branches: [
                                                            {
                                                                case: {
                                                                    $eq: [
                                                                        '$$detail.status',
                                                                        enum_1.ORDER_HISTORY.DEPARTED,
                                                                    ],
                                                                },
                                                                then: 1,
                                                            },
                                                            {
                                                                case: {
                                                                    $eq: [
                                                                        '$$detail.status',
                                                                        enum_1.ORDER_HISTORY.PICKED_UP,
                                                                    ],
                                                                },
                                                                then: 2,
                                                            },
                                                            {
                                                                case: {
                                                                    $eq: [
                                                                        '$$detail.status',
                                                                        enum_1.ORDER_HISTORY.ARRIVED,
                                                                    ],
                                                                },
                                                                then: 3,
                                                            },
                                                            {
                                                                case: {
                                                                    $eq: [
                                                                        '$$detail.status',
                                                                        enum_1.ORDER_HISTORY.DELIVERED,
                                                                    ],
                                                                },
                                                                then: 4,
                                                            },
                                                            {
                                                                case: {
                                                                    $eq: [
                                                                        '$$detail.status',
                                                                        enum_1.ORDER_HISTORY.CANCELLED,
                                                                    ],
                                                                },
                                                                then: 5,
                                                            },
                                                        ],
                                                        default: 6,
                                                    },
                                                },
                                                distance: {
                                                    $cond: {
                                                        if: { $gt: ['$$detail.distance', 0] },
                                                        then: {
                                                            $round: [
                                                                { $divide: ['$$detail.distance', 1609.34] },
                                                                2,
                                                            ],
                                                        },
                                                        else: 0,
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                            else: '$deliveryDetails',
                        },
                    },
                },
            },
            {
                $addFields: {
                    deliveryDetails: {
                        $cond: {
                            if: {
                                $and: [
                                    { $isArray: '$route' },
                                    { $isArray: '$deliveryDetails' },
                                ],
                            },
                            then: {
                                $let: {
                                    vars: {
                                        routedDeliveries: {
                                            $map: {
                                                input: '$route',
                                                as: 'routeItem',
                                                in: {
                                                    $mergeObjects: [
                                                        {
                                                            $arrayElemAt: [
                                                                {
                                                                    $filter: {
                                                                        input: '$deliveryDetails',
                                                                        as: 'detail',
                                                                        cond: {
                                                                            $eq: [
                                                                                '$$detail.subOrderId',
                                                                                '$$routeItem.subOrderId',
                                                                            ],
                                                                        },
                                                                    },
                                                                },
                                                                0,
                                                            ],
                                                        },
                                                        {
                                                            distance: {
                                                                $round: [
                                                                    {
                                                                        $divide: [
                                                                            {
                                                                                $ifNull: ['$$routeItem.distance', 0],
                                                                            },
                                                                            1609.34,
                                                                        ],
                                                                    },
                                                                    2,
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                    in: {
                                        $concatArrays: [
                                            '$$routedDeliveries',
                                            {
                                                $filter: {
                                                    input: '$deliveryDetails',
                                                    as: 'detail',
                                                    cond: {
                                                        $not: {
                                                            $in: [
                                                                '$$detail.subOrderId',
                                                                '$route.subOrderId',
                                                            ],
                                                        },
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                            else: '$deliveryDetails',
                        },
                    },
                },
            },
            {
                $addFields: {
                    totalDeliveredOrders: {
                        $size: {
                            $filter: {
                                input: { $ifNull: ['$deliveryDetails', []] },
                                as: 'detail',
                                cond: { $eq: ['$$detail.status', enum_1.ORDER_HISTORY.DELIVERED] },
                            },
                        },
                    },
                    totalOrders: {
                        $size: { $ifNull: ['$deliveryDetails', []] },
                    },
                    totalParcelsCount: {
                        $sum: { $ifNull: ['$deliveryDetails.parcelsCount', 0] },
                    },
                },
            },
            {
                $addFields: {
                    totalUnDeliveredOrders: {
                        $subtract: [
                            { $ifNull: ['$totalOrders', 0] },
                            { $ifNull: ['$totalDeliveredOrders', 0] },
                        ],
                    },
                },
            },
            {
                $project: {
                    'orderData.route': 0,
                    route: 0,
                },
            },
        ])
            .exec();
        const Nowdata = Object.assign(Object.assign({}, multiOrder), { deliveryDetails: multiOrder.deliveryDetails.map((item) => {
                const parcelType = item.parcelType2
                    .map((type) => {
                    const foundType = allParcelType.find((e) => e._id.toString() == type.toString());
                    return foundType ? { label: foundType.label } : null;
                })
                    .filter(Boolean);
                delete item.parcelType2; // Delete parcelType2 after use
                return Object.assign(Object.assign({}, item), { parcelType });
            }) });
        const oder = yield orderAssigneeMulti_schema_1.default.findOne({
            order: Nowdata.orderId,
        });
        if (oder.deliveryBoy.toString() != req.id.toString()) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidOrder });
        }
        Nowdata.deliveryDetails.sort((a, b) => a.sortOrder - b.sortOrder);
        Nowdata.deliveryDetails.forEach((detail, index) => {
            detail.index = index + 1;
        });
        Nowdata.deliveryDetails.forEach((detail, index) => {
            var _a, _b;
            if (detail.status == enum_1.ORDER_HISTORY.PICKED_UP) {
                const nextOrder = (_a = Nowdata.deliveryDetails[index + 1]) === null || _a === void 0 ? void 0 : _a.subOrderId;
                if (((_b = Nowdata.deliveryDetails[index + 1]) === null || _b === void 0 ? void 0 : _b.status) == enum_1.ORDER_HISTORY.PICKED_UP) {
                    detail.nextOrder = nextOrder;
                }
            }
        });
        return res.ok({ data: Nowdata });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getMultiOrderById = getMultiOrderById;
const getSubOrderData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const subOrderId = req.body.subOrderId;
        console.log(id, subOrderId, 'id, subOrderId');
        const data = yield orderMulti_schema_1.default.findById(id);
        if (!data) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidOrder });
        }
        var subOrderData = data.deliveryDetails.find((item) => item.subOrderId == subOrderId);
        if (!subOrderData) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidSubOrderId });
        }
        const dataofroot = data.route;
        const allParcelType = (yield parcel_schema_1.default.find()) || [];
        const parcelType = subOrderData.parcelType2
            .map((type) => {
            const foundType = allParcelType.find((e) => e._id.toString() == type.toString());
            return foundType ? { label: foundType.label } : null;
        })
            .filter(Boolean);
        const nextOrder = dataofroot.findIndex((item) => item.subOrderId.toString() == subOrderId.toString());
        // delete subOrderData.parcelType2;
        var nextOrderData = null;
        if (nextOrder != -1) {
            nextOrderData = dataofroot[nextOrder + 1];
        }
        const nowdata = Object.assign({ index: subOrderData.index, location: {
                latitude: subOrderData.location.latitude,
                longitude: subOrderData.location.longitude,
            }, subOrderId: subOrderData.subOrderId, address: subOrderData.address, mobileNumber: subOrderData.mobileNumber, name: subOrderData.name, email: subOrderData.email, description: subOrderData.description, postCode: subOrderData.postCode, cashOnDelivery: subOrderData.cashOnDelivery, customerId: subOrderData.customerId, distance: Number(subOrderData.distance.toFixed(2)), duration: subOrderData.duration, parcelsCount: subOrderData.parcelsCount, paymentCollectionRupees: subOrderData.paymentCollectionRupees, status: subOrderData.status, trashed: subOrderData.trashed, parcelType: parcelType }, (nextOrderData && { nextOrder: nextOrderData.subOrderId }));
        // subOrderData.parcelType2 = now.parcelType; // Update parcelType2 with the new object
        return res.ok({ data: nowdata });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getSubOrderData = getSubOrderData;
const logoutdeliveryboy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.id;
        console.log(id, 'id');
        yield deliveryMan_schema_1.default.findByIdAndUpdate(id, {
            isOnline: false,
            deviceToken: '',
        });
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').deliveryManLoggedOut });
    }
    catch (error) {
        console.log('🚀 ~ logout ~ error:', error);
    }
});
exports.logoutdeliveryboy = logoutdeliveryboy;
