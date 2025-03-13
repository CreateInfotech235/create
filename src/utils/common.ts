import bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import mongoose from 'mongoose';
import fs from 'fs';
import jwt, { Secret } from 'jsonwebtoken';
import { Types } from 'mongoose';
import nodemailer from 'nodemailer';
import { PERSON_TYPE, TRANSACTION_TYPE } from '../enum';
import AdminSchema from '../models/admin.schema';
import adminSettingsSchema from '../models/adminSettings.schema';
import DeliveryManSchema from '../models/deliveryMan.schema';
import merchantSchema from '../models/user.schema';
import WalletSchema from '../models/wallet.schema';
import { encryptPasswordParams } from './types/expressTypes';
import Notifications from '../models/notificatio.schema';
import { io } from '../../index';
import orderSchemaMulti from '../models/orderMulti.schema';

export const sendMailService = async (
  to: string,
  subject: string,
  text: string,
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  try {
    await transporter.verify();
    console.log('SMTP server is ready to take messages');
  } catch (error) {
    console.error('SMTP connection error:', error);
    throw new Error('Failed to connect to SMTP server');
  }
  try {
    const info = await transporter.sendMail({
      from: process.env.APP_EMAIL,
      to,
      subject,
      text,
    });
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const passwordValidation = async (
  password: string,
  hashPassword: string,
) => {
  return bcrypt.compare(password, hashPassword);
};

export const encryptPassword = async ({ password }: encryptPasswordParams) => {
  const createHash = await bcrypt.hash(password, 10);
  return createHash;
};

export const generateIntRandomNo = (start: number = 1, end: number = 11) =>
  randomInt(start, end);

export const uploadFile = (
  fileName: string,
  base64FormatImage: string,
  fileType: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const extension = fileName.split(':')[1].split(';')[0].split('/')[1];
      const filePath = `uploads/${Date.now()}-${fileType}.${extension}`;
      fs.writeFileSync(filePath, Buffer.from(base64FormatImage, 'base64'));
      resolve(filePath);
    } catch (error) {
      reject(new Error('Something went wrong with uploading file'));
    }
  });
};

export const createNotification = async ({
  userId,
  subOrderId,
  title,
  message,
  deliveryBoyname,
  ismerchantdeliveryboy,
  type,
  orderId,
  senderId,
  adminId,
}: {
  userId: mongoose.Types.ObjectId;
  subOrderId?: number[];
  title: string;
  message: string;
  deliveryBoyname?: string;
  ismerchantdeliveryboy?: boolean;
  type: 'ADMIN' | 'MERCHANT' | 'DELIVERYMAN';
  orderId?: number;
  senderId?: mongoose.Types.ObjectId;
  adminId?: mongoose.Types.ObjectId;
}) => {
  try {
    const notification = await Notifications.create({
      userId,
      subOrderId,
      title,
      message,
      deliveryBoyname,
      ismerchantdeliveryboy,
      type,
      orderId,
      senderId,
      isRead: false,
      adminId,
    });

    // Get user data to find socket ID
    const user = await merchantSchema.findOne({ _id: userId });
    if (user) {
      io.to(user._id.toString()).emit('notification', {
        _id: notification._id,
        title,
        message,
        subOrderId,
        deliveryBoyname,
        ismerchantdeliveryboy,
        type,
        orderId,
        isRead: false,
        createdAt: notification.createdAt,
      });
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new Error('Failed to create notification');
  }
};

export const updateoderdataNotification = async ({
  userId,
  orderId,
}: {
  userId: mongoose.Types.ObjectId;
  orderId: number;
}) => {
  try {
    // Get order data for this specific order
    const orderData = await orderSchemaMulti.aggregate([
      {
        $match: {
          orderId: orderId,
          'pickupDetails.merchantId': userId,
        },
      },
      {
        $lookup: {
          from: 'orderAssigneeMulti',
          localField: 'orderId',
          foreignField: 'order',
          as: 'orderAssignData',
          pipeline: [
            {
              $project: {
                _id: 0,
                deliveryBoy: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$orderAssignData',
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
                _id: 1,
                firstName: 1,
                lastName: 1,
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
          _id: 1,
          orderId: 1,
          status: 1,
          deliveryDetails: 1,
          pickupDetails: 1,
          deliveryMan: {
            $concat: [
              '$deliveryManData.firstName',
              ' ',
              '$deliveryManData.lastName',
            ],
          },
          deliveryManId: '$deliveryManData._id',
          createdDate: {
            $dateToString: {
              format: '%d-%m-%Y , %H:%M',
              date: '$createdAt',
            },
          },
        },
      },
    ]);

    const user = await merchantSchema.findOne({ _id: userId });
    if (user) {
      try {
        io.to(user._id.toString()).emit('notificationoderdataupdate', {
          orderData: {
            ...orderData[0],
            // Make sure all required fields are included
          },
        });
        console.log('Socket emit successful to:', user._id.toString());
      } catch (error) {
        console.error('Socket emit error:', error);
      }
    }
  } catch (error) {
    console.log('Error fetching order data:', error);
  }
};

export const removeUploadedFile = (fileName: string) => {
  try {
    fs.unlinkSync(fileName);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createAuthTokens = (id: Types.ObjectId) => {
  const accessToken = jwt.sign(
    { id },
    process.env.ACCESS_SECRET_KEY as Secret,
    { expiresIn: +process.env.JWT_EXPIRY },
  );

  const refreshToken = jwt.sign(
    { id, accessToken },
    process.env.REFRESH_SECRET_KEY as Secret,
    { expiresIn: +process.env.JWT_REFRESH_EXPIRY },
  );

  return { accessToken, refreshToken };
};

export const emailOrMobileOtp = async (email: string, message: string) => {
  // if (process.env.ENV !== 'DEV') {

  const adminEmailOptionCheck = await adminSettingsSchema.findOne();

  if (adminEmailOptionCheck.emailVerify) {
    await sendMailService(email, 'Email Otp Verification Mail', message);
  }

  if (adminEmailOptionCheck.mobileNumberVerify) {
    // TODO: Third party integration sms service for otp sent to mobile
  }
  // }
};
export const emailSend = async (
  email: string,
  subject: string,
  message: string,
) => {
  // if (process.env.ENV !== 'DEV') {
  const adminEmailOptionCheck = await adminSettingsSchema.findOne();

  if (adminEmailOptionCheck.emailVerify) {
    await sendMailService(email, subject, message);
  }

  if (adminEmailOptionCheck.mobileNumberVerify) {
    // TODO: Third party integration sms service for otp sent to mobile
  }
  // }
};

export const updateWallet = async (
  amount: number,
  adminId: string,
  personId: string,
  transactionType: TRANSACTION_TYPE,
  transactionMessage: string,
  isCustomer: boolean = true,
) => {
  const isDeposit = transactionType === TRANSACTION_TYPE.DEPOSIT;

  const userBalance = isDeposit ? amount : -amount;

  const adminBalance = isDeposit ? -amount : amount;

  let personData;

  if (isCustomer) {
    personData = await merchantSchema.findOneAndUpdate(
      { _id: personId },
      { $inc: { balance: userBalance } },
      { new: true },
    );
  } else {
    personData = await DeliveryManSchema.findOneAndUpdate(
      { _id: personId },
      { $inc: { balance: userBalance } },
      { new: true },
    );
  }

  await Promise.all([
    WalletSchema.create({
      personId,
      message: transactionMessage,
      type: transactionType,
      userFlag: isCustomer ? PERSON_TYPE.CUSTOMER : PERSON_TYPE.DELIVERY_BOY,
      availableBalance: personData.balance,
      amount,
    }),
    AdminSchema.updateOne(
      { _id: adminId },
      { $inc: { balance: adminBalance } },
    ),
  ]);
};

export const getMongoCommonPagination = ({
  pageCount,
  pageLimit,
}: IPagination) => {
  return [
    {
      $facet: {
        count: [
          {
            $count: 'totalDataCount',
          },
        ],
        data: [
          {
            $skip: (pageCount - 1) * pageLimit,
          },
          {
            $limit: pageLimit,
          },
        ],
      },
    },
    {
      $project: {
        totalDataCount: {
          $ifNull: [
            {
              $arrayElemAt: ['$count.totalDataCount', 0],
            },
            0,
          ],
        },
        data: 1,
      },
    },
  ];
};
