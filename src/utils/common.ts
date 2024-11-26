import bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
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

export const sendMailService = (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  return transporter.sendMail({
    from: process.env.APP_EMAIL,
    to,
    subject,
    text,
  });
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
      fs.writeFileSync(
        filePath,
        Buffer.from(base64FormatImage, 'base64'),
      );
      resolve(filePath);
    } catch (error) {
      reject(new Error('Something went wrong with uploading file'));
    }
  });
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
  if (process.env.ENV !== 'DEV') {
    const adminEmailOptionCheck = await adminSettingsSchema.findOne();

    if (adminEmailOptionCheck.emailVerify) {
      await sendMailService(email, 'Email Otp Verification Mail', message);
    }

    if (adminEmailOptionCheck.mobileNumberVerify) {
      // TODO: Third party integration sms service for otp sent to mobile
    }
  }
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
