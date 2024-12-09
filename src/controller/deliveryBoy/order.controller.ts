import { query, Response } from 'express';
import mongoose, { PipelineStage } from 'mongoose';
import {
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
import DeliveryManSchema from '../../models/deliveryMan.schema';
import orderSchema from '../../models/order.schema';
import OrderAssigneeSchema from '../../models/orderAssignee.schema';
import OrderHistorySchema from '../../models/orderHistory.schema';
import otpSchema from '../../models/otp.schema';
import PaymentInfoSchema from '../../models/paymentInfo.schema';
import ProductChargesSchema from '../../models/productCharges.schema';
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
  orderCancelValidation,
  orderDeliverValidation,
  orderIdValidation,
  orderListByDeliveryManValidation,
  orderPickUpValidation,
} from '../../utils/validation/order.validation';
import {
  OrderAcceptType,
  OrderCancelType,
  OrderDeliverType,
  OrderPickUpType,
} from './types/order';

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
    const data = await OrderAssigneeSchema.aggregate([
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
        $project: {
          _id: 0,
          order: '$orderData',
          deliveryBoy: 1,
          status: 1,
          createdAt: 1,
        },
      },
      {
        $skip: skip, // Skip the calculated number of documents
      },
      {
        $limit: pageLimit, // Limit the number of documents per page
      },
    ]);

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

    const data = await orderSchema.aggregate([
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
      // {
      //   $lookup: {
      //     from: 'users',
      //     // localField: 'customer',
      //     localField: 'merchant',
      //     foreignField: '_id',
      //     as: 'userData',
      //     pipeline: [
      //       {
      //         $project: {
      //           _id: 0,
      //           name: 1,
      //         },
      //       },
      //     ],
      //   },
      // },
      // {
      //   $unwind: {
      //     path: '$userData',
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
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
          order: {
            orderId: '$orderId',
            _id: '$_id',
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
        $match: matchCondition,
      },
      {
        $skip: skip,
      },
      {
        $limit: pageLimitt,
      },
    ]);

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

    if (value.status === ORDER_REQUEST.ACCEPTED) {
      await orderSchema.findOneAndUpdate(
        { orderId: value.orderId },
        {
          $set: { status: ORDER_HISTORY.ASSIGNED },
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

    await orderSchema.findOneAndUpdate(
      { orderId: value.orderId },
      {
        $set: { status: ORDER_HISTORY.ARRIVED },
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

export const cancelOrder = async (req: RequestParams, res: Response) => {
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
        $in: [ORDER_HISTORY.CREATED, ORDER_HISTORY.ASSIGNED],
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
      { $set: { status: ORDER_HISTORY.UNASSIGNED } },
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
    console.log('Fifth');

    console.log('Six');

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

export const departOrder = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<OrderAcceptType>(
      req.body,
      orderArriveValidation,
    );

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

export const pickUpOrder = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<OrderPickUpType>(
      req.body,
      orderPickUpValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const isArrived = await orderSchema.findOne({
      orderId: value.orderId,
      status: ORDER_HISTORY.ARRIVED,
    });

    if (!isArrived) {
      return res.badRequest({ message: getLanguage('en').errorOrderArrived });
    }

    const otpData = await otpSchema.findOne({
      value: value.otp,
      customerEmail: isArrived.pickupDetails.email,
      expiry: { $gte: Date.now() },
    });

    if (!otpData) {
      return res.badRequest({ message: getLanguage('en').otpExpired });
    }

    const signDocs = value.userSignature.split(',');

    value.userSignature = await uploadFile(
      signDocs[0],
      signDocs[1],
      'USER-SIGNATURE',
    );

    await orderSchema.findOneAndUpdate(
      { orderId: value.orderId },
      {
        $set: {
          'pickupDetails.userSignature': value.userSignature,
          'pickupDetails.orderTimestamp': value.pickUpTimestamp,
          status: ORDER_HISTORY.PICKED_UP,
        },
      },
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

    // await emailOrMobileOtp(
    //   orderExist.pickupDetails.email,
    //   `This is your otp for identity verification ${otp}`,
    // );

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

    const otpData = await otpSchema.findOne({
      value: value.otp,
      customerEmail: isArrived.deliveryDetails.email,
      expiry: { $gte: Date.now() },
    });
    console.log('OTP Data:', otpData);

    if (!otpData) {
      return res.badRequest({ message: getLanguage('en').otpExpired });
    }

    const signDocs = value.deliveryManSignature.split(',');

    value.deliveryManSignature = await uploadFile(
      signDocs[0],
      signDocs[1],
      'USER-SIGNATURE',
    );
    console.log('Signature Upload:', value.deliveryManSignature);

    const [paymentInfo] = await Promise.all([
      PaymentInfoSchema.findOne({ order: value.orderId }),
      orderSchema.updateOne(
        { orderId: value.orderId },
        {
          $set: {
            'deliveryDetails.deliveryBoySignature': value.deliveryManSignature,
            'deliveryDetails.orderTimestamp': value.deliverTimestamp,
            status: ORDER_HISTORY.DELIVERED,
          },
        },
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

    // Only update delivery boy balance if it's cash on delivery
    if (isArrived.cashOnDelivery) {
      const balance = isArrived.paymentCollectionRupees;
      const deliveryBoy = await DeliveryManSchema.findByIdAndUpdate(
        assignData.deliveryBoy,
        { $inc: { balance: balance } },
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

    if (isArrived.cashOnDelivery) {
      console.log('Processing Cash on Delivery Payment');
      if (paymentInfo.status !== PAYMENT_INFO.SUCCESS) {
        await PaymentInfoSchema.updateOne(
          { order: value.orderId },
          { $set: { status: PAYMENT_INFO.SUCCESS } },
        );
      }

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
