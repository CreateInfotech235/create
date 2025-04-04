import customerSchema from '../../models/customer.schema';
import { Response } from 'express';
import { getLanguage } from '../../language/languageHelper';
import { RequestParams } from '../../utils/types/expressTypes';
import citySchema from '../../models/city.schema';
import countrySchema from '../../models/country.schema';
import FailedCustomerSchema from '../../models/failedCustomer.schema';
import validateParamsWithJoi from '../../utils/validateRequest';
import {
  customerSignUpValidation,
  customerSignUpValidationmul,
  customerUpdateValidation,
} from '../../utils/validation/auth.validation';
import mongoose from 'mongoose';
import merchantSchema from '../../models/user.schema';

export const createCustomer = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      firstName: string;
      lastName: string;
      customerId: string;
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
      merchantId: String;
      trashed: boolean;
      NHS_Number: String;
    }>(req.body, customerSignUpValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    // const userExist = await customerSchema.findOne({ email: value.email });
    // if (userExist) {
    //   return res.badRequest({
    //     message: getLanguage('en').emailRegisteredAlready,
    //   });
    // }
    console.log(value.email, 'value.email');
    const datamarcent = await merchantSchema.findById(req.body.merchantId);
    await merchantSchema.updateOne(
      { _id: req.body.merchantId },
      { $set: { showCustomerNumber: datamarcent.showCustomerNumber + 1 } },
    );
    console.log(value.email, 'value.email');
    console.log(
      datamarcent.showCustomerNumber,
      value,
      'datamarcent.showCustomerNumber',
    );

    if (value.NHS_Number !== undefined) {
      const isexiste = await customerSchema.findOne({
        NHS_Number: value.NHS_Number,
        merchantId: value.merchantId,
      });
      if (isexiste) {
        return res.badRequest({
          message: 'NHS Number already exists for this merchant',
        });
      }
    }

    const data = await customerSchema.create({
      ...value,
      showCustomerNumber: datamarcent.showCustomerNumber,
      //   location: {
      //     type: 'Point',
      //     coordinates: [value.location.longitude, value.location.latitude],
      //   },
    });
    console.log(value.email, 'value.email');
    console.log(data, 'safdsdgsfdgdfhdghfgh');

    return res.ok({ message: getLanguage('en').userRegistered, data });
  } catch (error) {
    console.log(error, 'safdsdgsfdgdfhdghfgh');
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const createCustomerExal = async (req: RequestParams, res: Response) => {
  try {
    const customers = req.body;

    if (!Array.isArray(customers)) {
      return res.badRequest({
        message: 'Request body must be an array of customers',
      });
    }

    const failed = [];
    const updated = [];
    const created = [];
    const successful = [];

    // Get merchant data
    const merchantId = customers[0]?.merchantId;
    if (!merchantId) {
      return res.badRequest({
        message: 'merchantId is required',
      });
    }

    const merchantData = await merchantSchema.findById(merchantId).lean();
    if (!merchantData) {
      return res.badRequest({
        message: 'Merchant not found',
      });
    }

    let currentCustomerNumber = merchantData.showCustomerNumber;

    // Get existing customers for this merchant
    const existingCustomers = await customerSchema
      .find({
        merchantId: merchantId,
      })
      .lean();

    // Process each customer
    for (const customerData of customers) {
      try {
        // Validate customer data
        const validateRequest = validateParamsWithJoi<{
          firstName: string;
          lastName: string;
          customerId: string;
          country: string;
          city: string;
          address: string;
          postCode: string;
          mobileNumber: string;
          email: string;
          location: {
            latitude: number;
            longitude: number;
          };
          merchantId: string;
          trashed: boolean;
          NHS_Number: string;
        }>(customerData, customerSignUpValidationmul);

        if (!validateRequest.isValid) {
          failed.push({
            success: false,
            data: customerData,
            error: validateRequest.message,
          });
          continue;
        }

        const { value } = validateRequest;

        // Check if customer exists by NHS number
        const existingCustomer = existingCustomers.find(
          (c) => c.NHS_Number === value.NHS_Number,
        );

        if (existingCustomer) {
          // Update existing customer
          updated.push({ ...existingCustomer, ...value });
          successful.push(existingCustomer);
        } else {
          // Create new customer
          created.push({ ...value, showCustomerNumber: currentCustomerNumber });
          currentCustomerNumber++;
        }
      } catch (err) {
        failed.push({
          success: false,
          data: customerData,
          error: err,
        });
      }
    }
    // create customer
    const createCustomer = await customerSchema.create(created);
    console.log(createCustomer, 'createCustomer');
    // update customer
    console.log(updated, 'updated');
    for (let index = 0; index < updated.length; index++) {
      const element = updated[index];
      console.log(element, 'element');
      await customerSchema.findByIdAndUpdate(element._id, {
        ...element,
      });

    }
    console.log(updated.length, 'updated length');

    // Update merchant's customer counter
    await merchantSchema.findByIdAndUpdate(merchantId, {
      showCustomerNumber: currentCustomerNumber,
    });

    return res.ok({
      message: getLanguage('en').userRegistered,
      data: {
        successful: {
          ...successful,
          ...updated,
        },
        failed,
        totalSuccessful: successful.length + updated.length,
        totalFailed: failed.length,
      },
    });
  } catch (error) {
    console.error('Error creating customers:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

// export const createCustomerExal2 = async (
//   req: RequestParams,
//   res: Response,
// ) => {
//   try {
//     const customers = req.body;

//     if (!Array.isArray(customers)) {
//       return res.badRequest({
//         message: 'Request body must be an array of customers',
//       });
//     }

//     const successful = [];
//     const failed = [];

//     // Process customers in parallel batches
//     const batchSize = 10;
//     for (let i = 0; i < customers.length; i += batchSize) {
//       const batch = customers.slice(i, i + batchSize);

//       const results = await Promise.all(
//         batch.map(async (customerData) => {
//           try {
//             const validateRequest = validateParamsWithJoi<{
//               firstName: string;
//               lastName: string;
//               customerId: string;
//               country: string;
//               city: string;
//               address: string;
//               postCode: string;
//               mobileNumber: string;
//               email: string;
//               location: {
//                 latitude: number;
//                 longitude: number;
//               };
//               merchantId: string;
//               trashed: boolean;
//               NHS_Number: string; // Added Patient_ID to the validation schema
//             }>(customerData, customerSignUpValidationmul);

//             if (!validateRequest.isValid) {
//               return {
//                 success: false,
//                 data: customerData,
//                 error: validateRequest.message,
//               };
//             }

//             const { value } = validateRequest;
//             console.log(value);

//             // Check customer existence by Patient_ID and merchant in parallel
//             const [existingCustomer, merchant] = await Promise.all([
//               customerSchema
//                 .findOne({
//                   NHS_Number: value.NHS_Number,
//                   merchantId: value.merchantId,
//                 })
//                 .lean(),
//               await merchantSchema.findById(value.merchantId).lean(),
//             ]);

//             if (existingCustomer) {
//               // Update existing customer if Patient_ID is repeated
//               console.log(existingCustomer, 'existingCustomer');
//               const updatedCustomer = await customerSchema.findByIdAndUpdate(
//                 existingCustomer._id,
//                 {
//                   ...value,
//                   showCustomerNumber: existingCustomer.showCustomerNumber,
//                 },
//                 { new: true },
//               );
//               return {
//                 success: true,
//                 data: updatedCustomer,
//               };
//             }

//             if (!merchant) {
//               return {
//                 success: false,
//                 data: customerData,
//                 error: 'Merchant not found',
//               };
//             }

//             // Update merchant count and create customer
//             const [newCustomer] = await Promise.all([
//               customerSchema.create({
//                 ...value,
//                 showCustomerNumber: merchant.showCustomerNumber,
//               }),
//               await merchantSchema.updateOne(
//                 { _id: value.merchantId },
//                 { $inc: { showCustomerNumber: 1 } },
//               ),
//             ]);

//             return {
//               success: true,
//               data: newCustomer,
//             };
//           } catch (error) {
//             return {
//               success: false,
//               data: customerData,
//               error: 'Unexpected error occurred while creating customer',
//             };
//           }
//         }),
//       );

//       // Process results
//       for (const result of results) {
//         if (result.success) {
//           successful.push(result.data);
//         } else {
//           failed.push({
//             data: result.data,
//             error: result.error,
//             attemptedAt: new Date(),
//             resolved: false,
//           });
//         }
//       }
//     }

//     return res.ok({
//       message: getLanguage('en').userRegistered,
//       data: {
//         successful,
//         failed,
//       },
//     });
//   } catch (error) {
//     console.error('Error creating customers:', error);
//     return res.failureResponse({
//       message: getLanguage('en').somethingWentWrong,
//     });
//   }
// };

export const updateCustomer = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      firstName?: string;
      lastName?: string;
      country?: string;
      city?: string;
      address?: string;
      postCode?: string;
      mobileNumber?: string;
      email?: string;
      location?: {
        latitude: number;
        longitude: number;
      };
      trashed?: boolean;
      merchantId: String;
      NHS_Number: string;
    }>(req.body, customerUpdateValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    // Validate customer existence
    const customer = await customerSchema.findById(req.params.id);
    if (!customer) {
      return res.badRequest({
        message: getLanguage('en').customerNotFound,
      });
    }

    if(value.NHS_Number && value.NHS_Number !== customer.NHS_Number){
      const existingCustomer = await customerSchema.findOne({ NHS_Number: value.NHS_Number, merchantId: customer.merchantId });
      if(existingCustomer){
        return res.badRequest({message: getLanguage('en').NHSNumberAlreadyExists});
      }
    }

    // Check for unique email (if updating email)
    if (value.email && value.email !== customer.email) {
      const emailExists = await customerSchema.findOne({ email: value.email });
      if (emailExists) {
        return res.badRequest({
          message: getLanguage('en').emailRegisteredAlready,
        });
      }
    }

    // Update customer data
    Object.assign(customer, value);

    // Optional: Handle location updates
    if (value.location) {
      customer.location = {
        type: 'Point',
        coordinates: [value.location.longitude, value.location.latitude],
      };
    }

    await customer.save();

    return res.ok({
      message: getLanguage('en').customerUpdated,
      data: customer,
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getCustomers = async (req: RequestParams, res: Response) => {
  try {
    const merchantId = await req.query.merchantId;
    var query = {
      merchantId: new mongoose.Types.ObjectId(merchantId as string),
    };

    const data = await customerSchema.aggregate([
      {
        $match: query,
      },
      {
        $sort: {
          showCustomerNumber: -1, 
        },
      },
      {
        $lookup: {
          from: 'country',
          localField: 'country',
          foreignField: '_id',
          as: 'countryData',
        },
      },
      {
        $unwind: {
          path: '$countryData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'city',
          localField: 'city',
          foreignField: '_id',
          as: 'cityData',
        },
      },
      {
        $unwind: {
          path: '$cityData',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,
          cityId: '$cityData._id',
          city: '$city',
          country: '$country',
          countryName: '$countryData.countryName',
          address: '$address',
          firstName: { $ifNull: ['$firstName', ''] },
          lastName: { $ifNull: ['$lastName', ''] },
          email: '$email',
          mobileNumber: '$mobileNumber',
          postCode: '$postCode',
          location: '$location',
          NHS_Number: '$NHS_Number',
          createdDate: '$createdAt',
          customerId: 1,
          merchantId: 1,
          showCustomerNumber: '$showCustomerNumber',
          trashed: {
            $ifNull: ['$trashed', false],
          },
        },
      },
    ]);
    return res.ok({ data: data === null ? [] : data });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getCities = async (req: RequestParams, res: Response) => {
  try {
    const data = await citySchema.aggregate([
      {
        $lookup: {
          from: 'country',
          localField: 'countryID',
          foreignField: '_id',
          as: 'countryData',
          pipeline: [
            {
              $project: {
                _id: 0,
                countryName: 1,
                currency: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$countryData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'ProductCharges',
          localField: '_id',
          foreignField: 'cityId',
          as: 'productChargeData',
          pipeline: [
            {
              $match: {
                isCustomer: false,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$productChargeData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          cityId: '$_id',
          cityName: '$cityName',
          countryID: 1,
          countryName: '$countryData.countryName',
          currency: '$countryData.currency',
          productChargeId: '$productChargeData._id',
          minimumDistance: '$productChargeData.minimumDistance',
          minimumWeight: '$productChargeData.minimumWeight',
          cancelCharge: '$productChargeData.cancelCharge',
          perDistanceCharge: '$productChargeData.perDistanceCharge',
          perWeightCharge: '$productChargeData.perWeightCharge',
          adminCommission: '$productChargeData.adminCommission',
          commissionType: '$productChargeData.commissionType',
          createdDate: '$createdAt',
          isActive: 1,
        },
      },
    ]);

    return res.ok({ data: data });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getCountries = async (req: RequestParams, res: Response) => {
  try {
    const data = await countrySchema.aggregate([
      {
        $project: {
          _id: 0,
          countryId: '$_id',
          countryName: '$countryName',
          distanceType: 1,
          weightType: 1,
          createdDate: '$createdAt',
          isActive: 1,
        },
      },
    ]);

    return res.ok({ data: data });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const moveToTrashCustomer = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.badRequest({ message: getLanguage('en').invalidcustomer });
    }

    const customerData = await customerSchema.findById(id);
    const trash = customerData.trashed === true ? false : true;

    if (!customerData) {
      return res.badRequest({ message: getLanguage('en').customerNotFound });
    }

    await customerSchema.findByIdAndUpdate(id, { trashed: trash });

    return res.ok({
      message: trash
        ? getLanguage('en').customerMoveToTrash
        : getLanguage('en').customerUndoToTrash,
    });
  } catch (error) {
    console.log('🚀 ~ deleteDeliveryMan ~ error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const deleteCustomerById = async (req: RequestParams, res: Response) => {
  try {
    const { id } = req.params; // Extract the customer ID from the request parameters.

    // Check if the provided ID is valid.
    if (!id) {
      return res.badRequest({
        message: 'Customer ID is required.',
      });
    }

    // Attempt to find and delete the customer by ID.
    const deletedCustomer = await customerSchema.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.badRequest({
        message: 'Customer not found.',
      });
    }

    // Successfully deleted.
    return res.ok({
      message: 'Customer deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting customer:', error);

    // Handle unexpected errors.
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};
