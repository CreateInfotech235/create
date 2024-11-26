import { NextFunction, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { getLanguage } from '../language/languageHelper';
import adminSchema from '../models/admin.schema';
import authTokenSchema from '../models/authToken.schema';
import { RequestParams } from '../utils/types/expressTypes';

export default async (
  req: RequestParams,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken?.includes('Bearer')) {
      return res.badRequest({ message: getLanguage('en').invalidToken });
    }

    const token = bearerToken.split(' ');

    const data = verify(token[1], process.env.ACCESS_SECRET_KEY) as JwtPayload;

    if (!data) {
      return res.badRequest({ message: getLanguage('en').invalidToken });
    }

    const tokenExpired = await authTokenSchema.findOne({
      $or: [{ accessToken: token }, { refreshToken: token }],
      isActive: false,
    });

    if (tokenExpired) {
      return res.badRequest({ message: getLanguage('en').invalidToken });
    }

    const checkUserExist = await adminSchema.findById(data.id);

    if (!checkUserExist) {
      return res.badRequest({ message: getLanguage('en').invalidToken });
    }

    req.id = checkUserExist._id;
    req.language = checkUserExist.language;

    next();
  } catch (error) {
    console.log('🚀 ~ error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};
