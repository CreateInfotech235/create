import { Response } from 'express';
import mongoose, { FilterQuery } from 'mongoose';
import { ORDER_HISTORY } from '../../enum';
import { getLanguage } from '../../language/languageHelper';
import DeliveryManSchema from '../../models/deliveryMan.schema';
import orderSchema from '../../models/order.schema';
import OrderAssigneeSchema from '../../models/orderAssignee.schema';
import { getMongoCommonPagination } from '../../utils/common';
import { RequestParams } from '../../utils/types/expressTypes';
import validateParamsWithJoi from '../../utils/validateRequest';
import {
  orderAdminListValidation,
  orderAssignValidation,
} from '../../utils/validation/order.validation';
import { OrderCreateType } from '../mobile/types/order';
import { AdminOrderListType, OrderAssignType } from './types/order';

export const assignOrder = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<OrderAssignType>(
      req.body,
      orderAssignValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const isCreated = await orderSchema.findOne({
      orderId: value.orderId,
      status: ORDER_HISTORY.CREATED,
    });

    if (!isCreated) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    if (isCreated.status === ORDER_HISTORY.DRAFT) {
      return res.badRequest({ message: getLanguage('en').invalidOrder });
    }

    const checkDeliveryBoyExist = await DeliveryManSchema.findById(value.deliveryManId)

    if (!checkDeliveryBoyExist) {
      return res.badRequest({
        message: getLanguage('en').deliveryManNotFound,
      });
    }

    const alreadyAssigned = await OrderAssigneeSchema.findOne({
      order: value.orderId,
      deliveryBoy: value.deliveryManId,
    });

    if (alreadyAssigned) {
      return res.badRequest({
        message: getLanguage('en').orderAlreadyAssigned,
      });
    }

    await OrderAssigneeSchema.create({
      // order: value.orderId, deliveryBoy:value.deliveryManId, customer: isCreated.customer
      order: value.orderId, deliveryBoy:value.deliveryManId, merchant: isCreated.merchant
    });

    return res.ok({
      message: getLanguage('en').orderAssignedSuccessfully,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getOrders = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<AdminOrderListType>(
      req.query,
      orderAdminListValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const Query: FilterQuery<OrderCreateType> = {};

    if (value.user) {
      // Query.customer = new mongoose.Types.ObjectId(value.user);
      Query.merchant = new mongoose.Types.ObjectId(value.user);
    }

    if (value.status) {
      Query.status = value.status;
    }

    if (value.orderId) {
      Query.orderId = value.orderId;
    }

    const data = await orderSchema.aggregate([
      {
        $match: Query,
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
      {
        $addFields: {
          ...(value.date && {
            createdDate: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
          }),
        },
      },
      {
        $match: {
          ...(value.date && { createdDate: value.date }),
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
              $match: {
                ...(value.deliveryMan && {
                  deliveryBoy: new mongoose.Types.ObjectId(value.deliveryMan),
                }),
              },
            },
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
      //   $match: {
      //     orderAssignData: { $exists: true },
      //   },
      // },
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
                _id: 0,
                name: 1,
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
          _id: 0,
          orderId: 1,
          customerName: '$userData.name',
          pickupAddress: '$pickupDetails.address',
          deliveryAddress: '$deliveryDetails.address',
          deliveryMan: '$deliveryManData.name',
          pickupDate: '$pickupDetails.orderTimestamp',
          deliveryDate: '$deliveryDetails.orderTimestamp',
          createdDate: '$createdAt',
          pickupRequest: '$pickupDetails.request',
          postCode: '$pickupDetails.postCode',
        },
      },
      ...getMongoCommonPagination({
        pageCount: value.pageCount,
        pageLimit: value.pageLimit,
      }),
    ]);

    return res.ok({ data:data[0] });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getAllOrders = async (req: RequestParams, res: Response) => {
  try {

    const data = await orderSchema.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $match: {
          // customer: { $exists: false }
          merchant: { $exists: false }
        }
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
      //   $match: {
      //     orderAssignData: { $exists: true },
      //   },
      // },
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
                _id: 0,
                name: 1,
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
          customerName: '$userData.name',
          pickupAddress: '$pickupDetails',
          deliveryAddress: '$deliveryDetails',
          deliveryMan: '$deliveryManData.name',
          pickupDate: '$pickupDetails.orderTimestamp',
          deliveryDate: '$deliveryDetails.orderTimestamp',
          createdDate: '$createdAt',
          pickupRequest: '$pickupDetails.request',
          postCode: '$pickupDetails.postCode',
          status : 1
        },
      },
    ]);

    return res.ok({ data:data });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};