import { Response } from 'express';
import mongoose from 'mongoose';

import {
  CHARGE_TYPE,
  DISTANCE_TYPE,
  ORDER_HISTORY,
  ORDER_LOCATION,
  ORDER_STATUS,
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
import orderSchemaMulti from '../../models/orderMulti.schema';
import OrderAssigneeSchema from '../../models/orderAssignee.schema';
import OrderAssigneeSchemaMulti from '../../models/orderAssigneeMulti.schema';
import OrderHistorySchema from '../../models/orderHistory.schema';
import orderAssignSchema from '../../models/orderAssignee.schema';
import PaymentInfoSchema from '../../models/paymentInfo.schema';
import PostCodeSchema from '../../models/postCode.schema';
import ProductChargesSchema from '../../models/productCharges.schema';
import merchantSchema from '../../models/user.schema';
import WalletSchema from '../../models/wallet.schema';
import { createNotification, updateWallet } from '../../utils/common';
import { RequestParams } from '../../utils/types/expressTypes';
import validateParamsWithJoi from '../../utils/validateRequest';
import {
  orderCancelValidation,
  orderCreateValidation,
  newOrderCreation,
  newOrderCreationMulti,
  newOrderUpdateMulti,
} from '../../utils/validation/order.validation';
import { OrderCancelType } from '../deliveryBoy/types/order';
import {
  ExtraChargesQueryType,
  ExtraChargesType,
  IOrderCancel,
  IProductCharge,
  OrderCreateType,
  OrderCreateTypeMulti,
  OrderUpdateTypeMulti,
  PaymentInfoType,
  ProductChargeQueryType,
} from './types/order';
import { date } from 'joi';

import paymentGetSchema from '../../models/paymentGet.schema';
import { sendNotificationinapp } from '../Notificationinapp/Notificationinapp';
export const orderCreation = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<OrderCreateType>(
      req.body,
      newOrderCreation,
    );
    const datamarcent = await merchantSchema.findById(req.id);
    await merchantSchema.updateOne(
      { _id: req.id },
      { $set: { showOrderNumber: datamarcent.showOrderNumber + 1 } },
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;
    console.log(req.id, 'req.id');

    // console.log(value.merchant, req.id.toString(), 'VAlue');

    // return;
    // const customerData = await customerSchema.findOne({ address: deliveryDetails.address });
    // if (!customerData) {
    //   return res.badRequest({ message: getLanguage('en').invalidCustomer });
    // }E:\nikunj\create_courier\create_courier

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
    const orderId = checkLastOrder.orderId;
    value.merchant = req.id.toString();
    const newOrder = await orderSchema.create({
      ...value,
      showOrderNumber: datamarcent.showOrderNumber,
    });

    const admin = await AdminSchema.findOne();
    const deliveryMan = await deliveryManSchema.findById({
      _id: req.body.deliveryManId,
    });
    // const payPerMiles = value.deliveryManCharge;
    console.log(deliveryMan, 'payPerMiles');

    const totalCharge = Number(
      ((deliveryMan?.charge || 0) * value.distance).toFixed(2),
    );

    const adminCharge = deliveryMan?.createdByAdmin
      ? Number((totalCharge % deliveryMan?.adminCharge || 0).toFixed(2))
      : 0;

    const createdBy = deliveryMan?.createdByMerchant
      ? 'MERCHANTDELIVERYMAN'
      : 'ADMINDELIVERYMAN';
    const paymentStatus = value?.cashOnDelivery
      ? 'CASHONDELIVERY'
      : 'DIRECTPAYMENT';
    const deliveryManWallet = value?.paymentCollectionRupees
      ? value.paymentCollectionRupees
      : 0;
    const data = {
      adminId: admin?._id || '',
      merchantId: req?.id || '',
      deliveryManId: req.body.deliveryManId,
      orderId: orderId,
      orderIdForMerchant: newOrder.showOrderNumber,
      miles: value.distance,
      payPerMiles: deliveryMan?.charge || 0,
      totalPaytoDeliveryMan: totalCharge,
      totalPaytoAdmin: adminCharge,
      deliveryManWallet: deliveryManWallet,
      deliveryManType: createdBy,
      paymentStatus: paymentStatus,
      statusOfOrder: 'ASSIGNED',
      orderPickupTime: new Date(),
      orderDeleverTime: new Date(),
    };
    console.log('data123', data);

    if (value.deliveryManId) {
      value.isCustomer = true;
      await OrderAssigneeSchema.create({
        deliveryBoy: value.deliveryManId,
        merchant: req.id,
        order: newOrder.orderId,
        status: ORDER_HISTORY.ACCEPTED,
      });
    }
    await OrderHistorySchema.create({
      message: 'New order has been created',
      order: newOrder.orderId,
      merchantID: newOrder.merchant,
      status: ORDER_HISTORY.ACCEPTED,
    });
    await OrderHistorySchema.create({
      message: 'New order has been Assigned',
      order: newOrder.orderId,
      merchantID: newOrder.merchant,
      status: ORDER_HISTORY.ASSIGNED,
    });

    const paymentData: PaymentInfoType = {
      // customer: req.id.toString(),
      merchant: req.id.toString(),
      paymentThrough: value.paymentCollection,
      paymentCollectFrom: value.paymentOrderLocation,
      order: value.orderId,
    };

    await PaymentInfoSchema.create(paymentData);
    await paymentGetSchema.create(data);
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

export const orderCreationMulti = async (req: RequestParams, res: Response) => {
  try {
    // Check if merchantId is provided and is a valid string
    const merchantId = req.id;
    console.log('data1', req.body);
    // console.log(merchantId, 'merchantId');
    console.log(req.body, 'req.body');

    if (!merchantId) {
      return res.badRequest({ message: 'missing merchant ID' });
    }

    interface RequestBody {
      [key: string]: any; // Adjust this type to match the structure of your request body
    }
    // console.log("enter in orderCreationMulti");

    const validKeys = Object.keys(newOrderCreationMulti.describe().keys);

    // Explicitly type cleanedBody as a Record<string, any>
    const cleanedBody: Record<string, any> = {};

    // Iterate over valid keys and assign values from req.body
    validKeys.forEach((key) => {
      if (key in req.body) {
        cleanedBody[key] = (req.body as RequestBody)[key];
      }
    });
    // console.log("enter in orderCreationMulti2");

    // Validate the cleaned body
    console.log('before', req.body);

    const validateRequest = validateParamsWithJoi<OrderCreateTypeMulti>(
      cleanedBody,
      newOrderCreationMulti,
    );

    // Add subOrderId index + 1
    if (validateRequest.isValid) {
      validateRequest.value.deliveryDetails =
        validateRequest.value.deliveryDetails.map((detail, index) => ({
          ...detail,
          subOrderId: index + 1,
        }));
    }
    console.log('data2', validateRequest);
    console.log('v:', validateRequest);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }
    console.log('data3', validateRequest);
    // console.log("enter in orderCreationMulti4");
    const datamarcent = await merchantSchema.findById(merchantId);
    if (!datamarcent) {
      return res.badRequest({ message: 'Merchant not found' });
    }
    console.log('data4', datamarcent);
    // console.log("enter in orderCreationMulti5");
    await merchantSchema.updateOne(
      { _id: merchantId },

      { $set: { showOrderNumber: datamarcent.showOrderNumber + 1 } },
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }
    // console.log("enter in orderCreationMulti6");

    const { value } = validateRequest;
    console.log('value', value);

    let checkLastOrder = await orderSchemaMulti
      .findOne({}, { _id: 0, orderId: 1 })
      .sort({ orderId: -1 });

    if (checkLastOrder) {
      checkLastOrder.orderId += 1;
    } else {
      checkLastOrder = { orderId: 1 } as any;
    }
    value.orderId = checkLastOrder.orderId;
    value.pickupDetails.merchantId = merchantId.toString();

    // Filter out empty parcelType values before creating the order
    const sanitizedValue = {
      ...value,
      deliveryDetails: value.deliveryDetails.map((detail, index) => ({
        ...detail,
        index: index + 1,
        parcelType2: detail.parcelType2 || [], // Convert empty string to undefined
      })),
    };
    console.log('data33', sanitizedValue);

    const newOrder = await orderSchemaMulti.create({
      ...sanitizedValue,
      merchant: merchantId.toString(),
      showOrderNumber: datamarcent.showOrderNumber,
    });

    const admin = await AdminSchema.findOne();
    const deliveryMan = await deliveryManSchema.findById({
      _id: req.body.deliveryManId,
    });
    console.log(deliveryMan, 'deliveryMan');
    // console.log(deliveryMan, 'deliveryMan');
    // Ensure charge is a valid number and not NaN
    const charge = deliveryMan?.charge || 0;
    var distancelist = [];

    for (
      let i = 0;
      i < JSON.parse(JSON.stringify(value.deliveryDetails)).length;
      i++
    ) {
      distancelist.push(
        JSON.parse(JSON.stringify(value.deliveryDetails))[i].distance,
      );
    }
    // console.log(distancelist, 'distancelist');

    var totalChargelist = [];
    for (let i = 0; i < distancelist.length; i++) {
      totalChargelist.push(Number((charge * distancelist[i]).toFixed(2)));
    }
    // console.log(totalChargelist, 'totalChargelist');

    var adminChargelist = [];
    for (let i = 0; i < totalChargelist.length; i++) {
      const totalChargeNumber = isNaN(Number(totalChargelist[i]))
        ? 0
        : Number(totalChargelist[i]);
      // console.log(totalChargeNumber, 'totalChargeNumber');
      // console.log(deliveryMan, 'deliveryMan?.adminCharge');
      // console.log(((totalChargeNumber * deliveryMan?.adminCharge) / 100));
      adminChargelist.push(
        Number(
          ((totalChargeNumber * deliveryMan?.adminCharge) / 100).toFixed(2),
        ),
      );
    }
    // console.log(adminChargelist, 'adminChargelist');

    // const distance = value.deliveryDetails[0].distance || 0;
    var distanceList = [];
    for (let i = 0; i < value.deliveryDetails.length; i++) {
      distanceList.push(value.deliveryDetails[i].distance);
    }
    // console.log(distanceList, 'distanceList');
    // Calculate total charge and admin charge

    const createdBy = deliveryMan?.createdByMerchant
      ? 'MERCHANTDELIVERYMAN'
      : 'ADMINDELIVERYMAN';

    var paymentStatuslist = [];
    for (let i = 0; i < totalChargelist.length; i++) {
      paymentStatuslist.push(
        value?.cashOnDelivery ? 'CASHONDELIVERY' : 'DIRECTPAYMENT',
      );
    }
    // console.log(paymentStatuslist, 'paymentStatuslist');

    var deliveryManWalletlist = [];
    for (let i = 0; i < totalChargelist.length; i++) {
      deliveryManWalletlist.push(
        value?.deliveryDetails[i]?.paymentCollectionRupees
          ? value.deliveryDetails[i]?.paymentCollectionRupees
          : 0,
      );
    }
    // console.log(deliveryManWalletlist, 'deliveryManWalletlist');

    const data = {
      adminId: admin?._id || '',
      merchantId: merchantId,
      deliveryManId: req.body.deliveryManId,
      orderId: checkLastOrder.orderId,
      orderIdForMerchant: newOrder.showOrderNumber,
      // miles: distanceList,
      payPerMiles: charge,
      // totalPaytoDeliveryMan: totalChargeNumber,
      // totalPaytoAdmin: adminChargeNumber,
      // deliveryManWallet: deliveryManWallet,
      deliveryManType: createdBy,
      // paymentStatus: paymentStatus,
      statusOfOrder: 'ASSIGNED',
      orderPickupTime: new Date(),
      orderDeleverTime: new Date(),
    };

    var newData = [];
    for (let i = 0; i < totalChargelist.length; i++) {
      newData.push({
        ...data,
        miles: distanceList[i],
        subOrderId: (i + 1).toString(),
        totalPaytoDeliveryMan: totalChargelist[i],
        totalPaytoAdmin: adminChargelist[i],
        deliveryManWallet: deliveryManWalletlist[i],
        paymentStatus: paymentStatuslist[i],
      });
    }
    // console.log(newData, 'newData');
    // await paymentGetSchema.insertMany(newData);
    // console.log('data123', data);

    if (value.deliveryManId) {
      value.isCustomer = true;
      console.log('value.deliveryManId', value.deliveryManId);
      OrderAssigneeSchemaMulti.create({
        deliveryBoy: value.deliveryManId,
        merchant: merchantId,
        order: newOrder.orderId,
        status: ORDER_HISTORY.ACCEPTED,
      });
    }

    for (let i = 0; i < value.deliveryDetails.length; i++) {
      await OrderHistorySchema.create({
        message: 'New order has been Assigned',
        order: newOrder.orderId,
        subOrderId: (i + 1).toString(),
        merchantID: newOrder.merchant,
        status: ORDER_HISTORY.ASSIGNED,
      });
    }

    // const paymentData: PaymentInfoType = {
    //   merchant: req.params.id.toString(),
    //   paymentThrough: value.paymentCollection,
    //   paymentCollectFrom: value.paymentOrderLocation,
    //   order: value.orderId,
    // };

    // await PaymentInfoSchema.create(paymentData);
    await paymentGetSchema.insertMany(newData);
    if (deliveryMan?.deviceToken && newOrder.orderId) {
      sendNotificationinapp(
        'Order Assigned',
        `New Order has been Assigned to you order id is ${newOrder.orderId}`,
        deliveryMan?.deviceToken,
      );
    }

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

export const orderUpdateMulti = async (req: RequestParams, res: Response) => {
  try {
    const orderId = req.params.orderId; // Get orderId from request parameters
    const updateData = req.body; // Get the fields to update from request body
    console.log(req.body, 'updateData');

    // Validate the incoming data using Joi (if needed)
    const validateRequest = validateParamsWithJoi<OrderUpdateTypeMulti>(
      updateData,
      newOrderUpdateMulti,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    // Check if the order exists
    const existingOrder = await orderSchemaMulti.findOne({ _id: orderId });
    if (!existingOrder) {
      return res.badRequest({ message: 'Order not found' });
    }

    // Update fields in the order
    const updatedOrder = await orderSchemaMulti.findOneAndUpdate(
      { _id: orderId },
      { $set: value },
      { new: true }, // Return the updated order object
    );
    if (!updatedOrder) {
      return res.failureResponse({
        message: 'Failed to update order',
      });
    } else {
      const deliveryMan = await deliveryManSchema.findById({
        _id: value.deliveryManId,
      });

      const admin = await AdminSchema.findOne();

      // Ensure valid numeric values for charge and distance
      const charge = deliveryMan?.charge || 0;
      const distance = 10;

      // Calculate total charge and admin charge
      const totalCharge = (charge * distance || 0).toFixed(2);
      const totalChargeNumber = isNaN(Number(totalCharge))
        ? 0
        : Number(totalCharge);

      const adminCharge = deliveryMan?.createdByAdmin
        ? (totalChargeNumber % (deliveryMan?.adminCharge || 0)).toFixed(2)
        : '0';
      const adminChargeNumber = isNaN(Number(adminCharge))
        ? 0
        : Number(adminCharge);

      const createdBy = deliveryMan?.createdByMerchant
        ? 'MERCHANTDELIVERYMAN'
        : 'ADMINDELIVERYMAN';

      const paymentStatus = updatedOrder?.cashOnDelivery
        ? 'CASHONDELIVERY'
        : 'DIRECTPAYMENT';

      const deliveryManWallet = updatedOrder?.paymentCollectionRupees
        ? updatedOrder.paymentCollectionRupees
        : 0;

      const data = {
        adminId: admin?._id || '',
        merchantId: req?.id || '',
        deliveryManId: value.deliveryManId,
        orderId: updatedOrder.orderId,
        orderIdForMerchant: updatedOrder.showOrderNumber,
        miles: distance,
        payPerMiles: charge,
        totalPaytoDeliveryMan: totalChargeNumber,
        totalPaytoAdmin: adminChargeNumber,
        deliveryManWallet: deliveryManWallet,
        deliveryManType: createdBy,
        paymentStatus: paymentStatus,
        orderPickupTime: new Date(),
        orderDeleverTime: new Date(),
      };
      console.log(data, 'data');

      console.log(updatedOrder.orderId, 'orderId');

      // Update paymentGetSchema with the calculated data
      await paymentGetSchema.findOneAndUpdate(
        { orderId: updatedOrder.orderId },
        { $set: data },
        { new: true },
      );
    }

    // If deliveryManId is updated, update the assignee table too
    if (value.deliveryManId) {
      console.log(existingOrder.status, 'existingOrder.status');
      if (existingOrder.status === 'UNASSIGNED') {
        console.log('enter in if');
        const updatedOrder = await orderSchemaMulti.findOneAndUpdate(
          { _id: orderId },
          { status: 'ASSIGNED' },
          // { new: true }, // Return the updated order object
        );

        await paymentGetSchema.findOneAndUpdate(
          { orderId: updatedOrder.orderId },
          { $set: { statusOfOrder: 'ASSIGNED' } },
          { new: true },
        );

        await OrderAssigneeSchemaMulti.updateOne(
          { _id: orderId },
          { deliveryBoy: value.deliveryManId },
        );
        await OrderHistorySchema.create({
          message: 'Order has been assigned',
          order: updatedOrder.orderId,
          merchantID: updatedOrder.merchant,
          status: ORDER_HISTORY.ASSIGNED,
        });
      } else {
        await OrderAssigneeSchemaMulti.updateOne(
          { order: existingOrder.orderId },
          { deliveryBoy: value.deliveryManId },
        );
      }
    }

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

export const getAllPaymentInfo = async (req: RequestParams, res: Response) => {
  try {
    const paymentInfo = await PaymentInfoSchema.find();

    if (!paymentInfo) {
      return res.badRequest({ message: 'No payment information found' });
    }

    return res.ok({
      data: paymentInfo,
    });
  } catch (error) {
    console.error('Error fetching payment info:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const orderUpdate = async (req: RequestParams, res: Response) => {
  try {
    const orderId = req.params.orderId; // Get orderId from request parameters
    const updateData = req.body; // Get the fields to update from request body
    console.log(req.body, 'updateData');
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

    // Update fields in the order
    const updatedOrder = await orderSchema.findOneAndUpdate(
      { _id: orderId },
      { $set: value },
      { new: true }, // Return the updated order object
    );
    console.log(value, 'value');

    if (!updatedOrder) {
      return res.failureResponse({
        message: 'Failed to update order',
      });
    } else {
      console.log(updatedOrder, 'updatedOrder');
      const deliveryMan = await deliveryManSchema.findById({
        _id: value.deliveryManId,
      });

      const admin = await AdminSchema.findOne();

      const totalCharge = Number(
        ((deliveryMan?.charge || 0) * value.distance).toFixed(2),
      );

      const adminCharge = deliveryMan?.createdByAdmin
        ? Number((totalCharge % deliveryMan?.adminCharge || 0).toFixed(2))
        : 0;

      const createdBy = deliveryMan?.createdByMerchant
        ? 'MERCHANTDELIVERYMAN'
        : 'ADMINDELIVERYMAN';
      const paymentStatus = updatedOrder?.cashOnDelivery
        ? 'CASHONDELIVERY'
        : 'DIRECTPAYMENT';
      const deliveryManWallet = updatedOrder?.paymentCollectionRupees
        ? updatedOrder.paymentCollectionRupees
        : 0;
      const data = {
        adminId: admin?._id || '',
        merchantId: req?.id || '',
        deliveryManId: value.deliveryManId,
        orderId: updatedOrder.orderId,
        orderIdForMerchant: updatedOrder.showOrderNumber,
        miles: value.distance,
        payPerMiles: deliveryMan?.charge || 0,
        totalPaytoDeliveryMan: totalCharge,
        totalPaytoAdmin: adminCharge,
        deliveryManWallet: deliveryManWallet,
        deliveryManType: createdBy,
        paymentStatus: paymentStatus,
        orderPickupTime: new Date(),
        orderDeleverTime: new Date(),
      };
      console.log(data, 'data');

      console.log(updatedOrder.orderId, 'orderId');

      await paymentGetSchema.findOneAndUpdate(
        { orderId: updatedOrder.orderId },
        { $set: data },
        { new: true },
      );
    }

    // If deliveryManId is updated, update the assignee table too

    if (value.deliveryManId) {
      if (existingOrder.status === 'UNASSIGNED') {
        const updatedOrder = await orderSchema.findOneAndUpdate(
          { _id: orderId },
          { status: 'ASSIGNED' },
          // { new: true }, // Return the updated order object
        );

        await paymentGetSchema.findOneAndUpdate(
          { orderId: updatedOrder.orderId },
          { $set: { statusOfOrder: 'ASSIGNED' } },
          { new: true },
        );

        await OrderAssigneeSchema.updateOne(
          { _id: orderId },
          { deliveryBoy: value.deliveryManId },
        );
        await OrderHistorySchema.create({
          message: 'Order has been assigned',
          order: updatedOrder.orderId,
          merchantID: updatedOrder.merchant,
          status: ORDER_HISTORY.ASSIGNED,
        });
      } else {
        await OrderAssigneeSchema.updateOne(
          { order: existingOrder.orderId },
          { deliveryBoy: value.deliveryManId },
        );
      }
    }

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
      OrderHistorySchema.deleteMany({
        order: value.orderId,
        merchantID: isCreated.merchant,
      }),
      OrderHistorySchema.create({
        message: `Your order ${value.orderId} has been cancelled`,
        order: value.orderId,
        status: ORDER_HISTORY.CANCELLED,
        merchantID: isCreated.merchant,
      }),
    ]);

    await createNotification({
      userId: isCreated.merchant,
      title: 'Order Cancelled',
      message: `Your order ${value.orderId} has been cancelled`,
      type: 'MERCHANT',
      orderId: value.orderId,
    });

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

          parcelsCount: 1,
          customerName: '$deliveryDetails.name',
          cutomerEmail: '$deliveryDetails.email',
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
          distance: {
            $ifNull: ['$distance', '-'],
          },
          duration: {
            $ifNull: ['$duration', '-'],
          },
          trashed: {
            $ifNull: ['$trashed', false],
          },
          showOrderNumber: 1,
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

export const getAllOrdersFromMerchantMulti = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const { startDate, endDate, getallcancelledorders = 'false' } = req.query;

    let dateFilter = {};

    if (getallcancelledorders === 'true') {
      dateFilter = {
        $or: [
          { status: ORDER_HISTORY.CANCELLED },
          { status: ORDER_HISTORY.DELIVERED },
        ],
      };
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(23, 59, 59, 999);

      dateFilter = {
        dateTime: {
          $gte: start,
          $lte: end,
        },
      };
    }

    const data = await orderSchemaMulti.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $match: {
          'pickupDetails.merchantId': new mongoose.Types.ObjectId(
            req.params.id,
          ),
          ...dateFilter,
        },
      },
      {
        $lookup: {
          from: 'orderAssigneeMulti',
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
        $addFields: {
          deliveryBoy: '$orderAssignData.deliveryBoy',
        },
      },
      {
        $project: {
          orderAssignData: 0,
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
        $addFields: {
          hasCancelledDelivery: {
            $cond: {
              if: { $eq: [getallcancelledorders, 'true'] },
              then: {
                $anyElementTrue: {
                  $map: {
                    input: '$deliveryDetails',
                    as: 'detail',
                    in: { $eq: ['$$detail.status', ORDER_HISTORY.CANCELLED] },
                  },
                },
              },
              else: true,
            },
          },
        },
      },
      {
        $match: {
          hasCancelledDelivery: true,
        },
      },
      {
        $project: {
          _id: 1,
          orderId: 1,
          isReassign: {
            $ifNull: ['$isReassign', false],
          },
          customerId: 1,
          pickupAddress: '$pickupDetails',
          deliveryAddress: {
            $cond: {
              if: { $eq: [getallcancelledorders, 'true'] },
              then: {
                $filter: {
                  input: '$deliveryDetails',
                  as: 'detail',
                  cond: { $eq: ['$$detail.status', ORDER_HISTORY.CANCELLED] },
                },
              },
              else: '$deliveryDetails',
            },
          },
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
          createdDate: {
            $dateToString: {
              format: '%d-%m-%Y , %H:%M',
              date: '$createdAt',
            },
          },
          pickupRequest: '$pickupDetails.request',
          postCode: '$pickupDetails.postCode',
          status: 1,
          dateTime: 1,
          trashed: {
            $ifNull: ['$trashed', false],
          },
          showOrderNumber: 1,
        },
      },
    ]);

    // console.log("data", data);

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
    const data = await orderSchemaMulti.aggregate([
      {
        $match: {
          // 7 days ago
          createdAt: { $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) },
          merchant: new mongoose.Types.ObjectId(req.id),
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 10,
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
          customerName: { $arrayElemAt: ['$deliveryDetails.name', 0] },
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
              date: { $arrayElemAt: ['$deliveryDetails.orderTimestamp', 0] },
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
          showOrderNumber: 1,
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
    await OrderHistorySchema.deleteMany({ order: OrderData.orderId });
    await orderAssignSchema.deleteMany({ order: OrderData.orderId });

    await createNotification({
      userId: OrderData.merchant,
      orderId: OrderData.orderId,
      title: 'Order Deleted',
      message: `Your order ${OrderData.orderId} has been deleted`,
      type: 'MERCHANT',
    });
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

    await createNotification({
      userId: OrderData.merchant,
      orderId: OrderData.orderId,
      title: trash ? 'Order Moved to Trash' : 'Order Undo to Trash',
      message: trash ? 'Order Moved to Trash' : 'Order Undo to Trash',
      type: 'MERCHANT',
    });
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

export const deleteOrderFormMerchantMulti = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { subOrderId } = req.query;

    if (!id) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    const OrderData = await orderSchemaMulti.findById(id);

    if (!OrderData) {
      return res.badRequest({ message: getLanguage('en').orderNotFound });
    }
    if (!subOrderId || subOrderId === 'null') {
      // Delete entire order if no subOrderId specified or if subOrderId is 'null'
      await orderSchemaMulti.findByIdAndDelete(id);
      await OrderHistorySchema.deleteMany({ order: OrderData.orderId });
      await OrderAssigneeSchemaMulti.deleteMany({ order: OrderData.orderId });

      await createNotification({
        userId: OrderData.merchant,
        orderId: OrderData.orderId,
        title: 'Order Deleted',
        message: `Your order ${OrderData.orderId} has been deleted`,
        type: 'MERCHANT',
      });
    } else {
      // Remove specific delivery detail with matching subOrderId
      await orderSchemaMulti.updateOne(
        { _id: id },
        { $pull: { deliveryDetails: { subOrderId: Number(subOrderId) } } },
      );

      // If no more delivery details left, delete the entire order
      const updatedOrder = await orderSchemaMulti.findById(id);
      if (updatedOrder.deliveryDetails.length === 0) {
        await orderSchemaMulti.findByIdAndDelete(id);
        await OrderHistorySchema.deleteMany({ order: OrderData.orderId });
        await OrderAssigneeSchemaMulti.deleteMany({ order: OrderData.orderId });
      }

      await createNotification({
        userId: OrderData.merchant,
        orderId: OrderData.orderId,
        title: 'Order Deleted',
        message: `Your sub-order ${subOrderId} has been deleted from order ${OrderData.orderId}`,
        type: 'MERCHANT',
      });
    }

    return res.ok({ message: getLanguage('en').orderDeleted });
  } catch (error) {
    console.log('🚀 ~ deleteDeliveryMan ~ error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const moveToTrashMulti = async (req: RequestParams, res: Response) => {
  try {
    const { id } = req.params;
    const { trashed } = req.body;

    if (!id) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    const OrderData = await orderSchemaMulti.findById(id);

    if (!OrderData) {
      return res.badRequest({ message: getLanguage('en').orderNotFound });
    }

    const trash =
      trashed == undefined
        ? OrderData.trashed === true
          ? false
          : true
        : trashed;

    console.log('OrderData', OrderData);
    console.log('trash', trash);

    // Update main order trashed status and all delivery details trashed status
    await orderSchemaMulti.findByIdAndUpdate(id, {
      trashed: trash,
      'deliveryDetails.$[].trashed': trash,
    });

    await createNotification({
      userId: OrderData.merchant,
      orderId: OrderData.orderId,
      title: trash ? 'Order Moved to Trash' : 'Order Undo to Trash',
      message: trash ? 'Order Moved to Trash' : 'Order Undo to Trash',
      type: 'MERCHANT',
    });

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

export const moveToTrashSubOrderMulti = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const subOrderId = Number(req.query.subOrderId);

    if (!id || isNaN(subOrderId)) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    const OrderData = await orderSchemaMulti.findById(id);

    if (!OrderData) {
      return res.badRequest({ message: getLanguage('en').orderNotFound });
    }

    const deliveryDetail = OrderData.deliveryDetails.find(
      (detail: any) => detail.subOrderId === subOrderId,
    );

    if (!deliveryDetail) {
      return res.badRequest({ message: getLanguage('en').orderNotFound });
    }

    // Get current trashed status from deliveryDetail
    console.log(
      '🚀 ~ moveToTrashSubOrderMulti ~ deliveryDetail:',
      deliveryDetail,
    );
    const currentTrashed = (deliveryDetail as { trashed?: boolean })?.trashed;

    console.log(
      '🚀 ~ moveToTrashSubOrderMulti ~ currentTrashed:',
      currentTrashed,
    );
    // Toggle trashed status - if true make false, if false make true
    const trash = currentTrashed ? false : true;

    console.log('🚀 ~ moveToTrashSubOrderMulti ~ trash:', trash);

    // Update trashed status for the specific suborder
    const updateResult = await orderSchemaMulti.updateOne(
      {
        _id: id,
        'deliveryDetails.subOrderId': subOrderId,
      },
      {
        $set: {
          'deliveryDetails.$.trashed': trash,
        },
      },
    );

    if (updateResult.modifiedCount === 0) {
      return res.failureResponse({
        message: getLanguage('en').somethingWentWrong,
      });
    }
    // send notification to delivery man
    if (trash) {
      console.log(OrderData.orderId);

      const oderAssign = await OrderAssigneeSchemaMulti.findOne({
        order: OrderData.orderId,
      });
      if (oderAssign) {
        const deliveryMan = await deliveryManSchema.findById(
          oderAssign?.deliveryBoy,
        );
        if (deliveryMan && deliveryMan?.deviceToken) {
          sendNotificationinapp(
            'Order Cancel By Merchant',
            `Order ${OrderData.orderId} has been Cancel By Merchant`,
            deliveryMan?.deviceToken,
          );
        }
      }
    }

    // Create notification
    await createNotification({
      userId: OrderData.merchant,
      orderId: OrderData.orderId,
      title: trash
        ? 'Sub Order Moved to Trash'
        : 'Sub Order Restored from Trash',
      message: `Sub Order ${subOrderId} ${
        trash ? 'moved to trash' : 'restored from trash'
      }`,
      type: 'MERCHANT',
    });

    return res.ok({
      message: trash
        ? getLanguage('en').orderMoveToTrash
        : getLanguage('en').orderUndoToTrash,
    });
  } catch (error) {
    console.error('🚀 ~ moveToTrashSubOrderMulti ~ error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const moveToTrashMultiOrderarray = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const { orderIds } = req.body;

    if (!orderIds || !Array.isArray(orderIds)) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    const orders = await orderSchemaMulti.find({ _id: { $in: orderIds } });

    if (orders.length !== orderIds.length) {
      return res.badRequest({ message: getLanguage('en').orderNotFound });
    }

    for (const order of orders) {
      const updatedOrder = await orderSchemaMulti.findByIdAndUpdate(
        order._id,
        {
          trashed: true,
          'deliveryDetails.$[].trashed': true,
        },
        { new: true },
      );
      console.log('updatedOrder', updatedOrder);
    }

    return res.ok({ message: getLanguage('en').orderMoveToTrashMulti });
  } catch (error) {
    console.error('Error moving orders to trash:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const sendNotificationToDeliveryMan = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const { deliveryManId, title, message } = req.body;

    if (!deliveryManId || !title || !message) {
      return res.badRequest({ message: 'Missing required fields' });
    }

    const deliveryMan = await deliveryManSchema.findById(deliveryManId);

    if (!deliveryMan) {
      return res.badRequest({ message: 'Delivery man not found' });
    }

    await createNotification({
      userId: deliveryManId,
      title,
      message,
      type: 'DELIVERYMAN',
    });

    return res.ok({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const reassignOrder = async (req: RequestParams, res: Response) => {
  try {
    const { merchantId, orderId } = req.query;

    if (!merchantId || !orderId) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    const order = await orderSchemaMulti.findOne({
      merchant: new mongoose.Types.ObjectId(merchantId),
      orderId: Number(orderId),
    });

    if (!order) {
      return res.badRequest({ message: getLanguage('en').orderNotFound });
    }

    if (order.isReassign) {
      return res.badRequest({
        message: getLanguage('en').orderAlreadyReassigned,
      });
    }

    await orderSchemaMulti.updateOne(
      { _id: order._id },
      { $set: { isReassign: true } },
    );

    return res.ok({ message: getLanguage('en').orderReassigned });
  } catch (error) {
    console.error('Error reassigning order:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};
