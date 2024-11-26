import { Response } from 'express';
import mongoose from 'mongoose';
import { ORDER_HISTORY } from '../../enum';
import { getLanguage } from '../../language/languageHelper';
import citySchema from '../../models/city.schema';
import countrySchema from '../../models/country.schema';
import dayWiseChargeSchema from '../../models/dayWiseFixedCharges.schema';
import orderSchema from '../../models/order.schema';
import productChargesSchema from '../../models/productCharges.schema';
import { getMongoCommonPagination } from '../../utils/common';
import { RequestParams } from '../../utils/types/expressTypes';
import validateParamsWithJoi from '../../utils/validateRequest';
import { paginationValidation } from '../../utils/validation/adminSide.validation';
import {
  cityListValidation,
  createCityValidation,
  createDayWiseChargeValidation,
  dayChargesListValidation,
  updateCityValidation,
  updateDayWiseChargeValidation,
} from '../../utils/validation/city.validation';
import {
  ICity,
  ICityList,
  IDayWiseCharge,
  IProductChargeId,
} from './types/city';

export const createDayWiseCharges = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const validateRequest = validateParamsWithJoi<IDayWiseCharge>(
      req.body,
      createDayWiseChargeValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const checkCharge = await productChargesSchema.findOne({
      _id: value.productChargeId,
      cityId: value.cityId,
    });

    if (!checkCharge) {
      return res.badRequest({
        message: getLanguage('en').errorDataNotFound,
      });
    }

    if (value.hours) {
      value.dayInMs = value.hours * 3600 * 1000;
    }

    const data = await dayWiseChargeSchema
      .findOne({ productChargeId: value.productChargeId })
      .sort({ dayNumber: -1 });

    if (data) {
      value.dayNumber = data.dayNumber + 1;
    } else {
      value.dayNumber = 1;
    }

    value.charge = value.fixedCharge;

    await dayWiseChargeSchema.create(value);

    return res.ok({});
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const updateDayWiseCharges = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const validateRequest = validateParamsWithJoi<IDayWiseCharge>(
      req.body,
      updateDayWiseChargeValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const checkCharge = await productChargesSchema.findOne({
      _id: value.productChargeId,
      cityId: value.cityId,
    });

    if (!checkCharge) {
      return res.badRequest({
        message: getLanguage('en').errorDataNotFound,
      });
    }

    if (value.hours) {
      value.dayInMs = value.hours * 3600 * 1000;
    }

    if (value.fixedCharge) {
      value.charge = value.fixedCharge;
    }

    await dayWiseChargeSchema.updateOne(
      { productChargeId: value.productChargeId, dayNumber: value.dayNumber },
      { $set: value },
    );

    return res.ok({});
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const createCity = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<ICity>(
      req.body,
      createCityValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const country = await countrySchema.findById(value.countryID);

    if (!country) {
      return res.badRequest({ message: getLanguage('en').countryNotFound });
    }

    const checkCityExist = await citySchema.findOne({ cityName: value.cityName });

    if (!checkCityExist) {
      const city = await citySchema.create({
        cityName: value.cityName,
        countryID: country._id,
        commissionType: value.commissionType,
      });

      value.cityId = city._id.toString();
    }

    const checkData = await productChargesSchema.findOne({
      cityId: value.cityId,
      pickupRequest: value.pickupRequest,
      isCustomer: false,
    });

    if (checkData) {
      return res.badRequest({ message: getLanguage('en').errorDataNotFound });
    }

    await productChargesSchema.create(value);

    return res.ok({ message: getLanguage('en').cityCreated });
  } catch (error) {
    console.log("error",error)
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const updateCity = async (req: RequestParams, res: Response) => {
  try {
    Object.assign(req.body, req.params);
    const validateRequest = validateParamsWithJoi<ICity>(
      req.body,
      updateCityValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const country = await countrySchema.findById(value.countryID);

    if (!country) {
      return res.badRequest({ message: getLanguage('en').countryNotFound });
    }

    const orderStatus = [
      ORDER_HISTORY.CREATED,
      ORDER_HISTORY.ASSIGNED,
      ORDER_HISTORY.ARRIVED,
      ORDER_HISTORY.DEPARTED,
      ORDER_HISTORY.PICKED_UP,
      ORDER_HISTORY.DELAYED,
    ];

    const pendingOrders = await orderSchema.find({
      status: { $in: orderStatus },
      isCustomer: false,
      city: value.cityId,
    });

    const isPendingOrders = pendingOrders.length !== 0;

    if ('commissionType' in value && isPendingOrders) {
      return res.badRequest({ message: getLanguage('en').orderNotDelivered });
    }

    let $set: Partial<ICity> = {};

    if (value.cityName || value.commissionType || value.countryID) {
      let { cityName, commissionType, countryID, ...other } = value;
      $set = other;
      await citySchema.updateOne(
        { _id: value.cityId },
        {
          $set: {
            ...(cityName && { cityName: cityName }),
            ...(commissionType && { commissionType }),
            ...(countryID && { countryID }),
          },
        },
      );
    }

    if (!isPendingOrders && JSON.stringify($set) !== '{}') {
      await productChargesSchema.updateOne(
        { cityId: value.cityId },
        {
          $set,
        },
      );
    } else if (isPendingOrders) {
      return res.badRequest({ message: getLanguage('en').orderNotDelivered });
    }

    return res.ok({ message: getLanguage('en').cityUpdated });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getCities = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<ICityList & IPagination>(
      req.query,
      cityListValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const data = await citySchema.aggregate([
      {
        $match: {
          ...(value.cityName && {
            cityName: { $regex: value.cityName, $options: 'i' },
          }),
        },
      },
      {
        $lookup: {
          from: 'country',
          localField: 'countryID',
          foreignField: '_id',
          as: 'countryData',
          pipeline: [
            {
              $project: {
                _id: 0,
                countryName: 1,
                currency: 1,
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
          from: 'ProductCharges',
          localField: '_id',
          foreignField: 'cityId',
          as: 'productChargeData',
          pipeline: [
            {
              $match: {
                isCustomer: false,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$productChargeData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          cityId: '$_id',
          cityName: '$cityName',
          countryID: 1,
          countryName: '$countryData.countryName',
          currency: '$countryData.currency',
          productChargeId: '$productChargeData._id',
          minimumDistance: '$productChargeData.minimumDistance',
          minimumWeight: '$productChargeData.minimumWeight',
          cancelCharge: '$productChargeData.cancelCharge',
          perDistanceCharge: '$productChargeData.perDistanceCharge',
          perWeightCharge: '$productChargeData.perWeightCharge',
          adminCommission: '$productChargeData.adminCommission',
          commissionType: '$productChargeData.commissionType',
          createdDate: '$createdAt',
          isActive: 1,
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

export const getDayWiseChargesByCity = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    Object.assign(req.query, req.params);
    const validateRequest = validateParamsWithJoi<
      IProductChargeId & IPagination
    >(req.query, dayChargesListValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const data = await dayWiseChargeSchema.aggregate([
      {
        $match: {
          productChargeId: new mongoose.Types.ObjectId(value.productChargeId),
        },
      },
      {
        $sort: {
          dayNumber: 1,
        },
      },
      {
        $project: {
          _id: 0,
          dayNumber: 1,
          title: 1,
          hours: { $divide: [{ $divide: ['$dayInMs', 1000] }, 86400] },
          charge: 1,
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

export const getCountryNames = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<IPagination>(
      req.query,
      paginationValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const data = await countrySchema.aggregate([
      {
        $project: {
          _id: 0,
          countryId: '$_id',
          name: 1,
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


export const deleteCity = async (req: RequestParams, res: Response) => {
  try {
    const { cityId } = req.params;

    if (!cityId) {
      return res.badRequest({ message: getLanguage('en').noCityFound });
    }

    const city = await citySchema.findById(cityId);

    if (!city) {
      return res.badRequest({ message: getLanguage('en').noCityFound });
    }

    await citySchema.deleteOne({ _id: cityId });

    return res.ok({ message: getLanguage('en').cityDeleted });
  } catch (error) {
    console.log('🚀 ~ deleteDeliveryMan ~ error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};