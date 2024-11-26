import { Response } from 'express';
import mongoose from 'mongoose';

import {
  CHARGE_TYPE,
  DISTANCE_TYPE,
  ORDER_HISTORY,
  ORDER_LOCATION,
  PAYMENT_INFO,
  PAYMENT_TYPE,
  PERSON_TYPE,
  SWITCH,
  TRANSACTION_TYPE,
} from '../../enum';
import { getLanguage } from '../../language/languageHelper';
import AdminSchema from '../../models/admin.schema';
import adminSettingsSchema from '../../models/adminSettings.schema';
import citySchema from '../../models/city.schema';
import countrySchema from '../../models/country.schema';
import deliveryManSchema from '../../models/deliveryMan.schema';
import extraChargesSchema from '../../models/extraCharges.schema';
import orderSchema from '../../models/order.schema';
import OrderAssigneeSchema from '../../models/orderAssignee.schema';
import OrderHistorySchema from '../../models/orderHistory.schema';
import PaymentInfoSchema from '../../models/paymentInfo.schema';
import PostCodeSchema from '../../models/postCode.schema';
import ProductChargesSchema from '../../models/productCharges.schema';
import merchantSchema from '../../models/user.schema';
import WalletSchema from '../../models/wallet.schema';
import { updateWallet } from '../../utils/common';
import { RequestParams } from '../../utils/types/expressTypes';
import validateParamsWithJoi from '../../utils/validateRequest';
import {
  orderCancelValidation,
  orderCreateValidation,
  newOrderCreation,
} from '../../utils/validation/order.validation';
import { OrderCancelType } from '../deliveryBoy/types/order';
import {
  ExtraChargesQueryType,
  ExtraChargesType,
  IOrderCancel,
  IProductCharge,
  OrderCreateType,
  PaymentInfoType,
  ProductChargeQueryType,
} from './types/order';
import { date } from 'joi';

export const orderCreation = async (req: RequestParams, res: Response) => {
  try {
    console.log('in order route');
    const validateRequest = validateParamsWithJoi<OrderCreateType>(
      req.body,
      newOrderCreation,
    );

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

    let checkLastOrder = await orderSchema
      .findOne({}, { _id: 0, orderId: 1 })
      .sort({ orderId: -1 });

    if (checkLastOrder) {
      checkLastOrder.orderId += 1;
    } else {
      checkLastOrder = { orderId: 1 } as any;
    }
    value.orderId = checkLastOrder.orderId;
    // value.customer = req.id.toString();
    value.merchant = req.id.toString();
    const newOrder = await orderSchema.create(value);
    // console.log(newOrder, 'New Order');

    if (value.deliveryManId) {
      value.isCustomer = true;
      await OrderAssigneeSchema.create({
        deliveryBoy: value.deliveryManId,
        // customer: req.id,
        merchant: req.id,
        order: newOrder.orderId,
        status: ORDER_HISTORY.ACCEPTED,
      });
    }
    await OrderHistorySchema.create({
      message: 'New order has been created',
      order: newOrder.orderId,
      merchantID: newOrder.merchant,
    });

    const paymentData: PaymentInfoType = {
      // customer: req.id.toString(),
      merchant: req.id.toString(),
      paymentThrough: value.paymentCollection,
      paymentCollectFrom: value.paymentOrderLocation,
      order: value.orderId,
    };

    await PaymentInfoSchema.create(paymentData);

    return res.ok({
      message: getLanguage('en').orderCreatedSuccessfully,
      data: { orderId: newOrder.orderId },
    });
  } catch (error) {
    console.log('error', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const orderUpdate = async (req: RequestParams, res: Response) => {
  try {
    console.log('in order update route');

    const orderId = req.params.orderId; // Get orderId from request parameters
    const updateData = req.body; // Get the fields to update from request body

    // Validate the incoming data using Joi (if needed)
    const validateRequest = validateParamsWithJoi<OrderCreateType>(
      updateData,
      newOrderCreation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    // Check if the order exists
    const existingOrder = await orderSchema.findOne({ _id: orderId });
    if (!existingOrder) {
      return res.badRequest({ message: 'Order not found' });
    }
    console.log(existingOrder);

    // Update fields in the order
    const updatedOrder = await orderSchema.findOneAndUpdate(
      { _id: orderId },
      { $set: value },
      { new: true }, // Return the updated order object
    );

    if (!updatedOrder) {
      return res.failureResponse({
        message: 'Failed to update order',
      });
    }

    // If deliveryManId is updated, update the assignee table too
    if (value.deliveryManId) {
      await OrderAssigneeSchema.updateOne(
        { _id: orderId },
        { deliveryBoy: value.deliveryManId },
      );
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
  } catch (error) {
    console.log('Error in order update route', error);
    return res.failureResponse({
      message: 'Something went wrong, please try again later',
    });
  }
};
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

export const cancelOrder = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<OrderCancelType>(
      req.body,
      orderCancelValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const isCreated = await orderSchema.findOne({
      orderId: value.orderId,
      status: { $ne: ORDER_HISTORY.DELIVERED },
    });

    if (!isCreated) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    const admin = await AdminSchema.findOne();

    const paymentInfo = await PaymentInfoSchema.findOne(
      { order: value.orderId },
      { _id: 0, paymentThrough: 1 },
    );

    const data = await ProductChargesSchema.findById(
      {
        city: isCreated.city,
        pickupRequest: isCreated.pickupDetails.request,
        isCustomer: isCreated.isCustomer,
      },
      { _id: 0, cancelCharge: 1 },
    );

    const isAssigned = isCreated.status !== ORDER_HISTORY.CREATED;

    const $set: IOrderCancel = {
      status: ORDER_HISTORY.CANCELLED,
      reason: value.reason,
    };

    const message = `Order ${value.orderId} Cancelled Refund`;

    if (isAssigned) {
      $set.totalCharge = data.cancelCharge;

      if (
        paymentInfo.paymentThrough === PAYMENT_TYPE.CASH &&
        paymentInfo.status === PAYMENT_INFO.SUCCESS
      ) {
        const deliveryMan = await OrderAssigneeSchema.findOne({
          order: value.orderId,
        });

        const userAmountAfterCharge = isCreated.totalCharge - data.cancelCharge;

        const userData = await merchantSchema.findOneAndUpdate(
          { _id: req.id },
          { $inc: { balance: userAmountAfterCharge } },
          { new: true },
        );

        const deliveryManData = await deliveryManSchema.findOneAndUpdate(
          { _id: deliveryMan._id },
          { $inc: { balance: -isCreated.totalCharge } },
          { new: true },
        );

        await Promise.all([
          WalletSchema.insertMany([
            {
              personId: deliveryMan._id,
              message,
              type: TRANSACTION_TYPE.WITHDRAW,
              user: PERSON_TYPE.DELIVERY_BOY,
              availableBalance: deliveryManData.balance,
              amount: isCreated.totalCharge,
            },
            {
              personId: req.id,
              message: `Order ${value.orderId} Cancelled Refund After Cancel Charge`,
              type: TRANSACTION_TYPE.DEPOSIT,
              user: PERSON_TYPE.CUSTOMER,
              availableBalance: userData.balance,
              amount: userAmountAfterCharge,
            },
          ]),
          AdminSchema.updateOne(
            { _id: admin._id },
            { $inc: { balance: data.cancelCharge } },
          ),
        ]);
      } else if (paymentInfo.paymentThrough !== PAYMENT_TYPE.ONLINE) {
        await updateWallet(
          data.cancelCharge,
          admin._id.toString(),
          req.id.toString(),
          TRANSACTION_TYPE.WITHDRAW,
          `Order ${value.orderId} Cancelled`,
        );
      } else {
        const amtAfterCharge = isCreated.totalCharge - data.cancelCharge;
        await Promise.all([
          updateWallet(
            amtAfterCharge,
            admin._id.toString(),
            req.id.toString(),
            TRANSACTION_TYPE.DEPOSIT,
            message,
          ),
          AdminSchema.updateOne(
            { _id: admin._id },
            { $inc: { balance: -amtAfterCharge } },
          ),
        ]);
      }
    } else if (paymentInfo.paymentThrough === PAYMENT_TYPE.ONLINE) {
      await updateWallet(
        isCreated.totalCharge,
        admin._id.toString(),
        req.id.toString(),
        TRANSACTION_TYPE.DEPOSIT,
        message,
      );
    }

    await Promise.all([
      orderSchema.updateOne(
        { orderId: value.orderId },
        {
          $set,
        },
      ),
      OrderHistorySchema.create({
        message: `Your order ${value.orderId} has been cancelled`,
        order: value.orderId,
        status: ORDER_HISTORY.CANCELLED,
        merchantID: isCreated.merchant,
      }),
    ]);

    return res.badRequest({
      message: getLanguage('en').orderUpdatedSuccessfully,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getAllOrdersFromMerchant = async (
  req: RequestParams,
  res: Response,
) => {
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

    const data = await orderSchema.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $match: {
          // customer: new mongoose.Types.ObjectId(req.params.id),
          merchant: new mongoose.Types.ObjectId(req.params.id),
          ...dateFilter, // Apply the date filter if it's set
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
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getAllRecentOrdersFromMerchant = async (
  req: RequestParams,
  res: Response,
) => {
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

    const data = await orderSchema.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 10, // Limit the results to the last 10 orders
      },
      {
        $match: {
          // customer: new mongoose.Types.ObjectId(req.params.id),
          merchant: new mongoose.Types.ObjectId(req.params.id),
          ...dateFilter, // Apply the date filter if it's set
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
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const deleteOrderFormMerchant = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    const OrderData = await orderSchema.findById(id);

    if (!OrderData) {
      return res.badRequest({ message: getLanguage('en').orderNotFound });
    }

    await orderSchema.findByIdAndDelete(id);

    return res.ok({ message: getLanguage('en').orderDeleted });
  } catch (error) {
    console.log('🚀 ~ deleteDeliveryMan ~ error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const moveToTrash = async (req: RequestParams, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    const OrderData = await orderSchema.findById(id);
    const trash = OrderData.trashed === true ? false : true;

    if (!OrderData) {
      return res.badRequest({ message: getLanguage('en').orderNotFound });
    }

    await orderSchema.findByIdAndUpdate(id, { trashed: trash });

    return res.ok({
      message: trash
        ? getLanguage('en').orderMoveToTrash
        : getLanguage('en').orderUndoToTrash,
    });
  } catch (error) {
    console.log('🚀 ~ deleteDeliveryMan ~ error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

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
