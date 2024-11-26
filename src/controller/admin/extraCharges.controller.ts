import { Response } from 'express';
import { getLanguage } from '../../language/languageHelper';
import extraChargeSchema from '../../models/extraCharges.schema';
import { getMongoCommonPagination } from '../../utils/common';
import { RequestParams } from '../../utils/types/expressTypes';
import validateParamsWithJoi from '../../utils/validateRequest';
import { paginationValidation } from '../../utils/validation/adminSide.validation';
import {
  createExtraChargesValidation,
  deleteExtraChargesValidation,
  updateExtraChargesValidation,
} from '../../utils/validation/extraCharges.validation';
import { IExtraCharges, IExtraChargesDelete } from './types/charges';

export const createExtraCharges = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<IExtraCharges>(
      req.body,
      createExtraChargesValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    await extraChargeSchema.create(value);

    return res.ok({});
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const updateExtraCharges = async (req: RequestParams, res: Response) => {
  try {
    Object.assign(req.body, req.params);
    const validateRequest = validateParamsWithJoi<IExtraCharges>(
      req.body,
      updateExtraChargesValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const checkExtraChargeExist = await extraChargeSchema.findById(
      value.extraChargeId,
    );

    if (!checkExtraChargeExist) {
      return res.badRequest({ message: getLanguage('en').errorDataNotFound });
    }

    await extraChargeSchema.updateOne(
      { _id: value.extraChargeId },
      { $set: value },
    );

    return res.ok({});
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const deleteExtraCharge = async (req: RequestParams, res: Response) => {
  try {
    Object.assign(req.params, req.body);
    const validateRequest = validateParamsWithJoi<IExtraChargesDelete>(
      req.params,
      deleteExtraChargesValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const checkVehicleExist = await extraChargeSchema.findById(
      value.extraChargeId,
    );

    if (!checkVehicleExist) {
      return res.badRequest({ message: getLanguage('en').errorDataNotFound });
    }

    await extraChargeSchema.updateOne(
      { _id: value.extraChargeId },
      { $set: value },
    );

    return res.ok({});
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getExtraCharges = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<IPagination>(
      req.query,
      paginationValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const data = await extraChargeSchema.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: 'country',
          localField: 'country',
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
          localField: 'city',
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
          _id: 0,
          extraChargeId: '$_id',
          title: 1,
          charge: 1,
          chargeType: 1,
          country: '$countryData.countryName',
          city: '$cityData.cityName',
          status: '$status',
          createdDate: '$createdAt',
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
