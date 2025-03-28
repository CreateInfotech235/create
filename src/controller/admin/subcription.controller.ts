import { Response } from 'express';
import { FilterQuery } from 'mongoose';
import { SUBCRIPTION_REQUEST } from '../../enum';
import { getLanguage } from '../../language/languageHelper';
import subcriptionSchema from '../../models/subcription.schema';
import subcriptionPurchaseSchema from '../../models/subcriptionPurchase.schema';
import merchantSchema from '../../models/user.schema';
import { getMongoCommonPagination } from '../../utils/common';
import { RequestParams } from '../../utils/types/expressTypes';

import validateParamsWithJoi from '../../utils/validateRequest';
import {
  manageSubscriptionValidation,
  paginationValidation,
  subcriptionStatusListValidation,
  subcriptionStatusValidation,
  subscription,
} from '../../utils/validation/adminSide.validation';
import { encryptPassword, uploadFile } from '../../utils/common';
import { userSignUpValidation } from '../../utils/validation/auth.validation';
import {
  AcceptSubcriptionQueryType,
  IManageSubscription,
  ISubcriptionStatusList,
} from './types/subcription';

export const manageSubscriptions = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const validateRequest = validateParamsWithJoi<IManageSubscription>(
      req.body,
      manageSubscriptionValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    if (value.subscriptionId) {
      const checkSubcriptionExist = await subcriptionSchema.findById(
        value.subscriptionId,
      );

      if (!checkSubcriptionExist) {
        return res.badRequest({
          message: getLanguage('en').subcriptionDataNotFound,
        });
      }

      await subcriptionSchema.updateOne(
        { _id: value.subscriptionId },
        {
          $set: {
            ...value,
            ...(value.days && { seconds: value.days * 86400 }),
            ...(value.isDesable && { isDesable: value.isDesable }),
            
          },
        },
      );
    } else {
      value.seconds = value.days * 86400;

      if (await subcriptionSchema.findOne(value)) {
        return res.badRequest({
          message: getLanguage('en').subcriptionAlreadyCreated,
        });
      }

      await subcriptionSchema.create(value);
    }

    return res.ok({ message: getLanguage('en').dataUpdatedSuccessfully });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getSubscriptions = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<IPagination>(
      req.query,
      paginationValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;
    const data = await subcriptionSchema
      .find()
      .sort({ seconds: 1, amount: 1 })
      .skip((value.pageCount - 1) * value.pageLimit)
      .limit(value.pageLimit);
    console.log(data);

    return res.ok({
      data: data,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const deleteSubscription = async (req: RequestParams, res: Response) => {
  try {
    // Validate the request parameters to ensure the subscription ID is provided and valid
    const validateRequest = validateParamsWithJoi<{ id: string }>(
      req.params,
      subscription,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { id } = validateRequest.value;

    // Attempt to delete the subscription from the database
    const deletedSubscription = await subcriptionSchema.findByIdAndDelete(id);

    if (!deletedSubscription) {
      return res.badRequest({
        message: 'Subscription not found or already deleted',
      });
    }

    return res.ok({
      message: 'Subscription deleted successfully',
      data: deletedSubscription,
    });
  } catch (error) {
    // Handle any unexpected errors
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};
export const deletePurchaseSubscription = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    // Validate the request parameters to ensure the subscription ID is provided and valid
    const validateRequest = validateParamsWithJoi<{ id: string }>(
      req.params,
      subscription,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { id } = validateRequest.value;

    // Attempt to delete the subscription from the database
    const deletedSubscription =
      await subcriptionPurchaseSchema.findByIdAndDelete(id);

    if (!deletedSubscription) {
      return res.badRequest({
        message: 'Subscription not found or already deleted',
      });
    }

    return res.ok({
      message: 'Subscription deleted successfully',
      data: deletedSubscription,
    });
  } catch (error) {
    // Handle any unexpected errors
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getApproveSubscription = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const data = await subcriptionPurchaseSchema.find({ status: 'APPROVED' });

    res.status(200).json({
      data: data,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const acceptSubscription = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<AcceptSubcriptionQueryType>(
      req.body,
      subcriptionStatusValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const subcriptionExist = await subcriptionPurchaseSchema.findOne({
      _id: value.subscriptionId,
      status: SUBCRIPTION_REQUEST.PENDING,
    });

    if (!subcriptionExist) {
      return res.badRequest({
        message: getLanguage('en').errorActivation,
      });
    }

    const filter: FilterQuery<AcceptSubcriptionQueryType> = {
      status: SUBCRIPTION_REQUEST.PENDING,
    };

    const data = await subcriptionSchema.findById(
      subcriptionExist.subcriptionId,
    );

    await subcriptionPurchaseSchema.updateOne(filter, {
      $set: {
        status: value.subscriptionStatus,
        expiry: Date.now() + data.seconds * 1000,
      },
    });

    return res.ok({});
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getPendingSubscription = async (
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
    console.log(value);

    const data = await merchantSchema.aggregate([
      {
        $lookup: {
          from: 'subcriptionPurchase',
          localField: '_id',
          // foreignField: 'customer',
          foreignField: 'merchant',
          as: 'subcriptionData',
          pipeline: [
            {
              $match: {
                expiry: { $gte: new Date() },
                status: SUBCRIPTION_REQUEST.PENDING,
              },
            },
            {
              $project: {
                _id: 1,
                status: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$subcriptionData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          subcriptionData: { $exists: true },
        },
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          userName: '$name',
          medicalCertificate: 1,
          medicalCertificateNumber: 1,
          subcriptionId: '$subcriptionData._id',
          subcriptionStatus: '$subcriptionData.status',
          subcriptionCreatedAt: '$subcriptionData.createdAt',
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

export const getUsers = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<
      ISubcriptionStatusList & IPagination
    >(req.query, subcriptionStatusListValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    value.isSubscribed = value.isSubscribed === 'true';

    const data = await merchantSchema.aggregate([
      {
        $lookup: {
          from: 'subcriptionPurchase',
          localField: '_id',
          // foreignField: 'customer',
          foreignField: 'merchant',
          as: 'subcriptionData',
          pipeline: [
            {
              $match: {
                ...(value.isSubscribed && { expiry: { $gte: new Date() } }),
                status: value.isSubscribed
                  ? SUBCRIPTION_REQUEST.APPROVED
                  : {
                      $in: Object.keys(SUBCRIPTION_REQUEST),
                    },
              },
            },
            {
              $project: {
                _id: 1,
                createdAt: -1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$subcriptionData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          'subcriptionData._id': { $exists: value.isSubscribed },
        },
      },
      {
        $sort: {
          'subcriptionData.createdAt': -1,
        },
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          // userName: '$name',
          firstName: 1,
          lastName: 1,
          registerDate: '$createdAt',
          contactNumber: 1,
          countryCode: 1,
          country: 1,
          city: 1,
          address: 1,
          email: 1,
          medicalCertificateNumber: 1,
          status: 1,
          isVerified: 1,
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

export const getAllUsers = async (req: RequestParams, res: Response) => {
  try {
    const data = await merchantSchema.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 1,
          // userName: '$name',
          firstName: 1,
          lastName: 1,
          registerDate: {
            $dateToString: {
              format: '%d-%m-%Y | %H:%M',
              date: '$createdAt',
            },
          },
          contactNumber: 1,
          countryCode: 1,
          address: 1,
          email: 1,
          medicalCertificateNumber: 1,
          status: 1,
          isVerified: 1,
          createdByAdmin: 1,
        },
      },
    ]);

    console.log(data);

    return res.ok({ data });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getAllUsersFromAdmin = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const data = await merchantSchema.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 1,
          // userName: '$name',
          firstName: '$firstName',
          lastName: '$lastName',
          registerDate: '$createdAt',
          contactNumber: 1,
          countryCode: 1,
          address: 1,
          email: 1,
          medicalCertificateNumber: 1,
          status: 1,
          isApproved: 1,
          isVerified: 1,
          reason: 1,
          createdByAdmin: 1,
        },
      },
      {
        $match: (() => {
          if (req.query.existss === 'true') {
            return { createdByAdmin: true };
          }
          if (req.query.existss === 'false') {
            return { createdByAdmin: false };
          }
          return {};
        })(),
      },
    ]);

    return res.ok({ data });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const addUser = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      contactNumber: number;
      countryCode: string;
      image: string;
      address: {
        street: string;
        city: string;
        // state: string;
        postalCode: string;
        country: string;
      };
    }>(req.body, userSignUpValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }
    const { value } = validateRequest;

    const userExist = await merchantSchema.findOne({ email: value.email });

    if (userExist) {
      return res.badRequest({
        message: getLanguage('en').emailRegisteredAlready,
      });
    }

    if (!value.image) {
      value.image = process.env.DEFAULT_PROFILE_IMAGE;
    } else {
      const Image = value.image.split(',');
      value.image = await uploadFile(
        Image[0],
        Image[1],
        'MERCHANT(USER)-PROFILE',
      );
    }

    value.password = await encryptPassword({ password: value.password });

    await merchantSchema.create({
      ...value,
      createdByAdmin: true,
      isVerified: true,
    });

    return res.ok({ message: getLanguage('en').userRegistered });
  } catch (error) {
    console.log('🚀 ~ merchant ~ error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const exportFreeSubscription = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const data = await subcriptionPurchaseSchema.aggregate([
      {
        $lookup: {
          from: 'subcriptions',
          localField: 'subcriptionId',
          foreignField: '_id',
          as: 'subcriptionData',
        },
      },
      {
        $lookup: {
          from: 'merchants',
          localField: 'merchant',
          foreignField: '_id',
          as: 'merchantData',
        },
      },
      {
        $match: {
          'subcriptionData.type': '1 Month Free Trial',
          expiry: { $lt: new Date() },
        },
      },
      {
        $unwind: '$subcriptionData',
      },
      {
        $unwind: '$merchantData',
      },
      {
        $project: {
          _id: 1,
          // name: { $concat: ['$merchantData.firstName', ' ', '$merchantData.lastName'] },
          firstName: '$merchantData.firstName',
          lastName: '$merchantData.lastName',
          contactNumber: { $toString: '$merchantData.contactNumber' },
          email: '$merchantData.email',
          country: '$merchantData.address.country',
          city: '$merchantData.address.city',
          registerDate: {
            $dateToString: {
              format: '%d-%m-%Y , %H:%M',
              date: '$merchantData.createdAt',
            },
          },
          status: 'Disable',
          expiry: {
            $dateToString: {
              format: '%d-%m-%Y , %H:%M',
              date: '$expiry',
            },
          },
        },
      },
    ]);

    res.status(200).json({ data });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const updateProfileOfMerchant = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await merchantSchema.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.badRequest({ message: getLanguage('en').userNotFound });
    }

    return res.ok({
      message: getLanguage('en').dataUpdatedSuccessfully,
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating merchant(user) profile:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const deleteMerchant = async (req: RequestParams, res: Response) => {
  try {
    const { id } = req.params;
    const deletedMerchant = await merchantSchema.findByIdAndDelete(id);
    if (!deletedMerchant) {
      return res.badRequest({ message: getLanguage('en').userNotFound });
    }
    return res.ok({ message: getLanguage('en').userDeleted });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const updateStatus = async (req: RequestParams, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    console.log(updateData, id);

    const updatedUser = await merchantSchema.findByIdAndUpdate(
      id,
      { isApproved: updateData.status, reason: updateData.reason },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.ok({
      message: getLanguage('en').dataUpdatedSuccessfully,
      data: updatedUser,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};
