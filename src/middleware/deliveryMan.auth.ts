import { NextFunction, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { SUBCRIPTION_REQUEST } from '../enum';
import { getLanguage } from '../language/languageHelper';
import tokenSchema from '../models/token.schema';
import deliveryManSchema from '../models/deliveryMan.schema';
import deliveryManDocumentSchema from '../models/deliveryManDocument.schema';
import { RequestParams } from '../utils/types/expressTypes';

export default async (
  req: RequestParams,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken?.includes('Bearer')) {
      // return res.badRequest({ statusCode : 123 , message: getLanguage('en').invalidToken });
      return res
        .status(401)
        .json({ status: 123, message: getLanguage('en').invalidToken });
    }
    console.log('Hello');

    const token = bearerToken.split(' ');

    const data = verify(token[1], process.env.ACCESS_SECRET_KEY) as JwtPayload;

    if (!data) {
      // return res.badRequest({statusCode : 123 , message: getLanguage('en').invalidToken });
      return res
        .status(401)
        .json({ status: 123, message: getLanguage('en').invalidToken });
    }

    const tokenExpired = await tokenSchema.findOne({
      $or: [{ accessToken: token }, { refreshToken: token }],
    });

    if (!tokenExpired) {
      // return res.badRequest({statusCode : 123 , message: getLanguage('en').invalidToken });
      return res
        .status(401)
        .json({ status: 123, message: getLanguage('en').invalidToken });
    }

    const checkUserExist = await deliveryManSchema.findById(data.id);

    if (!checkUserExist) {
      // return res.badRequest({statusCode : 123 , message: getLanguage('en').invalidToken });
      return res
        .status(401)
        .json({ status: 123, message: getLanguage('en').invalidToken });
    }
    if (checkUserExist.status === 'DISABLE') {
      return res
        .status(401)
        .json({
          status: 401,
          message: getLanguage('en').deliveryManInactive,
          data: null,
        });
    }

    const checkDocumentsApproved = await deliveryManDocumentSchema.find(
      { deliveryManId: data.id },
      { _id: 0, status: 1 },
    );

    if (
      checkDocumentsApproved.some(
        (i) => i.status === SUBCRIPTION_REQUEST.PENDING,
      )
    ) {
      // return res.badRequest({
      //   message: getLanguage('en').errorDocumentVerified,
      // });
      return res
        .status(401)
        .json({
          status: 123,
          message: getLanguage('en').errorDocumentVerified,
        });
    }

    req.id = checkUserExist._id;
    req.language = checkUserExist.language;

    next();
  } catch (error) {
    // return res.failureResponse({
    //   statusCode: 123,
    //   message: getLanguage('en').invalidToken,
    // });
    return res
      .status(401)
      .json({ status: 123, message: getLanguage('en').invalidToken });
  }
};
