import { query, Response } from 'express';
import mongoose, { PipelineStage } from 'mongoose';
import {
  CHARGE_METHOD,
  CHARGE_TYPE,
  ORDER_HISTORY,
  ORDER_REQUEST,
  ORDER_STATUS,
  PAYMENT_INFO,
  PAYMENT_TYPE,
  TRANSACTION_TYPE,
} from '../../enum';
import { getLanguage } from '../../language/languageHelper';
import AdminSchema from '../../models/admin.schema';
import CitySchema from '../../models/city.schema';
import orderSchemaMulti from '../../models/orderMulti.schema';
import DeliveryManSchema from '../../models/deliveryMan.schema';
import orderSchema from '../../models/order.schema';
import OrderAssigneeSchema from '../../models/orderAssignee.schema';
import OrderAssigneeSchemaMulti from '../../models/orderAssigneeMulti.schema';
import OrderHistorySchema from '../../models/orderHistory.schema';
import otpSchema from '../../models/otp.schema';
import PaymentInfoSchema from '../../models/paymentInfo.schema';
import ProductChargesSchema from '../../models/productCharges.schema';
import cancelOderbyDeliveryMan from '../../models/cancelOderbyDeliveryManSchema';

import {
  createNotification,
  emailOrMobileOtp,
  generateIntRandomNo,
  getMongoCommonPagination,
  sendMailService,
  updateWallet,
  uploadFile,
} from '../../utils/common';
import { RequestParams } from '../../utils/types/expressTypes';
import validateParamsWithJoi from '../../utils/validateRequest';
import {
  orderAcceptValidation,
  orderArriveValidation,
  orderArriveValidationMulti,
  orderCancelMultiValidation,
  orderCancelValidation,
  orderDeliverValidation,
  orderDeliverValidationMulti,
  orderIdValidation,
  orderIdValidationForDelivery,
  orderListByDeliveryManValidation,
  orderPickUpValidation,
} from '../../utils/validation/order.validation';
import {
  OrderAcceptType,
  OrderAcceptTypeMulti,
  OrderCancelType,
  OrderCancelTypeMultiSubOrder,
  OrderDeliverType,
  OrderDeliverTypeMulti,
  OrderPickUpType,
} from './types/order';
import paymentGetSchema from '../../models/paymentGet.schema';
import axios from 'axios';

export const getAssignedOrders = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<
      {
        status?: ORDER_STATUS;
        startDate?: string;
        endDate?: string;
      } & IPagination
    >(req.query, orderListByDeliveryManValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const query: any = {
      deliveryBoy: new mongoose.Types.ObjectId(req.id),
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
    const data1 = await OrderAssigneeSchema.aggregate([
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
      totalCount: data1[0].totalCount[0]?.count || 0,
    };
    // Calculate total count for pagination
    const totalCount = await OrderAssigneeSchema.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / pageLimit);

    return res.ok({
      data,
    });
  } catch (error) {
    // Handle errors and send failure response
    console.error('Error occurred: ', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getAssignedOrdersMulti = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const validateRequest = validateParamsWithJoi<
      {
        status?: ORDER_STATUS;
        startDate?: string;
        endDate?: string;
      } & IPagination
    >(req.query, orderListByDeliveryManValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const query: any = {
      deliveryBoy: new mongoose.Types.ObjectId(req.id),
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

    const pipeline: PipelineStage[] = [
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

    const result = await OrderAssigneeSchemaMulti.find({
      deliveryBoy: new mongoose.Types.ObjectId(req.id),
    });
    // console.log(result, 'result');

    // const data = {
    //   data: result[0]?.data || [],
    //   totalCount: result[0]?.totalCount[0]?.count || 0,
    // };
    const data = await OrderAssigneeSchemaMulti.aggregate(pipeline);
    console.log(data, 'data');

    return res.ok({ data });
  } catch (error) {
    console.error('Error occurred: ', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getOederForDeliveryMan = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const {
      startDate,
      endDate,
      status,
      pageCount = 1,
      pageLimit = 10,
    } = req.query; // Add pageCount and pageLimit params

    // Calculate pagination values
    const pageNumber = parseInt(pageCount as string);
    const pageLimitt = parseInt(pageLimit as string);
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
    const matchCondition = {
      'order.deliveryManId': new mongoose.Types.ObjectId(req.id),
      ...statusFilter,
      ...dateFilter,
    };
    console.log(matchCondition);

    const data1 = await orderSchema.aggregate([
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
        $match: {
          ...matchCondition,
        },
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
      totalCount: data1[0].totalCount[0]?.count || 0,
    };

    // Get total count for pagination
    const totalCount = await orderSchema.countDocuments(matchCondition);
    const totalPages = Math.ceil(totalCount / pageLimitt);

    return res.ok({
      data,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const acceptOrder = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<OrderAcceptType>(
      req.body,
      orderAcceptValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    value.deliveryManId = req.id.toString();

    const isCreated = await orderSchema.findOne({
      orderId: value.orderId,
      status: {
        $in: [
          ORDER_HISTORY.CREATED,
          ORDER_HISTORY.ASSIGNED,
          ORDER_HISTORY.UNASSIGNED,
        ],
      },
    });
    console.log(isCreated, 'isCreated');

    if (!isCreated) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    const isAssigned = await OrderAssigneeSchema.findOne({
      order: value.orderId,
      deliveryBoy: value.deliveryManId,
    });

    if (!isAssigned) {
      return res.badRequest({
        message: getLanguage('en').orderAlreadyAssigned,
      });
    }

    await OrderAssigneeSchema.findByIdAndUpdate(isAssigned._id, {
      $set: { status: value.status },
    });
    await paymentGetSchema.findOneAndUpdate(
      { orderId: value.orderId },
      { $set: { statusOfOrder: 'ACCEPTED' } },
    );
    if (value.status === ORDER_REQUEST.ACCEPTED) {
      await orderSchema.findOneAndUpdate(
        { orderId: value.orderId },
        {
          $set: {
            status: ORDER_HISTORY.ASSIGNED,
          },
        },
      );

      const data = await DeliveryManSchema.findById(value.deliveryManId, {
        _id: 0,
        name: 1,
      });

      await OrderHistorySchema.create({
        message: `Your order ${value.orderId} has been assigned to ${data.firstName}`,
        order: value.orderId,
        status: ORDER_HISTORY.ASSIGNED,
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
      message: getLanguage('en').orderUpdatedSuccessfully,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const arriveOrder = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<OrderAcceptType>(
      req.body,
      orderArriveValidation,
    );
    // TODO: get distance from google map api

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    value.deliveryManId = req.id.toString();

    const isCreated = await orderSchema.findOne({
      orderId: value.orderId,
      status: { $eq: ORDER_HISTORY.ASSIGNED },
    });

    if (!isCreated) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    const isAssigned = await OrderAssigneeSchema.findOne({
      order: value.orderId,
      deliveryBoy: value.deliveryManId,
    });

    if (!isAssigned) {
      return res.badRequest({
        message: getLanguage('en').invalidDeliveryMan,
      });
    }
    // TODO: add distance to the order

    await paymentGetSchema.findOneAndUpdate(
      { orderId: value.orderId },
      { $set: { statusOfOrder: 'ARRIVED' } },
    );
    await orderSchema.findOneAndUpdate(
      { orderId: value.orderId },
      {
        $set: {
          status: ORDER_HISTORY.ARRIVED,
          time: {
            start: Date.now(),
          },
        },
      },
    );

    await OrderHistorySchema.create({
      message: `Your order ${value.orderId} has been arrived`,
      order: value.orderId,
      status: ORDER_HISTORY.ARRIVED,
      merchantID: isCreated.merchant,
      deliveryBoy: value.deliveryManId,
    });
    await OrderHistorySchema.deleteOne({
      order: value.orderId,
      status: ORDER_HISTORY.ASSIGNED,
    });

    // await createNotification({
    //   userId: isCreated.merchant,
    //   orderId: isCreated.orderId,
    //   title: 'Order Arrived',
    //   message: `Your order ${isCreated.orderId} has been arrived`,
    //   type: 'MERCHANT',
    // });

    return res.ok({
      message: getLanguage('en').orderUpdatedSuccessfully,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const arriveOrderMulti = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<OrderAcceptTypeMulti>(
      req.body,
      orderArriveValidationMulti,
    );
    // TODO: get distance from google map api

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;
    console.log(value);

    value.deliveryManId = req.id.toString();

    const isCreated = await orderSchemaMulti.findOne({
      orderId: value.orderId,
      status: { $eq: ORDER_HISTORY.ASSIGNED },
      deliveryDetails: {
        $elemMatch: {
          status: { $eq: ORDER_HISTORY.ASSIGNED }, // Match the specific status
        },
      },
    });

    if (!isCreated) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    const isAssigned = await OrderAssigneeSchemaMulti.findOne({
      order: value.orderId,
      deliveryBoy: value.deliveryManId,
    });

    if (!isAssigned) {
      return res.badRequest({
        message: getLanguage('en').invalidDeliveryMan,
      });
    }
    // TODO: add distance to the order
    console.log('fgsdfsdfsdhiffh 1');

    await paymentGetSchema.findOneAndUpdate(
      { orderId: value.orderId },
      { $set: { statusOfOrder: 'ARRIVED' } },
    );
    await orderSchemaMulti.updateOne(
      {
        orderId: value.orderId, // Match the document by `orderId`
      },
      {
        $set: {
          status: ORDER_HISTORY.ARRIVED,
          'deliveryDetails.$[].status': ORDER_HISTORY.ARRIVED, // Update all elements
          'deliveryDetails.$[].time.start': Date.now(), // Update all elements' time.start
        },
      },
    );

    console.log('fgsdfsdfsdhiffh');

    await OrderHistorySchema.create({
      message: `Your order ${value.orderId} has been arrived`,
      order: value.orderId,
      status: ORDER_HISTORY.ARRIVED,
      merchantID: isCreated.merchant,
      deliveryBoy: value.deliveryManId,
    });
    await OrderHistorySchema.deleteOne({
      order: value.orderId,
      status: ORDER_HISTORY.ASSIGNED,
    });

    // await createNotification({
    //   userId: isCreated.merchant,
    //   orderId: isCreated.orderId,
    //   title: 'Order Arrived',
    //   message: `Your order ${isCreated.orderId} has been arrived`,
    //   type: 'MERCHANT',
    // });

    return res.ok({
      message: getLanguage('en').orderUpdatedSuccessfully,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const cancelOrder = async (req: RequestParams, res: Response) => {
  console.log(req.body, 'order cancel');
  try {
    const validateRequest = validateParamsWithJoi<OrderCancelType>(
      req.body,
      orderCancelValidation, // Ensure you have a validation schema for order cancellation
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    value.deliveryManId = req.id.toString();

    // Check if the order exists and is not yet completed
    const existingOrder = await orderSchema.findOne({
      orderId: value.orderId,
      status: {
        $in: [
          ORDER_HISTORY.CREATED,
          ORDER_HISTORY.ASSIGNED,
          ORDER_HISTORY.ARRIVED,
        ],
      },
    });
    console.log(existingOrder, 'First');

    if (!existingOrder) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    // Check if the delivery man is assigned to the order
    const isAssigned = await OrderAssigneeSchema.findOne({
      order: value.orderId,
      deliveryBoy: value.deliveryManId,
    });
    console.log(isAssigned, 'Secound');

    if (!isAssigned) {
      return res.badRequest({
        message: getLanguage('en').orderNotAssignedToYou,
      });
    }

    // Update the order status to canceled
    await orderSchema.findOneAndUpdate(
      { orderId: value.orderId },
      {
        $set: {
          status: ORDER_HISTORY.UNASSIGNED,
          time: {
            end: Date.now(),
          },
        },
      },
    );
    console.log('Third');
    // Update the assignee status (if needed)
    await OrderAssigneeSchema.findByIdAndUpdate(isAssigned._id, {
      // $set: {
      status: ORDER_REQUEST.REJECT,
      // deliveryBoy: '',
      // },
    });

    console.log('Four');
    const history = await OrderHistorySchema.find({
      order: value.orderId,
      status: ORDER_HISTORY.ASSIGNED,
    });
    console.log(
      history,
      'Fivedsjsdvsdhjfsdvfsdfjkfsdvf',
      existingOrder.merchant,
    );
    await OrderHistorySchema.deleteMany({
      // message: `Order ${value.orderId} has been canceled by the delivery man`,
      order: value.orderId,
      status: ORDER_HISTORY.ASSIGNED,
      merchantID: existingOrder.merchant,
    });

    const history1 = await OrderHistorySchema.find({
      order: value.orderId,
      status: ORDER_HISTORY.ASSIGNED,
    });
    console.log(history1, 'Sixxxxxxxxxxxxxxxxxxxxxx');
    // Record the cancellation in the order history
    await OrderHistorySchema.create({
      message: `Order ${value.orderId} has been canceled by the delivery man.`,
      order: value.orderId,
      status: ORDER_HISTORY.UNASSIGNED,
      merchantID: existingOrder.merchant,
      deliveryBoy: value.deliveryManId,
    });

    // TODO: send cancellation email to the customer and delivery man

    await cancelOderbyDeliveryMan.create({
      deliveryBoy: value.deliveryManId,
      order: value.orderId,
    });

    await paymentGetSchema.findOneAndUpdate(
      { orderId: value.orderId },
      { $set: { statusOfOrder: 'CANCELLED' } },
    );
    await sendMailService(
      existingOrder.pickupDetails.email,
      'Cancel Order ',
      'Your order is cancelled by deliveryman plz assign order other deliveryman',
    );
    console.log('Seaven');

    await createNotification({
      userId: existingOrder.merchant,
      orderId: existingOrder.orderId,
      title: 'Order Cancelled',
      message: `Your order ${existingOrder.orderId} has been cancelled by deliveryman`,
      type: 'MERCHANT',
    });
    return res.ok({
      message: getLanguage('en').orderCancelledSuccessfully,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const cancelMultiOrder = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<OrderCancelType>(
      req.body,
      orderCancelValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;
    console.log(value, 'value');
    value.deliveryManId = req.id.toString();
    console.log(value, 'value.orderId');

    // Check if the order exists and is not yet completed
    const existingOrder = await orderSchemaMulti.findOne({
      orderId: value.orderId,
      // 'deliveryDetails.subOrderId': value.subOrderId,
      'deliveryDetails.status': {
        $in: [
          ORDER_HISTORY.CREATED,
          ORDER_HISTORY.ASSIGNED,
          ORDER_HISTORY.ARRIVED,
          ORDER_HISTORY.PICKED_UP,
          ORDER_HISTORY.DEPARTED,
        ],
      },
    });
    console.log(existingOrder, 'First');
    if (!existingOrder) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    // Check if the delivery man is assigned to the order
    const isAssigned = await OrderAssigneeSchemaMulti.findOne({
      order: value.orderId,
      deliveryBoy: value.deliveryManId,
    });
    console.log(isAssigned, 'Secound');

    if (!isAssigned) {
      return res.badRequest({
        message: getLanguage('en').orderNotAssignedToYou,
      });
    }

    // Update the order status to canceled
    await orderSchemaMulti.findOneAndUpdate(
      {
        orderId: value.orderId,
        'deliveryDetails.subOrderId': value.orderId,
      },
      {
        $set: {
          'deliveryDetails.$.status': ORDER_HISTORY.UNASSIGNED,
          'deliveryDetails.$.time.end': Date.now(),
        },
      },
    );
    console.log('Third');

    // Update the assignee status
    await OrderAssigneeSchemaMulti.findByIdAndUpdate(isAssigned._id, {
      status: ORDER_REQUEST.REJECT,
    });

    await orderSchemaMulti.findOneAndUpdate(
      { orderId: value.orderId },
      {
        $set: {
          status: ORDER_HISTORY.UNASSIGNED,
        },
      },
    );

    console.log('Four');
    const history = await OrderHistorySchema.find({
      order: value.orderId,
      status: ORDER_HISTORY.ASSIGNED,
    });
    console.log(
      history,
      'Fivedsjsdvsdhjfsdvfsdfjkfsdvf',
      existingOrder.merchant,
    );
    await OrderHistorySchema.deleteMany({
      order: value.orderId,
      status: ORDER_HISTORY.ASSIGNED,
      merchantID: existingOrder.merchant,
    });

    const history1 = await OrderHistorySchema.find({
      order: value.orderId,
      status: ORDER_HISTORY.ASSIGNED,
    });
    console.log(history1, 'Sixxxxxxxxxxxxxxxxxxxxxx');

    // Record the cancellation in the order history
    await OrderHistorySchema.create({
      message: `Order ${value.orderId} has been canceled by the delivery man.`,
      order: value.orderId,
      status: ORDER_HISTORY.UNASSIGNED,
      merchantID: existingOrder.merchant,
      deliveryBoy: value.deliveryManId,
    });

    await cancelOderbyDeliveryMan.create({
      deliveryBoy: value.deliveryManId,
      order: value.orderId,
    });

    await paymentGetSchema.findOneAndUpdate(
      { orderId: value.orderId },
      { $set: { statusOfOrder: 'CANCELLED' } },
    );

    await sendMailService(
      existingOrder.pickupDetails.email,
      'Cancel Order ',
      'Your order is cancelled by deliveryman plz assign order other deliveryman',
    );
    console.log('Seaven');

    await createNotification({
      userId: existingOrder.merchant,
      orderId: existingOrder.orderId,
      title: 'Order Cancelled',
      message: `Order ${existingOrder.orderId} has been cancelled by deliveryman`,
      type: 'MERCHANT',
    });

    return res.ok({
      message: getLanguage('en').orderCancelledSuccessfully,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const cancelMultiSubOrder = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const validateRequest = validateParamsWithJoi<OrderCancelTypeMultiSubOrder>(
      req.body,
      orderCancelMultiValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;
    value.deliveryManId = req.id.toString();

    // Check if the order exists and is not yet completed
    const existingOrder = await orderSchemaMulti.findOne({
      orderId: value.orderId,
      'deliveryDetails.status': {
        $in: [
          ORDER_HISTORY.CREATED,
          ORDER_HISTORY.ASSIGNED,
          ORDER_HISTORY.ARRIVED,
          ORDER_HISTORY.PICKED_UP,
          ORDER_HISTORY.DEPARTED,
        ],
      },
    });
    console.log(existingOrder, 'existingOrder');
    if (!existingOrder) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    console.log(existingOrder, 'First');
    const isAssigned = await OrderAssigneeSchemaMulti.findOne({
      order: value.orderId,
      deliveryBoy: value.deliveryManId,
    });
    console.log(isAssigned, 'Secound');

    if (!isAssigned) {
      return res.badRequest({
        message: getLanguage('en').orderNotAssignedToYou,
      });
    }

    const nowdata = existingOrder;
    // console.log(value.subOrderId, 'value');
    nowdata.deliveryDetails.map((item) => {
      if (item.subOrderId == value.subOrderId) {
        if (item.status !== ORDER_HISTORY.CANCELLED) {
          item.status = ORDER_HISTORY.CANCELLED;
        } else {
          return res.badRequest({
            message: getLanguage('en').orderAlreadyCancelled,
          });
        }
      }
    });
    console.log(nowdata, 'nowdata');

    const newoder = await orderSchemaMulti.findOneAndUpdate(
      { orderId: value.orderId },
      { $set: { deliveryDetails: nowdata.deliveryDetails } },
      { new: true },
    );
    if (newoder) {
      console.log(value.reason, 'value.reason');
      await cancelOderbyDeliveryMan.create({
        deliveryBoy: value.deliveryManId,
        order: value.orderId,
        subOrderId: value.subOrderId,
        reason: value.reason,
      });
    }
    await OrderHistorySchema.deleteMany({
      order: value.orderId,
      subOrderId: value.subOrderId,
      merchantID: existingOrder.merchant,
    });

    await OrderHistorySchema.create({
      message: `Order ${value.orderId} has been canceled by the delivery man.`,
      order: value.orderId,
      subOrderId: value.subOrderId,
      status: ORDER_HISTORY.UNASSIGNED,
      merchantID: existingOrder.merchant,
      deliveryBoy: value.deliveryManId,
    });

    // const oderdata = await orderSchemaMulti.findOne({
    const oderdata = await orderSchemaMulti.findOne({
      orderId: value.orderId,
      // 'deliveryDetails.subOrderId': value.subOrderId,
    });
    console.log(oderdata, 'oderdata');
    // IF ALL ODER IN CANCELLED OR DELIVERED THEN TRUE ELSE FALSE
    const isalloderdelevever = oderdata.deliveryDetails.every(
      (item) =>
        item.status === ORDER_HISTORY.CANCELLED ||
        item.status === ORDER_HISTORY.DELIVERED,
    );

    console.log(isalloderdelevever, 'isalloderdelevever');

    return res.ok({
      message: getLanguage('en').orderCancelledSuccessfully,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const departOrder = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<OrderAcceptType>(
      req.body,
      orderArriveValidation,
    );
    // TODO: get distance from google map api
    const tampdestens = 3.1;

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    value.deliveryManId = req.id.toString();

    const isCreated = await orderSchema.findOne({
      orderId: value.orderId,
      status: { $eq: ORDER_HISTORY.PICKED_UP },
    });

    if (!isCreated) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    const isAssigned = await OrderAssigneeSchema.findOne({
      order: value.orderId,
      deliveryBoy: value.deliveryManId,
    });

    if (!isAssigned) {
      return res.badRequest({
        message: getLanguage('en').invalidDeliveryMan,
      });
    }

    await orderSchema.findOneAndUpdate(
      { orderId: value.orderId },
      {
        $set: { status: ORDER_HISTORY.DEPARTED },
        $inc: { distance: tampdestens },
      },
    );

    await OrderHistorySchema.create({
      message: `Your order ${value.orderId} has been out for delivery`,
      order: value.orderId,
      status: ORDER_HISTORY.DEPARTED,
      merchantID: isCreated.merchant,
      deliveryBoy: value.deliveryManId,
    });

    await OrderHistorySchema.deleteOne({
      order: value.orderId,
      status: ORDER_HISTORY.PICKED_UP,
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
      message: getLanguage('en').orderUpdatedSuccessfully,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const departOrderMulti = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<OrderAcceptTypeMulti>(
      req.body,
      orderArriveValidationMulti,
    );
    // TODO: get distance from google map api

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;
    console.log(value);

    value.deliveryManId = req.id.toString();

    const isCreated = await orderSchemaMulti.findOne({
      orderId: value.orderId,
      status: { $eq: ORDER_HISTORY.PICKED_UP },
      deliveryDetails: {
        $elemMatch: {
          status: { $eq: ORDER_HISTORY.PICKED_UP },
          subOrderId: value.subOrderId,
        },
      },
    });

    if (!isCreated) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    const isAssigned = await OrderAssigneeSchemaMulti.findOne({
      order: value.orderId,
      deliveryBoy: value.deliveryManId,
    });

    if (!isAssigned) {
      return res.badRequest({
        message: getLanguage('en').invalidDeliveryMan,
      });
    }

    await orderSchemaMulti.findOneAndUpdate(
      {
        orderId: value.orderId,
        'deliveryDetails.subOrderId': value.subOrderId,
      },
      {
        $set: {
          'deliveryDetails.$.status': ORDER_HISTORY.DEPARTED, // Update all elements
          'deliveryDetails.$.time.start': Date.now(), // Update all elements' time.start
        },
      },
    );

    await OrderHistorySchema.create({
      message: `Your order ${value.orderId} has been out for delivery`,
      order: value.orderId,
      subOrderId: value.subOrderId,
      status: ORDER_HISTORY.DEPARTED,
      merchantID: isCreated.merchant,
      deliveryBoy: value.deliveryManId,
    });

    await OrderHistorySchema.deleteOne({
      order: value.orderId,
      subOrderId: value.subOrderId,
      status: ORDER_HISTORY.PICKED_UP,
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
      message: getLanguage('en').orderUpdatedSuccessfully,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const pickUpOrder = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<OrderPickUpType>(
      req.body,
      orderPickUpValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }
    // TODO: get distance from google map api
    const tampdestens = 1.2;

    const { value } = validateRequest;
    console.log(value, 'value');

    const isArrived = await orderSchema.findOne({
      orderId: value.orderId,
      status: ORDER_HISTORY.ARRIVED,
    });

    if (!isArrived) {
      return res.badRequest({ message: getLanguage('en').errorOrderArrived });
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

    await orderSchema.findOneAndUpdate(
      { orderId: value.orderId },
      {
        $set: {
          'pickupDetails.userSignature': value.userSignature,
          'pickupDetails.orderTimestamp': value.pickupTimestamp,
          status: ORDER_HISTORY.PICKED_UP,
        },
        $inc: { distance: tampdestens },
      },
    );

    await paymentGetSchema.findOneAndUpdate(
      { orderId: value.orderId },
      { $set: { statusOfOrder: 'PICKED_UP' } },
      { new: true },
    );

    // if (isArrived.cashOnDelivery) {
    //   await PaymentInfoSchema.updateOne(
    //     { order: value.orderId },
    //     { $set: { status: PAYMENT_INFO.SUCCESS } },
    //   );
    // }

    await OrderHistorySchema.create({
      message:
        'Delivery Person has been arrived at pick up location and waiting for client',
      order: value.orderId,
      status: ORDER_HISTORY.PICKED_UP,
      merchantID: isArrived.merchant,
    });
    await OrderHistorySchema.deleteOne({
      order: value.orderId,
      status: ORDER_HISTORY.ARRIVED,
    });

    // await createNotification({
    //   userId: isArrived.merchant,
    //   orderId: isArrived.orderId,
    //   title: 'Order Picked Up',
    //   message: `Your order ${isArrived.orderId} has been picked up`,
    //   type: 'MERCHANT',
    // });

    return res.ok({
      message: getLanguage('en').orderUpdatedSuccessfully,
    });
  } catch (error) {
    console.log('error', error);

    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const pickUpOrderMulti = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<OrderPickUpType>(
      req.body,
      orderPickUpValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }
    // TODO: get distance from google map api

    const { value } = validateRequest;

    // Get already picked up orders
    const order = await orderSchemaMulti.findOne({ orderId: value.orderId });
    const allDeliveryDetails = order.deliveryDetails;
    const arrayofpickupoder = allDeliveryDetails.filter(
      (detail) => detail.status === ORDER_HISTORY.PICKED_UP,
    );

    // Filter out already picked up orders
    const newSubOrderIds = value.subOrderId.filter(
      (subId) => !arrayofpickupoder.find((order) => order.subOrderId === subId),
    );

    const pickupLocation = order.pickupDetails.location;
    const deliveryLocations = allDeliveryDetails.filter((detail) => 
      newSubOrderIds.includes(detail.subOrderId)
    );

    const apiKey = 'AIzaSyDB4WPFybdVL_23rMMOAcqIEsPaSsb-jzo';
    const optimizedRoute: any = [];
    let currentLocation = pickupLocation;

    // Find optimal route by getting nearest location each time
    while (optimizedRoute.length < newSubOrderIds.length) {
      let shortestDistance = Infinity;
      let nearestLocation = null;
      
      // Find nearest unvisited location from current position
      for (const delivery of deliveryLocations) {
        if (optimizedRoute.find((d:any) => d.subOrderId === delivery.subOrderId)) {
          continue;
        }

        const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
          params: {
            origins: `${currentLocation.latitude},${currentLocation.longitude}`,
            destinations: `${delivery.location.latitude},${delivery.location.longitude}`,
            key: apiKey
          }
        });
        // console.log(response.data.rows[0].elements[0],'response.data')

        const distance = response.data?.rows[0]?.elements[0]?.distance?.value??0;
        console.log(distance,'distance')
        console.log(shortestDistance,'shortestDistance')
        
        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearestLocation = {
            subOrderId: delivery.subOrderId,
            location: delivery.location,
            distance: distance
          };
        }
      }

      optimizedRoute.push(nearestLocation);
      currentLocation = nearestLocation.location;
    }

    const newallDeliveryDetails= optimizedRoute.forEach((data:any)=>{
      if(newSubOrderIds.includes(data.subOrderId)){ 
        allDeliveryDetails.find((detail:any)=> detail.subOrderId === data.subOrderId).status= ORDER_HISTORY.PICKED_UP
      }
    })
    console.log(newallDeliveryDetails,'newallDeliveryDetails')


    // const leftOverDeliveryDetails= allDeliveryDetails.filter((detail:any)=> !newallDeliveryDetails.includes(detail))

    // newallDeliveryDetails.push(...leftOverDeliveryDetails)

    console.log('Optimized delivery route:', optimizedRoute);





    if (newSubOrderIds.length === 0) {
      return res.badRequest({ message: getLanguage('en').errorOrderPickedUp });
    }

    const isArrived = await orderSchemaMulti.findOne({
      orderId: value.orderId,
      deliveryDetails: {
        $elemMatch: {
          status: ORDER_HISTORY.ARRIVED,
          subOrderId: { $in: newSubOrderIds },
        },
      },
    });

    if (!isArrived) {
      return res.badRequest({ message: getLanguage('en').errorOrderPickedUp });
    }

    const remainingDeliveryDetails = allDeliveryDetails.filter(
      (detail) => !newSubOrderIds.includes(detail.subOrderId),
    );

    const allPickedUp = remainingDeliveryDetails.every(
      (detail) => detail.status === ORDER_HISTORY.PICKED_UP,
    );



  
    await orderSchemaMulti.findOneAndUpdate(
      { orderId: value.orderId },
      {
        $set: {
          status: allPickedUp ? ORDER_HISTORY.PICKED_UP : isArrived.status,
          'pickupDetails.userSignature': value.userSignature,
          'pickupDetails.orderTimestamp': value.pickupTimestamp,
          'deliveryDetails.$[elem].status': ORDER_HISTORY.PICKED_UP,
          // 'deliveryDetails':deliveryDetails,
          route: optimizedRoute,
        },
      },
      {
        arrayFilters: [{ 'elem.subOrderId': { $in: newSubOrderIds } }],
      },
    );

    await paymentGetSchema.findOneAndUpdate(
      { orderId: value.orderId },
      { $set: { statusOfOrder: 'PICKED_UP' } },
      { new: true },
    );

    // if (isArrived.cashOnDelivery) {
    //   await PaymentInfoSchema.updateOne(
    //     { order: value.orderId },
    //     { $set: { status: PAYMENT_INFO.SUCCESS } },
    //   );
    // }

    newSubOrderIds.forEach(async (subOrderId) => {
      await OrderHistorySchema.create({
        message:
          'Delivery Person has been arrived at pick up location and waiting for client',
        order: value.orderId,
        subOrderId: subOrderId,
        status: ORDER_HISTORY.PICKED_UP,
        merchantID: isArrived.merchant,
      });

      await OrderHistorySchema.deleteOne({
        order: value.orderId,
        subOrderId: subOrderId,
        status: ORDER_HISTORY.ARRIVED,
      });
    });

    // await createNotification({
    //   userId: isArrived.merchant,
    //   orderId: isArrived.orderId,
    //   title: 'Order Picked Up',
    //   message: `Your order ${isArrived.orderId} has been picked up`,
    //   type: 'MERCHANT',
    // });

    return res.ok({
      message: getLanguage('en').orderUpdatedSuccessfully,
    });
  } catch (error) {
    console.log('error', error);

    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const sendEmailOrMobileOtp = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      orderId: number;
    }>(req.body, orderIdValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const orderExist = await orderSchema.findOne({
      orderId: value.orderId,
      status: { $ne: ORDER_HISTORY.DELIVERED },
    });

    if (!orderExist) {
      return res.badRequest({
        message: getLanguage('en').invalidOrder,
      });
    }

    const otp = generateIntRandomNo(111111, 999999);

    if (orderExist.status === ORDER_HISTORY.ARRIVED) {
      await emailOrMobileOtp(
        orderExist.pickupDetails.email,
        `This is your otp for identity verification ${otp}`,
      );
    } else if (orderExist.status === ORDER_HISTORY.DEPARTED) {
      await emailOrMobileOtp(
        orderExist.deliveryDetails.email,
        `This is your otp for identity verification ${otp}`,
      );
    }

    const isAtPickUp = orderExist.status === ORDER_HISTORY.ARRIVED;
    const email = isAtPickUp
      ? orderExist.pickupDetails.email
      : orderExist.deliveryDetails.email;

    const contactNumber = isAtPickUp
      ? orderExist.pickupDetails.mobileNumber
      : orderExist.deliveryDetails.mobileNumber;

    await otpSchema.updateOne(
      {
        value: otp,
        customerEmail: email,
        customerMobile: contactNumber,
      },
      {
        value: otp,
        customerEmail: email,
        customerMobile: contactNumber,
        expiry: Date.now() + 600000,
      },
      { upsert: true },
    );

    return res.ok({
      message: getLanguage('en').otpSentSuccess,
      data: { otp },
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};
export const sendEmailOrMobileOtpMulti = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      orderId: number;
    }>(req.body, orderIdValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;
    const orderExist = await orderSchemaMulti.findOne({
      orderId: value.orderId,
      deliveryDetails: {
        $elemMatch: {
          status: { $ne: ORDER_HISTORY.DELIVERED }, // Match the specific status
        },
      },
    });

    console.log(orderExist);

    if (!orderExist) {
      return res.badRequest({
        message: getLanguage('en').invalidOrder,
      });
    }

    const otp = generateIntRandomNo(111111, 999999);

    if (orderExist.status === ORDER_HISTORY.ARRIVED) {
      await emailOrMobileOtp(
        orderExist.pickupDetails.email,
        `This is your otp for identity verification ${otp}`,
      );
    }
    // else if (orderExist.status === ORDER_HISTORY.DEPARTED) {
    //   await emailOrMobileOtp(
    //     orderExist.deliveryDetails.email,
    //     `This is your otp for identity verification ${otp}`,
    //   );
    // }

    const isAtPickUp = orderExist.status === ORDER_HISTORY.ARRIVED;
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

    await otpSchema.updateOne(
      {
        value: otp,
        customerEmail: email,
        customerMobile: contactNumber,
      },
      {
        value: otp,
        customerEmail: email,
        customerMobile: contactNumber,
        expiry: Date.now() + 600000,
      },
      { upsert: true },
    );

    return res.ok({
      message: getLanguage('en').otpSentSuccess,
      data: { otp },
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const sendEmailOrMobileOtpMultiForDelivery = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      orderId: number;
      subOrderId: number;
    }>(req.body, orderIdValidationForDelivery);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;
    console.log(value);

    const orderExist = await orderSchemaMulti.findOne({
      orderId: value.orderId,
      deliveryDetails: {
        $elemMatch: {
          subOrderId: value.subOrderId, // Match the specific subOrderId
        },
      },
    });

    console.log(orderExist, 'Dastaaaa');

    const deliveryEmail = orderExist.deliveryDetails.filter(
      (data) =>
        (data as { subOrderId?: number }).subOrderId === value.subOrderId,
    );
    console.log((deliveryEmail[0] as { email?: string }).email, 'Emaillllll');
    console.log(
      (
        deliveryEmail[0] as {
          mobileNumber?: string;
        }
      ).mobileNumber,
      'Emaillllll',
    );

    if (!orderExist) {
      return res.badRequest({
        message: getLanguage('en').invalidOrder,
      });
    }

    const otp = generateIntRandomNo(111111, 999999);

    if (orderExist.status === ORDER_HISTORY.ARRIVED) {
      await emailOrMobileOtp(
        orderExist.pickupDetails.email,
        `This is your otp for identity verification ${otp}`,
      );
    }
    // else if (orderExist.status === ORDER_HISTORY.DEPARTED) {
    //   await emailOrMobileOtp(
    //     orderExist.deliveryDetails.email,
    //     `This is your otp for identity verification ${otp}`,
    //   );
    // }

    const isAtPickUp = orderExist.status === ORDER_HISTORY.ARRIVED;
    console.log(isAtPickUp);

    const email = isAtPickUp
      ? orderExist.pickupDetails.email
      : (deliveryEmail[0] as { email?: string }).email;
    // const email = isAtPickUp
    // ? orderExist.pickupDetails.email : null
    // : orderExist.deliveryDetails[].email;

    const contactNumber = isAtPickUp
      ? orderExist.pickupDetails.mobileNumber
      : (deliveryEmail[0] as { mobileNumber?: string }).mobileNumber;
    // const contactNumber = isAtPickUp
    // ? orderExist.pickupDetails.mobileNumber
    // : null;

    await otpSchema.updateOne(
      {
        value: otp,
        customerEmail: email,
        customerMobile: contactNumber,
        subOrderId: value.subOrderId,
      },
      {
        value: otp,
        customerEmail: email,
        customerMobile: contactNumber,
        expiry: Date.now() + 600000,
      },
      { upsert: true },
    );

    return res.ok({
      message: getLanguage('en').otpSentSuccess,
      data: { otp },
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};
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
export const deliverOrder = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<OrderDeliverType>(
      req.body,
      orderDeliverValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;
    console.log('Request Body:', value);

    const isArrived = await orderSchema.findOne({
      orderId: value.orderId,
    });
    console.log('Order Details:', isArrived);

    if (!isArrived) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
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

    const [paymentInfo] = await Promise.all([
      PaymentInfoSchema.findOne({ order: value.orderId }),
      orderSchema.updateOne(
        { orderId: value.orderId },
        {
          $set: {
            'deliveryDetails.deliveryBoySignature': value.deliveryManSignature,
            'deliveryDetails.orderTimestamp': value.deliverTimestamp,
            status: ORDER_HISTORY.DELIVERED,
            'time.end': endTime, // Use dot notation to set only the 'end' field
          },
        },
        { new: true },
      ),
    ]);
    console.log('Payment Info:', paymentInfo);

    const admin = await AdminSchema.findOne();
    console.log('Admin Details:', admin);

    const assignData = await OrderAssigneeSchema.findOne({
      order: value.orderId,
    });
    console.log('Order Assignment:', assignData);
    console.log('Order Assignee details', assignData.deliveryBoy);

    // delivery boy details
    const DeliveryMan = await DeliveryManSchema.findById(
      assignData.deliveryBoy,
    );
    // charge of delivery boy

    if (DeliveryMan.chargeMethod === CHARGE_METHOD.TIME) {
      // time in hours
      const timeTaken = endTime - startTime;
      const hour = timeTaken / 3600000;
      // charge per hour
      chargeofDeliveryBoy = hour * DeliveryMan.charge;
      console.log(`Charge: ${chargeofDeliveryBoy}`);
      console.log(`Time taken: ${timeTaken} ms`);
    } else if (DeliveryMan.chargeMethod === CHARGE_METHOD.DISTANCE) {
      //  distance in miles
      const distance = isArrived.distance;
      chargeofDeliveryBoy = distance * DeliveryMan.charge;
      console.log(`Charge: ${chargeofDeliveryBoy}`);
      console.log(`Distance: ${distance} miles`);
    }

    // if delivery boy is created by admin
    if (DeliveryMan.createdByAdmin) {
      console.log('Processing Cash on Delivery Payment');
      if (paymentInfo.status !== PAYMENT_INFO.SUCCESS) {
        await PaymentInfoSchema.updateOne(
          { order: value.orderId },
          { $set: { status: PAYMENT_INFO.SUCCESS } },
        );
      }
      console.log('chargeofDeliveryBoy', chargeofDeliveryBoy);
      console.log(value.orderId);

      await updateWallet(
        chargeofDeliveryBoy,
        admin._id.toString(),
        req.id.toString(),
        TRANSACTION_TYPE.WITHDRAW,
        `Order ${value.orderId} Delivery Boy Commission`,
        false,
      );
    }

    // Only update delivery boy balance if it's cash on delivery
    if (isArrived.cashOnDelivery) {
      const balance = totalAmount;
      const deliveryBoy = await DeliveryManSchema.findByIdAndUpdate(
        assignData.deliveryBoy,
        { $inc: { balance: balance } },
        { $inc: { earning: chargeofDeliveryBoy } },
      );
      console.log('Delivery Boy Details', deliveryBoy);
    } else {
      console.log('Delivery Boy Details', 'Not updated');
      console.log('isArrived.cashOnDelivery is false');
    }

    const city = await CitySchema.findById(isArrived.city);
    console.log('City Details:', city);

    const chargeData = await ProductChargesSchema.findOne({
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
      if (paymentInfo.status !== PAYMENT_INFO.SUCCESS) {
        await PaymentInfoSchema.updateOne(
          { order: value.orderId },
          { $set: { status: PAYMENT_INFO.SUCCESS } },
        );
      }
      console.log('adminCommission', adminCommission);
      console.log(value.orderId);

      await updateWallet(
        adminCommission,
        admin._id.toString(),
        req.id.toString(),
        TRANSACTION_TYPE.WITHDRAW,
        `Order ${value.orderId} Admin Commission`,
        false,
      );
    } else if (paymentInfo.paymentThrough === PAYMENT_TYPE.WALLET) {
      console.log('Processing Wallet Payment');
      await Promise.all([
        updateWallet(
          isArrived.totalCharge,
          admin._id.toString(),
          assignData.merchant.toString(),
          TRANSACTION_TYPE.WITHDRAW,
          message,
        ),
        updateWallet(
          isArrived.totalCharge - adminCommission,
          admin._id.toString(),
          req.id.toString(),
          TRANSACTION_TYPE.DEPOSIT,
          message,
          false,
        ),
      ]);
    } else if (paymentInfo.paymentThrough === PAYMENT_TYPE.ONLINE) {
      console.log('Processing Online Payment');

      const admin = await AdminSchema.findOneAndUpdate(
        {},
        {
          $inc: { balance: adminCommission },
        },
      );

      await updateWallet(
        isArrived.totalCharge - adminCommission,
        admin._id.toString(),
        req.id.toString(),
        TRANSACTION_TYPE.DEPOSIT,
        message,
        false,
      );
    } else {
      console.log('Processing Other Payment Type');
      await updateWallet(
        adminCommission,
        admin._id.toString(),
        req.id.toString(),
        TRANSACTION_TYPE.WITHDRAW,
        `Order ${value.orderId} Admin Commission`,
        false,
      );
    }

    await OrderHistorySchema.create({
      message: `Your order ${value.orderId} has been successfully delivered`,
      order: value.orderId,
      status: ORDER_HISTORY.DELIVERED,
      merchantID: isArrived.merchant,
    });
    console.log('Order History Created');

    await OrderHistorySchema.deleteOne({
      order: value.orderId,
      status: ORDER_HISTORY.DEPARTED,
    });
    console.log('Old Order History Deleted');

    await createNotification({
      userId: isArrived.merchant,
      orderId: isArrived.orderId,
      title: 'Order Delivered',
      message: `Your order ${isArrived.orderId} has been delivered`,
      type: 'MERCHANT',
    });
    console.log('Notification Created');

    console.log('Final Order Details:', {
      orderId: value.orderId,
      status: ORDER_HISTORY.DELIVERED,
      paymentInfo: paymentInfo,
      adminCommission: adminCommission,
      totalCharge: isArrived.totalCharge,
    });

    return res.ok({
      message: getLanguage('en').orderUpdatedSuccessfully,
    });
  } catch (error: any) {
    console.error('Error in deliverOrder:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
      error: error?.message || 'Unknown error',
    });
  }
};

export const deliverOrderMulti = async (req: RequestParams, res: Response) => {
  try {
    console.log('req.body', req.body);
    const validateRequest = validateParamsWithJoi<OrderDeliverTypeMulti>(
      req.body,
      orderDeliverValidationMulti,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;
    console.log('Request Body:', value);

    const isArrived = await orderSchemaMulti.findOne({
      orderId: value.orderId,
      'deliveryDetails.subOrderId': value.subOrderId,
    });
    console.log('Order Details:', isArrived.deliveryDetails);
    const deliveryEmail = isArrived.deliveryDetails.filter(
      (data) =>
        (data as { subOrderId?: number }).subOrderId === value.subOrderId,
    );

    if (!isArrived) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    // otp verification START
    // const otpData = await otpSchema.findOne({
    //   value: value.otp,
    //   subOrderId: value.subOrderId,
    //   customerEmail: (deliveryEmail[0] as { email?: string }).email,
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

    const [paymentInfo] = await Promise.all([
      PaymentInfoSchema.findOne({ order: value.orderId }),
      orderSchemaMulti.updateOne(
        {
          orderId: value.orderId,
          'deliveryDetails.subOrderId': value.subOrderId,
        },
        {
          $set: {
            'deliveryDetails.$.deliveryBoySignature':
              value.deliveryManSignature,
            'deliveryDetails.$.orderTimestamp': value.deliverTimestamp,
            'deliveryDetails.$.status': ORDER_HISTORY.DELIVERED,
            'time.end': endTime, // Use dot notation to set only the 'end' field
          },
        },
        { new: true },
      ),
    ]);

    console.log('Payment Info:', paymentInfo);

    const admin = await AdminSchema.findOne();
    console.log('Admin Details:', admin);

    const assignData = await OrderAssigneeSchemaMulti.findOne({
      order: value.orderId,
    });
    console.log('Order Assignment:', assignData);
    console.log('Order Assignee details', assignData.deliveryBoy);
    const deliveryBoyId = new mongoose.Types.ObjectId(assignData.deliveryBoy);

    // delivery boy details
    const DeliveryMan = await DeliveryManSchema.findById(deliveryBoyId);
    // charge of delivery boy
    console.log(DeliveryMan);

    if (DeliveryMan.chargeMethod === CHARGE_METHOD.TIME) {
      // time in hours
      const timeTaken = endTime - startTime;
      const hour = timeTaken / 3600000;
      // charge per hour
      chargeofDeliveryBoy = hour * DeliveryMan.charge;
      console.log(`Charge: ${chargeofDeliveryBoy}`);
      console.log(`Time taken: ${timeTaken} ms`);
    } else if (DeliveryMan.chargeMethod === CHARGE_METHOD.DISTANCE) {
      //  distance in miles
      const distance = isArrived.distance;
      chargeofDeliveryBoy = distance * DeliveryMan.charge;
      console.log(`Charge: ${chargeofDeliveryBoy}`);
      console.log(`Distance: ${distance} miles`);
    }

    // if delivery boy is created by admin
    if (DeliveryMan.createdByAdmin) {
      console.log('Processing Cash on Delivery Payment');
      if (paymentInfo.status !== PAYMENT_INFO.SUCCESS) {
        await PaymentInfoSchema.updateOne(
          { order: value.orderId },
          { $set: { status: PAYMENT_INFO.SUCCESS } },
        );
      }
      console.log('chargeofDeliveryBoy', chargeofDeliveryBoy);
      console.log(value.orderId);

      await updateWallet(
        chargeofDeliveryBoy,
        admin._id.toString(),
        req.id.toString(),
        TRANSACTION_TYPE.WITHDRAW,
        `Order ${value.orderId} Delivery Boy Commission`,
        false,
      );
    }

    // Only update delivery boy balance if it's cash on delivery
    if (isArrived.cashOnDelivery) {
      const balance = totalAmount;
      const deliveryBoy = await DeliveryManSchema.findByIdAndUpdate(
        assignData.deliveryBoy,
        { $inc: { balance: balance } },
        { $inc: { earning: chargeofDeliveryBoy } },
      );
      console.log('Delivery Boy Details', deliveryBoy);
    } else {
      console.log('Delivery Boy Details', 'Not updated');
      console.log('isArrived.cashOnDelivery is false');
    }

    const city = await CitySchema.findById(isArrived.city);
    console.log('City Details:', city);

    const chargeData = await ProductChargesSchema.findOne({
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
      if (paymentInfo.status !== PAYMENT_INFO.SUCCESS) {
        await PaymentInfoSchema.updateOne(
          { order: value.orderId },
          { $set: { status: PAYMENT_INFO.SUCCESS } },
        );
      }
      console.log('adminCommission', adminCommission);
      console.log(value.orderId);

      await updateWallet(
        adminCommission,
        admin._id.toString(),
        req.id.toString(),
        TRANSACTION_TYPE.WITHDRAW,
        `Order ${value.orderId} Admin Commission`,
        false,
      );
    } else if (paymentInfo.paymentThrough === PAYMENT_TYPE.WALLET) {
      console.log('Processing Wallet Payment');
      await Promise.all([
        updateWallet(
          isArrived.totalCharge,
          admin._id.toString(),
          assignData.merchant.toString(),
          TRANSACTION_TYPE.WITHDRAW,
          message,
        ),
        updateWallet(
          isArrived.totalCharge - adminCommission,
          admin._id.toString(),
          req.id.toString(),
          TRANSACTION_TYPE.DEPOSIT,
          message,
          false,
        ),
      ]);
    } else if (paymentInfo.paymentThrough === PAYMENT_TYPE.ONLINE) {
      console.log('Processing Online Payment');

      const admin = await AdminSchema.findOneAndUpdate(
        {},
        {
          $inc: { balance: adminCommission },
        },
      );

      await updateWallet(
        isArrived.totalCharge - adminCommission,
        admin._id.toString(),
        req.id.toString(),
        TRANSACTION_TYPE.DEPOSIT,
        message,
        false,
      );
    } else {
      console.log('Processing Other Payment Type');
      await updateWallet(
        adminCommission,
        admin._id.toString(),
        req.id.toString(),
        TRANSACTION_TYPE.WITHDRAW,
        `Order ${value.orderId} Admin Commission`,
        false,
      );
    }

    await OrderHistorySchema.create({
      message: `Your order ${value.orderId} has been successfully delivered`,
      order: value.orderId,
      status: ORDER_HISTORY.DELIVERED,
      merchantID: isArrived.merchant,
    });
    console.log('Order History Created');

    await OrderHistorySchema.deleteOne({
      order: value.orderId,
      status: ORDER_HISTORY.DEPARTED,
    });
    console.log('Old Order History Deleted');

    await createNotification({
      userId: isArrived.merchant,
      orderId: isArrived.orderId,
      title: 'Order Delivered',
      message: `Your order ${isArrived.orderId} has been delivered`,
      type: 'MERCHANT',
    });
    console.log('Notification Created');

    console.log('Final Order Details:', {
      orderId: value.orderId,
      status: ORDER_HISTORY.DELIVERED,
      paymentInfo: paymentInfo,
      adminCommission: adminCommission,
      totalCharge: isArrived.totalCharge,
    });

    return res.ok({
      message: getLanguage('en').orderUpdatedSuccessfully,
    });
  } catch (error: any) {
    console.error('Error in deliverOrder:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
      error: error?.message || 'Unknown error',
    });
  }
};
export const OrderAssigneeSchemaData = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const data = await OrderAssigneeSchema.find();
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};
export const allPaymentInfo = async (req: RequestParams, res: Response) => {
  try {
    const data = await PaymentInfoSchema.find();
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    console.log('🚀 ~ deliverOrder ~ error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getOrderById = async (req: RequestParams, res: Response) => {
  try {
    const { orderId } = req.params; // Extract orderId from the request parameters
    console.log(orderId);

    const data = await orderSchema
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
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getAllCancelledOrders = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const Id = req.id;
    console.log(Id);

    if (!mongoose.Types.ObjectId.isValid(Id)) {
      return res.status(400).json({ message: 'Invalid delivery man ID' });
    }
    const data = await cancelOderbyDeliveryMan.aggregate([
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
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getAllCancelledOrdersMulti = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const Id = req.id;
    console.log(Id);

    if (!mongoose.Types.ObjectId.isValid(Id)) {
      return res.status(400).json({ message: 'Invalid delivery man ID' });
    }

    const tr = await cancelOderbyDeliveryMan.find({ deliveryBoy: Id });
    console.log(tr, 'tr');

    const data = await cancelOderbyDeliveryMan.aggregate([
      { $sort: { order: -1 } },
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
        $addFields: {
          customerdata: {
            $map: {
              input: '$order.deliveryDetails',
              as: 'detail',
              in: {
                customerMobilNumber: '$$detail.mobileNumber',
                customerName: '$$detail.name',
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          orderId: '$order.orderId',
          // new
          // customerMobilNumber: '$order.deliveryDetails.mobileNumber',
          // customerName: '$order.deliveryDetails.name',
          customerdata: 1,
          status: 1,
          merchantName: '$merchant.name',
          merchantMobilNumber: '$merchant.contactNumber',
        },
      },
    ]);

    console.log(data);

    return res.ok({ data: data });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getPaymentDataForDeliveryBoy = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const paymentData = await paymentGetSchema
      .find({ deliveryManId: req.id })
      .populate('merchantId', 'name email contactNumber')
      .populate('adminId', 'name email contactNumber');
    console.log(paymentData, 'paymentData');
    return res.ok({ data: paymentData });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getMultiOrder = async (req: RequestParams, res: Response) => {
  try {
    const {
      startDate,
      endDate,
      status,
      pageLimit = 10,
      pageCount = 1,
    } = req.query;

    const data = await OrderAssigneeSchemaMulti.aggregate([
      {
        $match: {
          deliveryBoy: new mongoose.Types.ObjectId(req.id),
          ...(startDate && endDate && {
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          }),
        },
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
          preserveNullAndEmptyArrays: true
        },
      },
      {
        $addFields: {
          'orderData.deliveryDetails': {
            $cond: {
              if: { $isArray: '$orderData.deliveryDetails' },
              then: {
                $map: {
                  input: '$orderData.deliveryDetails',
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
                                  $eq: ['$$detail.status', ORDER_HISTORY.PICKED_UP],
                                },
                                then: 1,
                              },
                              {
                                case: {
                                  $eq: ['$$detail.status', ORDER_HISTORY.ARRIVED],
                                },
                                then: 2,
                              },
                              {
                                case: {
                                  $eq: ['$$detail.status', ORDER_HISTORY.DEPARTED],
                                },
                                then: 3,
                              },
                              {
                                case: {
                                  $eq: ['$$detail.status', ORDER_HISTORY.DELIVERED],
                                },
                                then: 4,
                              },
                            ],
                            default: 5,
                          },
                        },
                        distance: {
                          $cond: {
                            if: { $gt: ['$$detail.distance', 0] },
                            then: { $divide: ['$$detail.distance', 1609.34] },
                            else: 0
                          }
                        }
                      },
                    ],
                  },
                },
              },
              else: '$orderData.deliveryDetails'
            }
          }
        },
      },
      {
        $match: {
          ...(status && { 'orderData.status': status }),
        },
      },
      {
        $addFields: {
          'orderData.totalDeliveredOrders': {
            $size: {
              $filter: {
                input: { $ifNull: ['$orderData.deliveryDetails', []] },
                as: 'detail',
                cond: { $eq: ['$$detail.status', ORDER_HISTORY.DELIVERED] },
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
              if: { $and: [
                { $isArray: '$orderData.route' },
                { $isArray: '$orderData.deliveryDetails' }
              ]},
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
                                    cond: { $eq: ['$$detail.subOrderId', '$$routeItem.subOrderId'] }
                                  }
                                },
                                0
                              ]
                            },
                            {
                              distance: {
                                $divide: [{ $ifNull: ['$$routeItem.distance', 0] }, 1609.34]
                              }
                            }
                          ]
                        }
                      }
                    }
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
                              $in: ['$$detail.subOrderId', '$orderData.route.subOrderId']
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              },
              else: '$orderData.deliveryDetails'
            }
          }
        }
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
        $project: {
          'orderData.route': 0
        }
      }
    ]);

    return res.ok({
      data: data || [],
    });
  } catch (error) {
    console.error('getMultiOrder error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};


export const getMultiOrderById = async (req: RequestParams, res: Response) => {
  try {
    const id = req.params.id;
    console.log('id', id);

    const [multiOrder] = await orderSchemaMulti
      .aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
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
                                    $eq: ['$$detail.status', ORDER_HISTORY.PICKED_UP],
                                  },
                                  then: 1,
                                },
                                {
                                  case: {
                                    $eq: ['$$detail.status', ORDER_HISTORY.ARRIVED],
                                  },
                                  then: 2,
                                },
                                {
                                  case: {
                                    $eq: ['$$detail.status', ORDER_HISTORY.DEPARTED],
                                  },
                                  then: 3,
                                },
                                {
                                  case: {
                                    $eq: ['$$detail.status', ORDER_HISTORY.DELIVERED],
                                  },
                                  then: 4,
                                },
                              ],
                              default: 5,
                            },
                          },
                          distance: {
                            $cond: {
                              if: { $gt: ['$$detail.distance', 0] },
                              then: { $divide: ['$$detail.distance', 1609.34] },
                              else: 0
                            }
                          }
                        },
                      ],
                    },
                  },
                },
                else: '$deliveryDetails'
              }
            }
          },
        },
        {
          $addFields: {
            deliveryDetails: {
              $cond: {
                if: { $and: [
                  { $isArray: '$route' },
                  { $isArray: '$deliveryDetails' }
                ]},
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
                                      cond: { $eq: ['$$detail.subOrderId', '$$routeItem.subOrderId'] }
                                    }
                                  },
                                  0
                                ]
                              },
                              {
                                distance: {
                                  $divide: [{ $ifNull: ['$$routeItem.distance', 0] }, 1609.34]
                                }
                              }
                            ]
                          }
                        }
                      }
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
                                $in: ['$$detail.subOrderId', '$route.subOrderId']
                              }
                            }
                          }
                        }
                      ]
                    }
                  }
                },
                else: '$deliveryDetails'
              }
            }
          }
        },
        {
          $addFields: {
            totalDeliveredOrders: {
              $size: {
                $filter: {
                  input: { $ifNull: ['$deliveryDetails', []] },
                  as: 'detail',
                  cond: { $eq: ['$$detail.status', ORDER_HISTORY.DELIVERED] },
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
            route: 0
          }
        }
      ])
      .exec();

    const oder = await OrderAssigneeSchemaMulti.findOne({
      order: multiOrder.orderId,
    });

    if (oder.deliveryBoy.toString() != req.id.toString()) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    return res.ok({ data: multiOrder });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};
