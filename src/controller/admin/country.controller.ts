import { Response } from 'express';
import { ORDER_HISTORY } from '../../enum';
import { getLanguage } from '../../language/languageHelper';
import citySchema from '../../models/city.schema';
import countrySchema from '../../models/country.schema';
import orderSchema from '../../models/order.schema';
import { getMongoCommonPagination } from '../../utils/common';
import { RequestParams } from '../../utils/types/expressTypes';
import validateParamsWithJoi from '../../utils/validateRequest';
import { paginationValidation } from '../../utils/validation/adminSide.validation';
import {
  countryWiseCityValidation,
  createCountryValidation,
  updateCountryValidation,
} from '../../utils/validation/country.validation';
import { ICity } from './types/city';
import { ICountry } from './types/country';

export const createCountry = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<ICountry>(
      req.body,
      createCountryValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    if (await countrySchema.findOne({ countryName: value.countryName })) {
      return res.badRequest({
        message: getLanguage('en').countryRegisteredAlready,
      });
    }

    value.countryName = value.countryName;

    await countrySchema.create(value);

    return res.ok({ message: getLanguage('en').countryCreated });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const updateCountry = async (req: RequestParams, res: Response) => {
  try {
    Object.assign(req.body, req.params);
    const validateRequest = validateParamsWithJoi<ICountry>(
      req.body,
      updateCountryValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

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
      country: value.countryId,
    });

    const isPendingOrders = pendingOrders.length !== 0;

    if (('distanceType' in value || 'weightType' in value) && isPendingOrders) {
      return res.badRequest({ message: getLanguage('en').orderNotDelivered });
    }

    if (value.countryName) {
      value.countryName = value.countryName;
    }

    await countrySchema.updateOne({ _id: value.countryId }, { $set: value });

    return res.ok({ message: getLanguage('en').countryUpdated });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getCountries = async (req: RequestParams, res: Response) => {
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
          countryName: '$countryName',
          distanceType: 1,
          weightType: 1,
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

export const getCitiesByCountry = async (req: RequestParams, res: Response) => {
  try {
    Object.assign(req.params, req.query);
    const validateRequest = validateParamsWithJoi<ICity & IPagination>(
      req.params,
      countryWiseCityValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const data = await citySchema.aggregate([
      {
        $match: {
          countryID: value.countryID,
        },
      },
      {
        $project: {
          _id: 0,
          cityId: '$_id',
          cityName: 1,
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

export const deleteCountry = async (req: RequestParams, res: Response) => {
  try {
    const { countryId } = req.params;

    if (!countryId) {
      return res.badRequest({ message: getLanguage('en').noCountryFound });
    }

    const country = await countrySchema.findById(countryId);

    if (!country) {
      return res.badRequest({ message: getLanguage('en').noCountryFound });
    }

    await countrySchema.deleteOne({ _id: countryId });

    return res.ok({ message: getLanguage('en').countryDeleted });
  } catch (error) {
    console.log('🚀 ~ deleteDeliveryMan ~ error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};