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
exports.getAllCancelledOrders = exports.getOrderById = exports.allPaymentInfo = exports.OrderAssigneeSchemaData = exports.deliverOrder = exports.sendEmailOrMobileOtp = exports.pickUpOrder = exports.departOrder = exports.cancelOrder = exports.arriveOrder = exports.acceptOrder = exports.getOederForDeliveryMan = exports.getAssignedOrders = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../../enum");
const languageHelper_1 = require("../../language/languageHelper");
const admin_schema_1 = __importDefault(require("../../models/admin.schema"));
const city_schema_1 = __importDefault(require("../../models/city.schema"));
const deliveryMan_schema_1 = __importDefault(require("../../models/deliveryMan.schema"));
const order_schema_1 = __importDefault(require("../../models/order.schema"));
const orderAssignee_schema_1 = __importDefault(require("../../models/orderAssignee.schema"));
const orderHistory_schema_1 = __importDefault(require("../../models/orderHistory.schema"));
const otp_schema_1 = __importDefault(require("../../models/otp.schema"));
const paymentInfo_schema_1 = __importDefault(require("../../models/paymentInfo.schema"));
const productCharges_schema_1 = __importDefault(require("../../models/productCharges.schema"));
const cancelOderbyDeliveryManSchema_1 = __importDefault(require("../../models/cancelOderbyDeliveryManSchema"));
const common_1 = require("../../utils/common");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const order_validation_1 = require("../../utils/validation/order.validation");
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
        // console.log(req.id, 'req.id', typeof req.id);
        // const demo = await OrderHistorySchema.find({
        //   status: ORDER_HISTORY.ARRIVED,
        //   deliveryBoy: req.id.toString() // Convert to string to match schema type
        // });
        // console.log(demo, 'demo');
        // Aggregation pipeline with pagination
        const data1 = yield orderAssignee_schema_1.default.aggregate([
            {
                $sort: { createdAt: -1 },
            },
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
                        paymentCollectionRupees: '$orderData.paymentCollectionRupees',
                    },
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
                        paymentCollectionRupees: '$paymentCollectionRupees',
                    },
                },
            },
            {
                $match: Object.assign({}, matchCondition),
            },
            {
                $match: {
                    status: { $ne: "UNASSIGNED" }
                }
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
        const tampdestens = 3.2;
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
        yield order_schema_1.default.findOneAndUpdate({ orderId: value.orderId }, {
            $set: {
                status: enum_1.ORDER_HISTORY.ARRIVED,
                time: {
                    start: Date.now(),
                },
            },
            $inc: { distance: tampdestens },
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
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                $in: [enum_1.ORDER_HISTORY.CREATED, enum_1.ORDER_HISTORY.ASSIGNED, enum_1.ORDER_HISTORY.ARRIVED],
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
        const otpData = yield otp_schema_1.default.findOne({
            value: value.otp,
            customerEmail: isArrived.pickupDetails.email,
            expiry: { $gte: Date.now() },
        });
        if (!otpData) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').otpExpired });
        }
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
        const otpData = yield otp_schema_1.default.findOne({
            value: value.otp,
            customerEmail: isArrived.deliveryDetails.email,
            expiry: { $gte: Date.now() },
        });
        console.log('OTP Data:', otpData);
        if (!otpData) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').otpExpired });
        }
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
            const hour = timeTaken / 3600000;
            // charge per hour
            chargeofDeliveryBoy = hour * DeliveryMan.charge;
            console.log(`Charge: ${chargeofDeliveryBoy}`);
            console.log(`Time taken: ${timeTaken} ms`);
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
                $inc: { balance: adminCommission }
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
                }
            },
            {
                $unwind: "$merchant",
            },
            {
                $unwind: "$order", // Flatten the array of orders
            },
            {
                $project: {
                    _id: 1,
                    orderId: "$order.orderId",
                    // new
                    customerMobilNumber: "$order.deliveryDetails.mobileNumber",
                    customerName: "$order.deliveryDetails.name",
                    status: 1,
                    merchantName: "$merchant.name",
                    merchantMobilNumber: "$merchant.contactNumber"
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
