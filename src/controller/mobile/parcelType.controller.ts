import { Response } from 'express';
import { getLanguage } from '../../language/languageHelper';
import parcelSchema from '../../models/parcel.schema';
import { getMongoCommonPagination } from '../../utils/common';
import { RequestParams } from '../../utils/types/expressTypes';
import validateParamsWithJoi from '../../utils/validateRequest';
import {
  createParcelValidation,
  deleteParcelValidation,
  paginationValidation,
  updateParcelValidation,
} from '../../utils/validation/adminSide.validation';
import {
  IParcelType,
  IParcelTypeDelete,
  IParcelTypeUpdate,
} from './types/charges';

export const createParcelTypes = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<IParcelType>(
      req.body,
      createParcelValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const checkParcelType = await parcelSchema.findOne({
      label: { $regex: value.label, $options: 'i' },
    });

    if (checkParcelType) {
      return res.badRequest({
        message: getLanguage('en').errorParcelTypeAlreadyRegistered,
      });
    }

    await parcelSchema.create(value);

    return res.ok({});
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const updateParcelTypes = async (req: RequestParams, res: Response) => {
  try {
    Object.assign(req.body, req.params);
    const validateRequest = validateParamsWithJoi<IParcelTypeUpdate>(
      req.body,
      updateParcelValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const checkParcelTypeExist = await parcelSchema.findById(
      value.parcelTypeId,
    );

    if (!checkParcelTypeExist) {
      return res.badRequest({ message: getLanguage('en').errorDataNotFound });
    }

    await parcelSchema.updateOne({ _id: value.parcelTypeId }, { $set: value });

    return res.ok({});
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const deleteParcelType = async (req: RequestParams, res: Response) => {
  try {
    Object.assign(req.params, req.body);
    const validateRequest = validateParamsWithJoi<IParcelTypeDelete>(
      req.params,
      deleteParcelValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const checkParcelTypeExist = await parcelSchema.findById(
      value.parcelTypeId,
    );

    if (!checkParcelTypeExist) {
      return res.badRequest({ message: getLanguage('en').errorDataNotFound });
    }

    await parcelSchema.updateOne({ _id: value.parcelTypeId }, { $set: value });

    return res.ok({});
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getParcelTypes = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<IPagination>(
      req.query,
      paginationValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const data = await parcelSchema.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 0,
          parcelTypeId: '$_id',
          label: 1,
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
