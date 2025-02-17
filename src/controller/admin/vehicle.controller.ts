import { Response } from 'express';
import { VEHICLE_CITY_TYPE } from '../../enum';
import { getLanguage } from '../../language/languageHelper';
import vehicleSchema from '../../models/vehicle.schema';
import {
  getMongoCommonPagination,
  removeUploadedFile,
  uploadFile,
} from '../../utils/common';
import { RequestParams } from '../../utils/types/expressTypes';
import validateParamsWithJoi from '../../utils/validateRequest';
import { paginationValidation } from '../../utils/validation/adminSide.validation';
import {
  createVehicleValidation,
  deleteVehicleValidation,
  updateVehicleValidation,
} from '../../utils/validation/vehicle.validation';
import { IVehicleDelete, VehicleType } from './types/vehicle';

export const createVehicle = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<VehicleType>(
      req.body,
      createVehicleValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const image = value.image.split(',');

    value.image = await uploadFile(image[0], image[1], 'VEHICLE');

    value.cityType = value.cityWise;

    await vehicleSchema.create(value);

    return res.ok({});
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const updateVehicle = async (req: RequestParams, res: Response) => {
  try {
    Object.assign(req.body, req.params);
    const validateRequest = validateParamsWithJoi<VehicleType>(
      req.body,
      updateVehicleValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const checkVehicleExist = await vehicleSchema.findById(value.vehicleId);

    if (!checkVehicleExist) {
      return res.badRequest({ message: getLanguage('en').errorDataNotFound });
    }

    if (value.cityWise === VEHICLE_CITY_TYPE.CITY_WISE && !value.city) {
      return res.ok({ message: getLanguage('en').errorCityFieldRequired });
    } else if (value.cityWise === VEHICLE_CITY_TYPE.ALL) {
      value.city = [];
    }

    if (value.image) {
      removeUploadedFile(checkVehicleExist.image);

      const image = value.image.split(',');

      value.image = await uploadFile(image[0], image[1], 'VEHICLE');
    }

    if (value.cityWise) {
      value.cityType = value.cityWise;
    }

    await vehicleSchema.updateOne({ _id: value.vehicleId }, { $set: value });

    return res.ok({});
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const deleteVehicle = async (req: RequestParams, res: Response) => {
  try {
    Object.assign(req.params, req.body);
    const validateRequest = validateParamsWithJoi<IVehicleDelete>(
      req.params,
      deleteVehicleValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const checkVehicleExist = await vehicleSchema.findById(value.vehicleId);

    if (!checkVehicleExist) {
      return res.badRequest({ message: getLanguage('en').errorDataNotFound });
    }

    await vehicleSchema.updateOne({ _id: value.vehicleId }, { $set: value });

    return res.ok({});
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getVehicles = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<IPagination>(
      req.query,
      paginationValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const data = await vehicleSchema.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 0,
          vehicleId: '$_id',
          vehicleImage: '$image',
          vehicleName: '$name',
          vehicleSize: '$size',
          vehicleCapacity: '$capacity',
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

export const getVehiclesForAll = async (req: RequestParams, res: Response) => {
  try {
    const data = await vehicleSchema.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 0,
          vehicleId: '$_id',
          vehicleImage: '$image',
          vehicleName: '$name',
          vehicleSize: '$size',
          vehicleCapacity: '$capacity',
          status: '$status',
          createdDate: '$createdAt',
        },
      },
    ]);

    return res.ok({ data: data });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};
