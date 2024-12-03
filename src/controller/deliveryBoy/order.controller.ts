import { query, Response } from 'express';
import { PipelineStage } from 'mongoose';
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
      deliveryBoy: req.id,
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
      status: { $eq: ORDER_HISTORY.CREATED },
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
      });
    }

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
    });

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
    console.log(existingOrder);

    if (!existingOrder) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    // Check if the delivery man is assigned to the order
    const isAssigned = await OrderAssigneeSchema.findOne({
      order: value.orderId,
      deliveryBoy: value.deliveryManId,
    });

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

    // Update the assignee status (if needed)
    await OrderAssigneeSchema.findByIdAndUpdate(isAssigned._id, {
      $set: { status: ORDER_REQUEST.REJECT },
    });

    // Record the cancellation in the order history
    await OrderHistorySchema.create({
      message: `Order ${value.orderId} has been canceled by the delivery man.`,
      order: value.orderId,
      status: ORDER_HISTORY.UNASSIGNED,
      merchantID: existingOrder.merchant,
    });

    await sendMailService(
      existingOrder.pickupDetails.email,
      'Cancel Order ',
      'Your order is cancelled by deliveryman plz assign order other deliveryman',
    );

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
    });
    // io.to(`order_${value.orderId}`).emit('locationUpdate', {
    //   latitude: value.latitude,
    //   longitude: value.longitude,
    //   deliveryManId: req.id,
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

    if (isArrived.pickupDetails.cashOnDelivery) {
      await PaymentInfoSchema.updateOne(
        { order: value.orderId },
        { $set: { status: PAYMENT_INFO.SUCCESS } },
      );
    }

    await OrderHistorySchema.create({
      message:
        'Delivery Person has been arrived at pick up location and waiting for client',
      order: value.orderId,
      status: ORDER_HISTORY.PICKED_UP,
      merchantID: isArrived.merchant,
    });

    return res.ok({
      message: getLanguage('en').orderUpdatedSuccessfully,
    });
  } catch (error) {
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

    const otp =
      process.env.ENV === 'DEV' ? 999999 : generateIntRandomNo(111111, 999999);

    if (process.env.ENV !== 'DEV') {
      await emailOrMobileOtp(
        orderExist.pickupDetails.email,
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
      data: process.env.ENV !== 'DEV' ? {} : { otp },
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

    const isArrived = await orderSchema.findOne({
      orderId: value.orderId,
      status: ORDER_HISTORY.DEPARTED,
    });

    if (!isArrived) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    const otpData = await otpSchema.findOne({
      value: value.otp,
      customerEmail: isArrived.deliveryDetails.email,
      expiry: { $gte: Date.now() },
    });

    if (!otpData) {
      return res.badRequest({ message: getLanguage('en').otpExpired });
    }

    const signDocs = value.deliveryManSignature.split(',');

    value.deliveryManSignature = await uploadFile(
      signDocs[0],
      signDocs[1],
      'USER-SIGNATURE',
    );

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

    const admin = await AdminSchema.findOne();
    const assignData = await OrderAssigneeSchema.findOne({
      order: value.orderId,
    });
    const city = await CitySchema.findById(isArrived.city);
    const chargeData = await ProductChargesSchema.findOne({
      cityId: city._id,
      pickupRequest: isArrived.pickupDetails.request,
      isCustomer: isArrived.isCustomer,
    });

    const adminCommission =
      city.commissionType === CHARGE_TYPE.PERCENTAGE
        ? isArrived.totalCharge * (chargeData.adminCommission / 100)
        : chargeData.adminCommission;

    const message = `Order ${value.orderId} Amount`;

    if (isArrived.deliveryDetails.cashOnDelivery) {
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
      await Promise.all([
        updateWallet(
          isArrived.totalCharge,
          admin._id.toString(),
          // assignData.customer.toString(),
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
      await updateWallet(
        isArrived.totalCharge - adminCommission,
        admin._id.toString(),
        req.id.toString(),
        TRANSACTION_TYPE.DEPOSIT,
        message,
        false,
      );
    } else {
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

    return res.ok({
      message: getLanguage('en').orderUpdatedSuccessfully,
    });
  } catch (error) {
    console.log('🚀 ~ deliverOrder ~ error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
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
