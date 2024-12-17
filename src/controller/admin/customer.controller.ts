import customerSchema from '../../models/customer.schema';
import { Response } from 'express';
import { getLanguage } from '../../language/languageHelper';
import { RequestParams } from '../../utils/types/expressTypes';
import validateParamsWithJoi from '../../utils/validateRequest';
import { customerSignUpValidation } from '../../utils/validation/auth.validation';

export const addCustomer = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      firstName: string;
      lastName: string;
      country: string;
      city: string;
      address: String;
      postCode: String;
      mobileNumber: String;
      email: String;
      location: {
        latitude: number;
        longitude: number;
      };
    }>(req.body, customerSignUpValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;
    console.log(value);

    const userExist = await customerSchema.findOne({ email: value.email });
    if (userExist) {
      return res.badRequest({
        message: getLanguage('en').emailRegisteredAlready,
      });
    }

    const data = await customerSchema.create({
      ...value,
      createdByAdmin: true,
      location: {
        type: 'Point',
        coordinates: [value?.location?.longitude, value?.location?.latitude],
      },
    });

    return res.ok({ message: getLanguage('en').userRegistered, data });
  } catch (error) {
    console.log('🚀 ~ addCustomer ~ error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getAllCustomer = async (req: RequestParams, res: Response) => {
  try {
    const createdBy = req.params.createdBy === 'true';
    console.log(typeof createdBy);
    // {
    // $match: (() => {
    //   if (req.query.existss === 'true') {
    //     return { merchant: { $exists: true } };
    //   }
    //   if (req.query.existss === 'false') {
    //     return { merchant: { $exists: false } };
    //   }
    //   return {};
    // })(),
    // },
    const customers = await customerSchema.aggregate([
      {
        $lookup: {
          from: 'merchants',
          localField: 'merchantId',
          foreignField: '_id',
          as: 'merchantDetails',
        },
      },
      {
        $unwind: '$merchantDetails',
      },
      {
        $project: {
          showCustomerNumber: 1,
          name: { $concat: ['$firstName', ' ', '$lastName'] },
          firstName: '$firstName',
          lastName: '$lastName',
          address: 1,
          email: 1,
          postCode: 1,
          country: 1,
          city: 1,
          createdByAdmin: 1,
          mobileNumber: 1,
          customerId: 1,
          location: 1,
          merchant: {
            $ifNull: [
              {
                $concat: [
                  { $ifNull: ['$merchantDetails.firstName', ''] },
                  ' ',
                  { $ifNull: ['$merchantDetails.lastName', ''] },
                ],
              },
              '-',
            ],
          },
        },
      },
      {
        // $match: {
        //   createdByAdmin: createdBy,
        // },
        $match: (() => {
          if (req.params.createdBy === 'true') {
            return { createdByAdmin: true };
          }
          if (req.params.createdBy === 'false') {
            return { createdByAdmin: false };
          }
          return {};
        })(),
      },
    ]);

    console.log('🚀 ~ getAllCustomer ~ customers:', customers);
    res.status(200).json({ data: customers });
  } catch (error) {
    console.log('🚀 ~ getAllCustomer ~ error:', error);
    res.status(500).json({ message: getLanguage('en').somethingWentWrong });
  }
};
