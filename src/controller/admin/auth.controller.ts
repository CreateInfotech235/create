import { Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { PERSON_TYPE } from '../../enum';
import { getLanguage } from '../../language/languageHelper';
import adminSchema from '../../models/admin.schema';
import authTokenSchema from '../../models/authToken.schema';
import otpSchema from '../../models/otp.schema';
import {
  createAuthTokens,
  emailOrMobileOtp,
  generateIntRandomNo,
  passwordValidation,
  removeUploadedFile,
  uploadFile,
} from '../../utils/common';
import { RequestParams } from '../../utils/types/expressTypes';
import validateParamsWithJoi from '../../utils/validateRequest';
import { adminSignInValidation } from '../../utils/validation/adminSide.validation';
import {
  adminCredentialValidation,
  adminProfileValidation,
  otpVerifyValidation,
  renewTokenValidation,
} from '../../utils/validation/auth.validation';
import orderHistorySchema from '../../models/orderHistory.schema';
import orderSchema from '../../models/order.schema';
import orderAssignSchema from '../../models/orderAssignee.schema';
import deliveryManSchema from '../../models/deliveryMan.schema';
import subscribedSchema from '../../models/subcription.schema';

export const signIn = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      email: string;
      password: string;
    }>(req.body, adminSignInValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }
    const { value } = validateRequest;

    const userExist = await adminSchema.findOne({ email: value.email });

    if (!userExist) {
      return res.badRequest({
        message: getLanguage('en').invalidLoginCredentials,
      });
    }

    const isVerifyPassword = await passwordValidation(
      value.password,
      userExist.password as string,
    );

    if (!isVerifyPassword) {
      return res.badRequest({
        message: getLanguage('en').invalidLoginCredentials,
      });
    }

    const { accessToken, refreshToken } = createAuthTokens(userExist._id);

    return res.ok({
      message: getLanguage('en').loginSuccessfully,
      data: { data: userExist, adminAuthData: { accessToken, refreshToken } },
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const profileCredentialUpdate = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      adminId: string;
      email: string;
      contactNumber: number;
      countryCode: string;
      otp: number;
    }>(req.body, adminCredentialValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }
    const { value } = validateRequest;

    const otpData = await otpSchema.findOne({
      value: value.otp,
      customerEmail: value.email,
      expiry: { $gte: Date.now() },
    });

    if (!otpData) {
      return res.badRequest({ message: getLanguage('en').otpExpired });
    }

    await adminSchema.updateOne({ _id: value.adminId }, { $set: value });

    return res.ok({
      message: getLanguage('en').dataUpdatedSuccessfully,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const sendEmailOrMobileOtp = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      email: string;
      contactNumber: number;
      countryCode: string;
      personType: PERSON_TYPE;
    }>(req.body, otpVerifyValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const otp =
      process.env.ENV === 'DEV' ? 999999 : generateIntRandomNo(111111, 999999);

    await emailOrMobileOtp(
      value.email,
      `This is your otp for registration ${otp}`,
    );

    await otpSchema.updateOne(
      {
        value: otp,
        customerEmail: value.email,
        customerMobile: value.contactNumber,
      },
      {
        value: otp,
        customerEmail: value.email,
        customerMobile: value.contactNumber,
        action: value.personType,
        expiry: Date.now() + 600000,
      },
      { upsert: true },
    );

    return res.ok({
      message: getLanguage('en').otpSentSuccess,
      data: process.env.ENV !== 'DEV' ? {} : { otp },
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const profileUpdate = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      adminId: string;
      name: string;
      profileImage: string;
    }>(req.body, adminProfileValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }
    const { value } = validateRequest;

    const image = value.profileImage.split(',');

    const adminData = await adminSchema.findOne(
      { _id: value.adminId },
      { profileImage: 1 },
    );

    if (adminData?.profileImage) {
      removeUploadedFile(adminData.profileImage);
    }

    value.profileImage = await uploadFile(image[0], image[1], 'ADMIN-PROFILE');

    await adminSchema.updateOne({ _id: value.adminId }, { $set: value });

    return res.ok({
      message: getLanguage('en').dataUpdatedSuccessfully,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const renewToken = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      refreshToken: string;
    }>(req.body, renewTokenValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const data = verify(
      value.refreshToken,
      process.env.REFRESH_SECRET_KEY,
    ) as JwtPayload;

    if (!data?.accessToken) {
      return res.badRequest({ message: getLanguage('en').invalidToken });
    }

    const adminVerify = await adminSchema.findById(data.id);

    if (!adminVerify) {
      return res.badRequest({ message: getLanguage('en').invalidToken });
    }

    await authTokenSchema.create({
      accessToken: data.accessToken,
      refreshToken: value.refreshToken,
    });

    const { accessToken, refreshToken } = createAuthTokens(adminVerify._id);

    return res.ok({
      message: getLanguage('en').renewTokenSuccessfully,
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    console.log(error);
    
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const logout = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      refreshToken: string;
      personType: PERSON_TYPE;
    }>(req.body, renewTokenValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const data = verify(
      value.refreshToken,
      process.env.REFRESH_SECRET_KEY,
    ) as JwtPayload;

    if (!data?.accessToken) {
      return res.badRequest({ message: getLanguage('en').invalidToken });
    }

    const adminVerify = await adminSchema.findById(data.id);

    if (!adminVerify) {
      return res.badRequest({ message: getLanguage('en').invalidToken });
    }

    const checkTokenExist = await authTokenSchema.findOne({
      accessToken: data.accessToken,
      refreshToken: value.refreshToken,
      isActive: false,
    });

    if (checkTokenExist) {
      return res.badRequest({ message: getLanguage('en').invalidToken });
    }

    await authTokenSchema.create({
      accessToken: data.accessToken,
      refreshToken: value.refreshToken,
    });

    return res.ok({
      message: getLanguage('en').logoutSuccessfully,
    });
  } catch (error) {
    console.log(error);
    
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getOrderCounts = async (req: RequestParams, res: Response) => {
  try {
    const totalOrders = await orderSchema.countDocuments();

    const createdOrders = await orderHistorySchema.countDocuments({ status: 'CREATED' });
    const assignedOrders = await orderHistorySchema.countDocuments({ status: 'ASSIGNED' });
    const acceptedOrders = await orderAssignSchema.countDocuments({ status: 'ACCEPTED' });
    const arrivedOrders = await orderHistorySchema.countDocuments({ status: 'ARRIVED' });
    const pickedOrders = await orderHistorySchema.countDocuments({ status: 'PICKED_UP' });
    const departedOrders = await orderHistorySchema.countDocuments({ status: 'DEPARTED' });
    const deliveredOrders = await orderHistorySchema.countDocuments({ status: 'DELIVERED' });
    const cancelledOrders = await orderHistorySchema.countDocuments({ status: 'CANCELLED' });
    const deliveryMan = await deliveryManSchema.countDocuments();
    const subscribedMerchants = await subscribedSchema.countDocuments({ isActive : true});
    const unsubscribedMerchants = await subscribedSchema.countDocuments({ isActive : {$ne : true } });

    let totalCounts = {
      totalOrders,
      createdOrders,
      assignedOrders,
      acceptedOrders,
      arrivedOrders,
      pickedOrders,
      departedOrders,
      deliveredOrders,
      cancelledOrders,
      deliveryMan,
      subscribedMerchants,
      unsubscribedMerchants
    }
    // return res.status(200).json({
    //   success: true,
    //   data: totalCounts
    // });
    return res.ok({
      message: getLanguage('en').countedData,
      data: totalCounts
    });
  } catch (error) {
    console.log(error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};