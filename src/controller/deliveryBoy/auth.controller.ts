import { Response } from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
import { CHARGE_METHOD, ORDER_REQUEST, ORDER_STATUS, SWITCH } from '../../enum';
import { getLanguage } from '../../language/languageHelper';
import deliveryManSchema from '../../models/deliveryMan.schema';
import DeliveryManDocumentSchema from '../../models/deliveryManDocument.schema';
import DocumentSchema from '../../models/document.schema';
import otpSchema from '../../models/otp.schema';
import {
  emailOrMobileOtp,
  encryptPassword,
  removeUploadedFile,
  uploadFile,
} from '../../utils/common';
import { RequestParams } from '../../utils/types/expressTypes';
import validateParamsWithJoi from '../../utils/validateRequest';
import {
  deliveryManSignUpValidation,
  resetPasswordValidation,
  sendOtpValidation,
  verifyOtpValidation,
} from '../../utils/validation/auth.validation';
import { updatePasswordValidation } from '../../utils/validation/auth.validation';
import { updateLocationValidation } from '../../utils/validation/deliveryMan.validation';
import { IUpdateLocation } from './types/auth';
import bcrypt from 'bcrypt';
import OrderAssigneeSchema from '../../models/orderAssignee.schema';
import OrderAssigneeMultiSchema from '../../models/orderAssigneeMulti.schema';
import OrderSchema from '../../models/order.schema';
import orderMulti from '../../models/orderMulti.schema';
import subcriptionPurchaseSchema from '../../models/subcriptionPurchase.schema';

import merchantSchema from '../../models/user.schema';

import { log } from 'console';

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
      contactNumber: string;
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
      chargeMethod?: CHARGE_METHOD;
      charge?: number;
      image: string;
      trashed: boolean;
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
    console.log(value.email, 'email');

    const userExist = await deliveryManSchema.findOne({
      email: value.email,
    });
    if (userExist) {
      console.log(userExist, 'userExist');

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

    const datamarcent = await merchantSchema.findById(value.merchantId);
    await merchantSchema.updateOne(
      { _id: value.merchantId },
      {
        $set: { showDeliveryManNumber: datamarcent.showDeliveryManNumber + 1 },
      },
    );

    const data = await deliveryManSchema.create({
      ...value,
      location: {
        type: 'Point',
        coordinates: [value.location.longitude, value.location.latitude],
      },
      defaultLocation: {
        type: 'Point',
        coordinates: [
          value.defaultLocation.longitude,
          value.defaultLocation.latitude,
        ],
      },
      createdByMerchant: isFromMerchantPanel,
      isVerified: isFromMerchantPanel ? true : false,
      showDeliveryManNumber: datamarcent.showDeliveryManNumber,
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

    if (updateData?.address) {
      try {
        const apiKey = 'AIzaSyDB4WPFybdVL_23rMMOAcqIEsPaSsb-jzo';
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            updateData.address,
          )}&key=${apiKey}`,
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;

          updateData.defaultLocation = {
            type: 'Point',
            coordinates: [lng, lat],
          };
        } else {
          alert('Address not found. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching geocode data:', error);
        alert(
          'An error occurred while processing the address. Please try again.',
        );
      }
    } else {
      alert('Please enter an address.');
    }
    console.log(updateData.defaultLocation, 'Loc');

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

    console.log(value);
    console.log(req.id);
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

    // const totalOrders = await OrderAssigneeSchema.countDocuments({
    //   deliveryBoy: req.params.id,
    // });
    console.log(req.params.id, 'id');
    const totalsuboder = await OrderAssigneeMultiSchema.aggregate([
      {
        $match: {
          deliveryBoy: new mongoose.Types.ObjectId(req.params.id), // Use the ID from the request parameters
        },
      },
      {
        $lookup: {
          from: 'ordermultis',
          localField: 'order',
          foreignField: 'orderId',
          as: 'orderMultiData',
        },
      },
    ]);

    console.log(totalsuboder, 'totalsuboder');

    let totalOrderCount = 0;
    let totalAssignedOrdersCount = 0;
    let totalCancelledOrders = 0;
    let totalDeliveredOrders = 0;

    for (const item of totalsuboder) {
      if (item.orderMultiData && Array.isArray(item.orderMultiData)) {
        for (const orderMulti of item.orderMultiData) {
          if (
            orderMulti.deliveryDetails &&
            Array.isArray(orderMulti.deliveryDetails)
          ) {
            for (const deliveryDetail of orderMulti.deliveryDetails) {
              if (deliveryDetail.status === ORDER_STATUS.ASSIGNED) {
                totalAssignedOrdersCount++;
              } else if (deliveryDetail.status === ORDER_STATUS.CANCELLED) {
                totalCancelledOrders++;
              } else if (deliveryDetail.status === ORDER_STATUS.DELIVERED) {
                totalDeliveredOrders++;
              }
              totalOrderCount++;
            }
          }
        }
      }
    }

    console.log(totalOrderCount, 'totalOrderCount');
    console.log(totalAssignedOrdersCount, 'totalAssignedOrdersCount');
    console.log(totalCancelledOrders, 'totalCancelledOrders');
    console.log(totalDeliveredOrders, 'totalDeliveredOrders');

    const result = await deliveryManSchema.aggregate([
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
          from: 'orders',
          let: { orderIds: '$allOrders.order' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$orderId', '$$orderIds'] },
                    { $eq: ['$status', 'DELIVERED'] },
                  ],
                },
              },
            },
          ],
          as: 'orderDetails',
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
          totalOrderCount: totalOrderCount,
          totalAcceptedOrders: totalAssignedOrdersCount,
          totalCancelledOrders: totalCancelledOrders,
          totalDeliveredOrders: totalDeliveredOrders,
          totalAssignedOrdersCount: totalAssignedOrdersCount,
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
          totalDeliveredOrders: 1,
          totalAssignedOrdersCount: 1,
          location: 1,
          postCode: 1,
          balance: {
            $round: ['$balance', 2],
          },
          earning: { $ifNull: ['$earning', 0] },
        },
      },
    ]);

    console.log(result);

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

export const getDeliveryManLocation = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const merchantId = req.params.merchantId;
    const deliveryManId = req.query.deliveryManId;
    console.log(deliveryManId);

    // Fetch only specific fields, for example: name, location, and contact
    const deliveryBoys = await deliveryManSchema.find(
      { createdByMerchant: true, merchantId, _id: deliveryManId },
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

export const sendOtp = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<{ email: string }>(
      req.body,
      sendOtpValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    // Check if the user exists
    const user = await deliveryManSchema.findOne({ email: value.email });

    if (!user) {
      return res.badRequest({ message: getLanguage('en').emailNotRegistered });
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await emailOrMobileOtp(
      value.email,
      `This is your otp for Reset Password ${otp}`,
    );
    await otpSchema.create({
      value: otp,
      customerEmail: value.email,
      expiry: otpExpiry,
    });

    // Send OTP (mock or use an actual email/SMS service)
    console.log(`OTP for ${value.email}: ${otp}`);

    return res.ok({ message: getLanguage('en').otpSent });
  } catch (error) {
    console.error('Error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const verifyOtp = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      email: string;
      otp: number;
    }>(req.body, verifyOtpValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    // Validate OTP
    const otpData = await otpSchema.findOne({
      customerEmail: value.email,
      value: value.otp,
      expiry: { $gte: Date.now() },
    });

    if (!otpData) {
      return res.badRequest({ message: getLanguage('en').otpExpired });
    }

    // Optionally, mark OTP as used or delete it
    await otpSchema.deleteOne({ _id: otpData._id });

    return res.ok({ message: getLanguage('en').otpVerified });
  } catch (error) {
    console.error('Error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const resetPassword = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      email: string;
      newPassword: string;
    }>(req.body, resetPasswordValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    // Check if the user exists
    const user = await deliveryManSchema.findOne({ email: value.email });

    if (!user) {
      return res.badRequest({ message: getLanguage('en').emailNotRegistered });
    }

    // Encrypt the new password
    const encryptedPassword = await encryptPassword({
      password: value.newPassword,
    });

    // Update the user's password
    await deliveryManSchema.updateOne(
      { email: value.email },
      { $set: { password: encryptedPassword } },
    );

    return res.ok({ message: getLanguage('en').passwordResetSuccess });
  } catch (error) {
    console.error('Error:', error);
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
    const { id } = req.params;
    console.log(id, 'id1234');

    // Validate ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: false,
        // message: "Invalid customer ID.",
        message: 'Invalid merchant ID.',
      });
    }

    // Fetch subscriptions
    const data = await subcriptionPurchaseSchema
      .find({
        //   status: "APPROVED",
        // customer: id,
        merchant: id,
      })
      .populate('subcriptionId');
    console.log(data, 'data1234');
    // Handle case with no results
    // if (!data.length) {
    //   return res.status(404).json({
    //     status: false,
    //     // message: "No approved subscriptions found for this customer.",
    //     message: 'No approved subscriptions found for this merchant.',
    //   });
    // }

    // Success response
    return res.status(200).json({
      status: true,
      data,
    });
  } catch (error: any) {
    console.error('Error in getApproveSubscription:', error.message);
    return res.status(500).json({
      status: false,
      message: 'Something went wrong while fetching subscriptions.',
    });
  }
};
