import { NextFunction, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { SUBCRIPTION_REQUEST } from '../enum';
import { getLanguage } from '../language/languageHelper';
import authTokenSchema from '../models/authToken.schema';
import subcriptionPurchaseSchema from '../models/subcriptionPurchase.schema';
import merchantSchema from '../models/user.schema';
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

    const checkUserExist = await merchantSchema.findById(data.id);

    if (!checkUserExist) {
      return res.badRequest({ message: getLanguage('en').invalidToken });
    }

    const checkPlanExpiry = await subcriptionPurchaseSchema.findOne({
      // customer: data.id,
      merchant: data.id,
      expiry: { $gte: Date.now() },
    });

    if (!checkPlanExpiry) {
      return res.badRequest({ message: getLanguage('en').subcriptionExpired });
    } else if (checkPlanExpiry.status !== SUBCRIPTION_REQUEST.APPROVED) {
      return res.badRequest({ message: getLanguage('en').subcriptionPending });
    }

    req.id = checkUserExist._id;
    req.language = checkUserExist.language;

    next();
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};
