import { Response } from 'express';
import { getLanguage } from '../../language/languageHelper';
import paymentGetSchema from '../../models/paymentGet.schema';
import { RequestParams } from '../../utils/types/expressTypes';

export const getPaymentData = async (req: RequestParams, res: Response) => {
  try {
    const paymentData = await paymentGetSchema
      .find({})
      .populate('merchantId', 'name email contactNumber')
      .populate('deliveryManId', 'firstName lastName email contactNumber');
    console.log(paymentData, 'paymentData');
    return res.ok({ data: paymentData });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getPaymentTotal = async (req: RequestParams, res: Response) => {
    try {
      const result = await paymentGetSchema.aggregate([
        {
          $group: {
            _id: null,
            totalPaytoAdmin: { $sum: "$totalPaytoAdmin" },
          },
        },
      ]);
      return res.ok({
        data : result[0],
      });
    } catch (error) {
      return res.failureResponse({
        message: getLanguage('en').somethingWentWrong,
      });
    }
  };
  
