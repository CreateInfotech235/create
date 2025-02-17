import { NextFunction, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { isApprovedStatus, SUBCRIPTION_REQUEST } from '../enum';
import { getLanguage } from '../language/languageHelper';
import tokenSchema from '../models/token.schema';
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

    const tokenExpired = await tokenSchema.findOne({
      $or: [{ accessToken: token }, { refreshToken: token }],
    });
    console.log(tokenExpired ,"sdfsiuf");

    if (!tokenExpired) {
      return res.badRequest({ message: getLanguage('en').invalidToken1 });
    }

    const checkUserExist = await merchantSchema.findById(data.id);

    if (!checkUserExist) {
      return res.badRequest({ message: getLanguage('en').invalidToken });
    }


    if (checkUserExist.isApproved == isApprovedStatus.REJECTED) {
      return res.badRequest({ message: ` admin rejected your request (${checkUserExist.reason})` });
    }

    if (checkUserExist.isApproved == isApprovedStatus.PENDING) {
      return res.badRequest({ message: ` admin not approved your request (${checkUserExist.reason})` });
    }

    if (checkUserExist.isApproved != isApprovedStatus.APPROVED) {
      return res.badRequest({ message: ` something went wrong (${checkUserExist.reason})` });
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
