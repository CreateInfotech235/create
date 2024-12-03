import { Response } from 'express';
import mongoose from 'mongoose';
import { ORDER_REQUEST, SWITCH } from '../../enum';
import { getLanguage } from '../../language/languageHelper';
import deliveryManSchema from '../../models/deliveryMan.schema';
import DeliveryManDocumentSchema from '../../models/deliveryManDocument.schema';
import DocumentSchema from '../../models/document.schema';
import otpSchema from '../../models/otp.schema';
import {
  encryptPassword,
  removeUploadedFile,
  uploadFile,
} from '../../utils/common';
import { RequestParams } from '../../utils/types/expressTypes';
import validateParamsWithJoi from '../../utils/validateRequest';
import { deliveryManSignUpValidation } from '../../utils/validation/auth.validation';
import { updatePasswordValidation } from '../../utils/validation/auth.validation';
import { updateLocationValidation } from '../../utils/validation/deliveryMan.validation';
import { IUpdateLocation } from './types/auth';
import bcrypt from 'bcrypt';
export const verifyPassword = async ({
  password,
  hash,
}: {
  password: string;
  hash: string;
}) => {
  return bcrypt.compare(password, hash);
};

export const signUp = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      contactNumber: number;
      otp?: number;
      // countryCode: string;
      address: String;
      postCode: String;
      documents: {
        documentId: string;
        image: string;
        documentNumber: string;
      }[];
      merchantId?: string;
      image: string;
      trashed: boolean;
    }>(req.body, deliveryManSignUpValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;
    console.log(value);

    if (!value.image) {
      value.image = process.env.DEFAULT_PROFILE_IMAGE;
    } else {
      const Image = value.image.split(',');
      value.image = await uploadFile(Image[0], Image[1], 'DELIVERYMAN-PROFILE');
    }

    const isFromMerchantPanel = !!value.merchantId;

    let documents = await DocumentSchema.find({
      isRequired: true,
      status: SWITCH.ENABLE,
    });

    if (!isFromMerchantPanel && documents.length !== value.documents.length) {
      return res.badRequest({
        message: getLanguage('en').errorDocumentMissing,
      });
    }

    if (!isFromMerchantPanel && value.documents.length > 0) {
      documents = await DocumentSchema.find({
        _id: { $in: value.documents.map((i) => i.documentId) },
      });

      if (documents?.length === 0) {
        return res.badRequest({
          message: getLanguage('en').errorInvalidDocument,
        });
      }
    }

    const userExist = await deliveryManSchema.findOne({ email: value.email });
    if (userExist) {
      return res.badRequest({
        message: getLanguage('en').emailRegisteredAlready,
      });
    }

    if (!isFromMerchantPanel && value?.otp) {
      const otpData = await otpSchema.findOne({
        value: value.otp,
        customerEmail: value.email,
        expiry: { $gte: Date.now() },
      });

      if (!otpData) {
        return res.badRequest({ message: getLanguage('en').otpExpired });
      }
    }

    value.password = await encryptPassword({ password: value.password });

    const data = await deliveryManSchema.create({
      ...value,
      createdByMerchant: isFromMerchantPanel,
      isVerified: isFromMerchantPanel ? true : false,
    });

    if (value.documents?.length > 0) {
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
    console.log('🚀 ~ signUp ~ error:', error);
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

export const updateDeliveryManStatus = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const { id } = req.params; // DeliveryMan ID
    const { status } = req.body; // New status (ENABLE/DISABLE)

    if (![SWITCH.ENABLE, SWITCH.DISABLE].includes(status)) {
      return res.badRequest({ message: 'Invalid status value.' });
    }

    const deliveryMan = await deliveryManSchema.findById(id);

    if (!deliveryMan) {
      return res.status(404).json({ message: 'Delivery man not found.' });
    }

    // Update status
    deliveryMan.status = status;
    await deliveryMan.save();

    return res.ok({
      message: 'Status updated successfully.',
      data: deliveryMan,
    });
  } catch (error) {
    console.log('🚀 ~ updateDeliveryManStatus ~ error:', error);
    return res.failureResponse({
      message: 'Something went wrong while updating the status.',
    });
  }
};

export const getDeliveryBoysForMerchant = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const merchantId = req.params.merchantId;
    const deliveryBoys = await deliveryManSchema.find({
      createdByMerchant: true,
      merchantId,
    });
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

export const updateLocation = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<IUpdateLocation>(
      req.body,
      updateLocationValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    await deliveryManSchema.updateOne(
      { _id: req.id },
      {
        $set: {
          // countryId: value.country,
          // cityId: value.city,
          location: {
            type: 'Point',
            coordinates: [value.location.longitude, value.location.latitude],
          },
        },
      },
    );

    return res.ok({});
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

// export const getDeliveryManProfile = async (req: RequestParams, res: Response) => {
//   try {
//     const { id } = req.params;
//     const deliveryMan = await deliveryManSchema.findById(id);
//     if (!deliveryMan) {
//       return res.badRequest({ message: getLanguage('en').deliveryManNotFound });
//     }

//     return res.ok({ data: deliveryMan });
//   } catch (error) {
//     console.error('Error fetching delivery man profile:', error);
//     return res.failureResponse({ message: getLanguage('en').somethingWentWrong });
//   }
// };

export const getDeliveryManProfile = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    // Validate ID before using it
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.badRequest({ message: 'Invalid delivery man ID' });
    }

    const result = await deliveryManSchema
      .aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.params.id),
          },
        },
        {
          $lookup: {
            from: 'orderAssign',
            let: { deliveryBoyId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$deliveryBoy', '$$deliveryBoyId'],
                  },
                },
              },
            ],
            as: 'allOrders',
          },
        },

        {
          $lookup: {
            from: 'orderAssign',
            let: { deliveryBoyId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$deliveryBoy', '$$deliveryBoyId'] },
                      { $eq: ['$status', ORDER_REQUEST.ACCEPTED] },
                    ],
                  },
                },
              },
            ],
            as: 'acceptedOrders',
          },
        },
        {
          $lookup: {
            from: 'orderAssign',
            let: { deliveryBoyId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$deliveryBoy', '$$deliveryBoyId'] },
                      { $eq: ['$status', ORDER_REQUEST.REJECT] },
                    ],
                  },
                },
              },
            ],
            as: 'rejectedOrders',
          },
        },
        {
          $addFields: {
            totalOrderCount: { $size: '$allOrders' },
            totalAcceptedOrders: { $size: '$acceptedOrders' },
            totalCancelledOrders: { $size: '$rejectedOrders' },
          },
        },
        {
          $project: {
            _id: 1,
            cityId: 1,
            countryId: 1,
            address: 1,
            firstName: {
              $ifNull: [
                '$firstName',
                {
                  $ifNull: [
                    { $arrayElemAt: [{ $split: ['$name', ' '] }, 0] },
                    '',
                  ],
                },
              ],
            },
            lastName: {
              $ifNull: [
                '$lastName',
                {
                  $ifNull: [
                    { $arrayElemAt: [{ $split: ['$name', ' '] }, 1] },
                    '',
                  ],
                },
              ],
            },
            email: 1,
            contactNumber: 1,
            image: 1,
            status: 1,
            isVerified: 1,
            createdDate: '$createdAt',
            totalOrderCount: 1,
            totalAcceptedOrders: 1,
            totalCancelledOrders: 1,
            location: 1,
            postCode: 1,
            balance: 1,
            earning: 1,
          },
        },
      ])
      .catch((err) => {
        console.error('Aggregation error:', err);
        return [];
      });

    if (!result || !result.length) {
      return res.badRequest({ message: getLanguage('en').deliveryManNotFound });
    }

    const data = result[0];
    return res.ok({ data });
  } catch (error) {
    console.error('Error fetching delivery man profile:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const deleteDeliveryMan = async (req: RequestParams, res: Response) => {
  try {
    const { id } = req.params;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.failureResponse({
        message: 'Invalid delivery man ID.',
      });
    }

    // Find and delete the delivery man by ID
    const deletedDeliveryMan = await deliveryManSchema.findByIdAndDelete(id);

    if (!deletedDeliveryMan) {
      return res.failureResponse({
        message: 'Delivery man not found.',
      });
    }

    // Send success response
    return res.ok({
      message: 'Delivery man deleted successfully.',
      data: deletedDeliveryMan, // Optional: Send deleted data if needed
    });
  } catch (error) {
    console.error('Error deleting delivery man:', error);
    return res.failureResponse({
      message: 'Something went wrong. Please try again.',
    });
  }
};

export const updateDeliveryManProfile = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (updateData?.image) {
      const Image = updateData.image.split(',');
      const deliveryManData = await deliveryManSchema.findOne(
        { _id: id },
        { image: 1 },
      );

      if (deliveryManData?.image) {
        removeUploadedFile(deliveryManData.image);
      }
      updateData.image = await uploadFile(
        Image[0],
        Image[1],
        'DELIVERYMAN-PROFILE',
      );
    }
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
    console.error('Error updating delivery man profile:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const moveToTrashDeliveryMan = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.badRequest({ message: getLanguage('en').invalidDeliveryMan });
    }

    const deliveryManData = await deliveryManSchema.findById(id);

    if (!deliveryManData) {
      return res.badRequest({ message: getLanguage('en').deliveryManNotFound });
    }

    const trash = deliveryManData.trashed === true ? false : true;

    await deliveryManSchema.findByIdAndUpdate(id, { trashed: trash });

    return res.ok({
      message: trash
        ? getLanguage('en').deliveryManMoveToTrash
        : getLanguage('en').deliveryManUndoToTrash,
    });
  } catch (error) {
    console.log('🚀 ~ moveToTrashDeliveryMan ~ error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};
