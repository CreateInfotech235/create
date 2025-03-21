import { Response } from 'express';
import mongoose, { FilterQuery } from 'mongoose';
import {
  ADMIN_ORDER_LOCATIONS,
  CHARGE_METHOD,
  ORDER_HISTORY,
  ORDER_LIST,
  ORDER_REQUEST,
  ORDER_STATUS,
  PERSON_TYPE,
  SUBCRIPTION_REQUEST,
  TRANSACTION_TYPE,
} from '../../enum';
import { getLanguage } from '../../language/languageHelper';
import deliveryManSchema from '../../models/deliveryMan.schema';
import deliveryManDocumentSchema from '../../models/deliveryManDocument.schema';
import OrderSchema from '../../models/order.schema';
import merchantSchema from '../../models/user.schema';
import WalletSchema from '../../models/wallet.schema';
import { getMongoCommonPagination } from '../../utils/common';
import { RequestParams } from '../../utils/types/expressTypes';
import validateParamsWithJoi from '../../utils/validateRequest';
import {
  deliveryManSignUpValidation,
  updatePasswordValidation,
} from '../../utils/validation/auth.validation';
import DeliveryManDocumentSchema from '../../models/deliveryManDocument.schema';
import { encryptPassword, uploadFile } from '../../utils/common';

import {
  deliveryManIdValidation,
  deliveryManListValidation,
  deliveryManOrderListValidation,
  deliveryManWalletListValidation,
  orderLocationValidation,
  orderWiseDeliveryManValidation,
  paginationValidation,
  userWalletListValidation,
  verificationStatusValidation,
} from '../../utils/validation/adminSide.validation';
import {
  AdminOrderLocationType,
  IDeliveryMan,
  IDeliveryManOrderQuery,
  IOrderId,
  IUser,
  IVerificationStatus,
  IWalletList,
} from './types/order';
import { verifyPassword } from '../deliveryBoy/auth.controller';

export const updateVerificationStatus = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const validateRequest = validateParamsWithJoi<IVerificationStatus>(
      req.body,
      verificationStatusValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const Query: FilterQuery<IVerificationStatus> = {
      deliveryManId: value.deliveryManId,
      document: value.documentId,
      status: SUBCRIPTION_REQUEST.PENDING,
    };

    const checkDocumentExist = await deliveryManDocumentSchema.findOne(Query);

    if (!checkDocumentExist) {
      return res.badRequest({
        message: getLanguage('en').errorDocumentNotFound,
      });
    }

    const documentUpdated = await deliveryManDocumentSchema.updateOne(Query, {
      $set: { status: value.status },
    });
    if (documentUpdated) {
      await deliveryManDocumentSchema.updateOne(
        { _id: value.deliveryManId },
        { $set: { isVerified: true } },
      );
    }

    return res.ok({
      message: getLanguage('en').documentVerificationUpdatedSuccessfully,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getDeliveryManDocuments = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const validateRequest = validateParamsWithJoi<IPagination>(
      req.query,
      paginationValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const data = await deliveryManDocumentSchema.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: 'documents',
          localField: 'document',
          foreignField: '_id',
          as: 'documentData',
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$documentData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$deliveryManId',
          data: {
            $push: {
              documentId: '$documentData._id',
              documentName: '$documentData.name',
              createdAt: '$createdAt',
              document: '$image',
              status: '$status',
            },
          },
        },
      },
      {
        $lookup: {
          from: 'deliveryMan',
          localField: '_id',
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
          deliveryManId: '$_id',
          deliveryManName: '$deliveryManData.name',
          documents: '$data',
        },
      },
      {
        $unwind: {
          path: '$documents',
          preserveNullAndEmptyArrays: true,
        },
      },
      ...getMongoCommonPagination({
        pageCount: value.pageCount,
        pageLimit: value.pageLimit,
      }),
    ]);

    return res.ok({ data: data[0] });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getDeliveryManLocations = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const validateRequest = validateParamsWithJoi<IPagination>(
      req.query,
      paginationValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const data = await deliveryManSchema.aggregate([
      {
        $match: {
          isCustomer: false,
        },
      },
      {
        $lookup: {
          from: 'country',
          localField: 'countryId',
          foreignField: '_id',
          as: 'countryData',
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
          path: '$countryData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'city',
          localField: 'cityId',
          foreignField: '_id',
          as: 'cityData',
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
          path: '$cityData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          deliveryManId: '$_id',
          location: 1,
          defaultLocation: 1,
          firstName: 1,
          status: 1,
          lastName: 1,
          // location: {
          //   latitude: { $arrayElemAt: ['$location.coordinates', 1] },
          //   longitude: { $arrayElemAt: ['$location.coordinates', 0] },
          // },
          // country: '$countryData.countryName',
          // city: '$cityData.cityName',
        },
      },
      ...getMongoCommonPagination({
        pageCount: value.pageCount,
        pageLimit: value.pageLimit,
      }),
    ]);

    return res.ok({
      data: data[0],
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getOrderLocations = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<AdminOrderLocationType>(
      req.query,
      orderLocationValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const Query: FilterQuery<AdminOrderLocationType> = { status: value.status };

    const AssignQuery: FilterQuery<AdminOrderLocationType> = {
      status:
        value.status !== ADMIN_ORDER_LOCATIONS.ACCEPTED
          ? ORDER_STATUS.ACCEPTED
          : value.status,
    };

    if (value.status === ADMIN_ORDER_LOCATIONS.ACCEPTED) {
      Query.status = ADMIN_ORDER_LOCATIONS.ASSIGNED;
    } else if (value.status === ADMIN_ORDER_LOCATIONS.ARRIVED) {
      Query.status = ORDER_STATUS.CREATED;
      AssignQuery.status = SUBCRIPTION_REQUEST.PENDING;
    }

    const data = await OrderSchema.aggregate([
      {
        $match: Query,
      },
      {
        $lookup: {
          from: 'orderAssign',
          localField: 'orderId',
          foreignField: 'order',
          as: 'orderAssignData',
          pipeline: [{ $match: AssignQuery }],
        },
      },
      {
        $unwind: {
          path: '$orderAssignData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: { orderAssignData: { $exists: true } },
      },
      {
        $project: {
          _id: 0,
          orderId: 1,
          pickupLocation: '$pickupDetails.location.coordinates',
          deliveryLocation: '$deliveryLocation.coordinates',
        },
      },
    ]);

    return res.ok({ data: data[0] });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getDeliveryManProfileById = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const validateRequest = validateParamsWithJoi<IDeliveryMan>(
      req.params,
      deliveryManIdValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const data = await deliveryManSchema.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(value.deliveryManId),
        },
      },
      {
        $lookup: {
          from: 'country',
          localField: 'countryId',
          foreignField: '_id',
          as: 'countryData',
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
          path: '$countryData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'city',
          localField: 'cityId',
          foreignField: '_id',
          as: 'cityData',
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
          path: '$cityData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'deliveryManDocuments',
          localField: '_id',
          foreignField: 'deliveryManId',
          as: 'documents',
          pipeline: [
            {
              $project: {
                _id: 0,
                documentNumber: 1,
                document: '$image',
              },
            },
          ],
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          countryCode: 1,
          merchantName: 1,
          contactNumber: 1,
          email: 1,
          status: 1,
          address: 1,
          postCode: 1,
          showDeliveryManNumber: 1,
          country: '$countryData.countryName',
          city: '$cityData.cityName',
          registerDate: '$createdAt',
          isVerified: 1,
          createdByAdmin: 1,
          createdByMerchant: 1,
          chargeMethod: { $ifNull: ['$chargeMethod', '-'] },
          charge: { $ifNull: ['$charge', '-'] },
          location: {
            coordinates: '$location.coordinates',
          },
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
export const getDeliveryMans = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<
      {
        createdByAdmin?: boolean;
        createdByMerchant?: boolean;
        isVerified?: boolean;
      } & IPagination
    >(req.query, deliveryManListValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;
    console.log(value, 'value');

    const Query: FilterQuery<{ name: string }> = {
      isCustomer: false,
      isVerified: value.isVerified,
    };

    if (value.createdByAdmin) {
      Query.createdByAdmin = value.createdByAdmin;
    }

    if (value.createdByMerchant) {
      Query.createdByMerchant = value.createdByMerchant;
    }

    const data = await deliveryManSchema.aggregate([
      {
        $match: Query,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: 'country',
          localField: 'countryId',
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
          from: 'merchants',
          localField: 'merchantId',
          foreignField: '_id',
          as: 'merchantData',
          pipeline: [
            {
              $project: {
                _id: 0,
                firstName: 1,
                lastName: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$merchantData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          merchantName: {
            $cond: {
              if: { $ne: ['$merchantData', null] },
              then: {
                $concat: [
                  '$merchantData.firstName',
                  ' ',
                  '$merchantData.lastName',
                ],
              },
              else: 'Unknown Merchant',
            },
          },
        },
      },
      {
        $lookup: {
          from: 'city',
          localField: 'cityId',
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
          firstName: 1,
          lastName: 1,
          countryCode: 1,
          merchantName: 1,
          contactNumber: 1,
          email: 1,
          status: 1,
          address: 1,
          postCode: 1,
          showDeliveryManNumber: 1,
          country: '$countryData.countryName',
          city: '$cityData.cityName',
          registerDate: '$createdAt',
          isVerified: 1,
          createdByAdmin: 1,
          createdByMerchant: 1,
          chargeMethod: { $ifNull: ['$chargeMethod', '-'] },
          charge: { $ifNull: ['$charge', '-'] },
          location: {
            coordinates: '$location.coordinates',
          },
        },
      },
    ]);
    // Adjust totalDataCount to reflect the actual count of the returned data
    const newData = {
      totalDataCount: data.length,
      data: data,
    };

    return res.ok({ data: newData });
  } catch (error) {
    console.log(error, 'error');
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getAllDeliveryMans = async (req: RequestParams, res: Response) => {
  try {
    const data = await deliveryManSchema.aggregate([
      {
        $lookup: {
          from: 'country',
          localField: 'countryId',
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
          localField: 'cityId',
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
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          countryCode: 1,
          contactNumber: 1,
          email: 1,
          address: 1,
          status: 1,
          postCode: 1,

          showDeliveryManNumber: 1,
          country: '$countryData.countryName',
          // city: '$cityData.cityName',
          merchantId: 1,
          createdByMerchant: 1,
          createdByAdmin: 1,
          registerDate: {
            $dateToString: {
              format: '%d-%m-%Y | %H:%M',
              date: '$createdAt',
            },
          },
          isVerified: 1,
          city: 1,
          location: {
            latitude: { $arrayElemAt: ['$location.coordinates', 0] },
            longitude: { $arrayElemAt: ['$location.coordinates', 1] },
          },
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

export const getAllDeliveryMansFromAdmin = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const data = await deliveryManSchema.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $match: { createdByAdmin: true },
      },
      {
        $lookup: {
          from: 'country',
          localField: 'countryId',
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
          localField: 'cityId',
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
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          name: 1,
          countryCode: 1,
          contactNumber: 1,
          email: 1,
          showDeliveryManNumber: 1,
          address: 1,
          postCode: 1,

          status: 1,
          country: '$countryData.countryName',
          city: '$cityData.cityName',
          merchantId: 1,
          createdByMerchant: 1,
          createdByAdmin: 1,
          registerDate: '$createdAt',
          isVerified: 1,
          location: {
            latitude: { $arrayElemAt: ['$location.coordinates', 0] },
            longitude: { $arrayElemAt: ['$location.coordinates', 1] },
          },
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

export const getDeliveryManOrders = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    Object.assign(req.params, req.query);
    const validateRequest = validateParamsWithJoi<IDeliveryMan>(
      req.params,
      deliveryManOrderListValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const Query: FilterQuery<IDeliveryManOrderQuery> = {
      'orderAssignInfo.deliveryBoy': new mongoose.Types.ObjectId(
        value.deliveryManId,
      ),
      'orderAssignInfo.status': ORDER_REQUEST.ACCEPTED,
      status: { $ne: ORDER_HISTORY.DELIVERED },
    };

    if (value.orderListType === ORDER_LIST.COMPLETED) {
      Query.status = ORDER_HISTORY.DELIVERED;
    }

    const data = await OrderSchema.aggregate([
      {
        $lookup: {
          from: 'orderAssign',
          localField: 'orderId',
          foreignField: 'order',
          as: 'orderAssignInfo',
          pipeline: [
            {
              $project: {
                _id: 0,
                deliveryBoy: 1,
                status: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$orderAssignInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: Query,
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
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
        $lookup: {
          from: 'users',
          // localField: 'customer',
          localField: 'merchant',
          foreignField: '_id',
          as: 'userData',
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
          createdAt: 1,
          customerName: '$userData.name',
          pickupAddress: '$pickupDetails.address',
          deliveryAddress: '$deliveryDetails.address',
          deliveryMan: '$deliveryManData.name',
          pickupDate: '$pickupDetails.orderTimestamp',
          deliveryDate: '$deliveryDetails.orderTimestamp',
          pickupRequest: '$pickupDetails.request',
          postCode: '$pickupDetails.postCode',
        },
      },
      ...getMongoCommonPagination({
        pageCount: value.pageCount,
        pageLimit: value.pageLimit,
      }),
    ]);

    return res.ok({ data });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getDeliveryManInfo = async (req: RequestParams, res: Response) => {
  try {
    Object.assign(req.params, req.query);
    const validateRequest = validateParamsWithJoi<IOrderId & IPagination>(
      req.params,
      orderWiseDeliveryManValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const data = await OrderSchema.aggregate([
      {
        $match: {
          orderId: value.orderId,
        },
      },
      {
        $lookup: {
          from: 'deliveryMan',
          localField: 'city',
          foreignField: 'cityId',
          as: 'deliveryMans',
        },
      },
      {
        $unwind: {
          path: '$deliveryMans',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $replaceRoot: {
          newRoot: '$deliveryMans',
        },
      },
      {
        $lookup: {
          from: 'city',
          localField: 'cityId',
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
          deliveryManId: '$_id',
          deliveryManName: '$name',
          city: '$cityData.cityName',
        },
      },
      ...getMongoCommonPagination({
        pageCount: value.pageCount,
        pageLimit: value.pageLimit,
      }),
    ]);

    return res.ok({ data: data[0] });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getDeliveryManNames = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const validateRequest = validateParamsWithJoi<IPagination>(
      req.query,
      paginationValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const data = await deliveryManSchema.aggregate([
      {
        $project: {
          deliveryManId: '$_id',
          deliveryManName: '$name',
        },
      },
      ...getMongoCommonPagination({
        pageCount: value.pageCount,
        pageLimit: value.pageLimit,
      }),
    ]);

    return res.ok({ data: data[0] });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getUserNames = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<IPagination>(
      req.query,
      paginationValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const data = await merchantSchema.aggregate([
      {
        $project: {
          userId: '$_id',
          userName: '$name',
        },
      },
      ...getMongoCommonPagination({
        pageCount: value.pageCount,
        pageLimit: value.pageLimit,
      }),
    ]);

    return res.ok({ data });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getDeliveryManWalletHistory = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    Object.assign(req.params, req.query);
    const validateRequest = validateParamsWithJoi<IDeliveryMan & IWalletList>(
      req.params,
      deliveryManWalletListValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const data = await WalletSchema.aggregate([
      {
        $match: {
          personId: new mongoose.Types.ObjectId(value.deliveryManId),
          userFlag: PERSON_TYPE.DELIVERY_BOY,
          type: value.transactionType,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: 'deliveryMan',
          localField: 'personId',
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
          walletId: '$_id',
          name: '$deliveryManData.name',
          amount: 1,
          availableBalance: 1,
          createdAt: 1,
          status: 1,
        },
      },
      ...getMongoCommonPagination({
        pageCount: value.pageCount,
        pageLimit: value.pageLimit,
      }),
    ]);

    return res.ok({ data });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getUserWithdrawHistory = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    Object.assign(req.params, req.query);
    const validateRequest = validateParamsWithJoi<IUser>(
      req.params,
      userWalletListValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const data = await WalletSchema.aggregate([
      {
        $match: {
          userFlag: PERSON_TYPE.CUSTOMER,
          type: TRANSACTION_TYPE.WITHDRAW,
          status: value.transactionStatus,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'personId',
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
        $project: {
          _id: 0,
          walletId: '$_id',
          name: '$userData.name',
          amount: 1,
          availableBalance: 1,
          createdAt: 1,
          type: 1,
          status: 1,
        },
      },
      ...getMongoCommonPagination({
        pageCount: value.pageCount,
        pageLimit: value.pageLimit,
      }),
    ]);

    return res.ok({ data });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};
export const addDeliveryMan = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      contactNumber: string; // Changed to string to match deliveryMan.schema
      // countryCode: string; // Removed as per context
      address: string;
      postCode: string; // Added postCode to match deliveryMan.schema
      documents: {
        documentId: string;
        image: string;
        documentNumber: string;
      }[];
      // Removed merchantId as per follow-up instructions
      chargeMethod?: CHARGE_METHOD; // Added chargeMethod to match deliveryMan.schema
      charge?: number; // Added charge to match deliveryMan.schema
      image?: string; // Added image to match deliveryMan.schema
      trashed?: boolean; // Added trashed to match deliveryMan.schema
      location: {
        latitude: number;
        longitude: number;
      };
      defaultLocation: {
        latitude: number;
        longitude: number;
      };
    }>(req.body, deliveryManSignUpValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const userExist = await deliveryManSchema.findOne({ email: value.email });
    if (userExist) {
      return res.badRequest({
        message: getLanguage('en').emailRegisteredAlready,
      });
    }

    value.password = await encryptPassword({ password: value.password });

    const data = await deliveryManSchema.create({
      ...value,
      createdByAdmin: true,
      isVerified: true,
      merchantId: req.id,
    });

    if (value?.documents?.length > 0) {
      const documentNames = await Promise.all(
        value.documents.map(async (i, j) => {
          const document = i.image.split(',');
          return {
            document: i.documentId,
            image: await uploadFile(document[0], document[1], `DOCUMENT-${j}-`),
            documentNumber: i.documentNumber,
            deliveryManId: data._id,
          };
        }),
      );
      await DeliveryManDocumentSchema.insertMany(documentNames);
    }

    return res.ok({ message: getLanguage('en').userRegistered, data });
  } catch (error) {
    console.log('🚀 ~ addDeliveryMan ~ error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const deleteDeliveryMan = async (req: RequestParams, res: Response) => {
  try {
    const { deliveryManId } = req.params;

    if (!deliveryManId) {
      return res.badRequest({ message: getLanguage('en').invalidDeliveryMan });
    }

    const deliveryMan = await deliveryManSchema.findById(deliveryManId);

    if (!deliveryMan) {
      return res.badRequest({ message: getLanguage('en').deliveryManNotFound });
    }

    await deliveryManSchema.deleteOne({ _id: deliveryManId });
    await DeliveryManDocumentSchema.deleteMany({ deliveryManId });

    return res.ok({ message: getLanguage('en').deliveryBoysDeleted });
  } catch (error) {
    console.log('🚀 ~ deleteDeliveryMan ~ error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const updateDeliveryManProfileAndPassword = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log(updateData);

    // Update Profile Image Logic

    // Update Password Logic
    if (
      updateData?.oldPassword ||
      updateData?.newPassword ||
      updateData?.confirmPassword
    ) {
      const validateRequest = validateParamsWithJoi<{
        oldPassword: string;
        newPassword: string;
        confirmPassword: string;
      }>(req.body, updatePasswordValidation);

      if (!validateRequest.isValid) {
        return res.badRequest({ message: validateRequest.message });
      }

      const { value } = validateRequest;

      if (value.newPassword !== value.confirmPassword) {
        return res.badRequest({ message: getLanguage('en').passwordMismatch });
      }

      const user = await deliveryManSchema.findById(id);
      if (!user) {
        return res.badRequest({ message: getLanguage('en').userNotFound });
      }

      const isPasswordValid = await verifyPassword({
        password: value.oldPassword,
        hash: user.password,
      });
      if (!isPasswordValid) {
        return res.badRequest({
          message: getLanguage('en').invalidOldPassword,
        });
      }

      const hashedPassword = await encryptPassword({
        password: value.newPassword,
      });

      await deliveryManSchema.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } },
      );
    }

    // Update DeliveryMan Profile Data (excluding password)
    const updatedDeliveryMan = await deliveryManSchema.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedDeliveryMan) {
      return res.badRequest({ message: getLanguage('en').deliveryManNotFound });
    }

    return res.ok({
      message: getLanguage('en').dataUpdatedSuccessfully,
      data: updatedDeliveryMan,
    });
  } catch (error) {
    console.error('Error updating delivery man profile or password:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getDeliveryManLocation = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const deliveryManId = req.params.deliveryManId;
    console.log(deliveryManId);

    // Fetch only specific fields, for example: name, location, and contact
    const deliveryBoys = await deliveryManSchema.find(
      { _id: deliveryManId },
      { email: 1, location: 1, defaultLocation: 1, status: 1 }, // Projection: only fetch these fields
    );

    if (!deliveryBoys || deliveryBoys.length === 0) {
      return res.badRequest({ message: getLanguage('en').noDeliveryBoysFound });
    }

    return res.ok({
      message: getLanguage('en').deliveryBoysFetched,
      data: deliveryBoys,
    });
  } catch (error) {
    console.log('🚀 ~ getDeliveryBoysForMerchant ~ error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};
