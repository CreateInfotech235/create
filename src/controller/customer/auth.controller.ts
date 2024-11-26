import customerSchema from '../../models/customer.schema';
import { Response } from 'express';
import { getLanguage } from '../../language/languageHelper';
import { RequestParams } from '../../utils/types/expressTypes';
import citySchema from '../../models/city.schema';
import countrySchema from '../../models/country.schema';
import validateParamsWithJoi from '../../utils/validateRequest';
import {
  customerSignUpValidation,
  customerUpdateValidation,
} from '../../utils/validation/auth.validation';

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
      trashed: boolean;
    }>(req.body, customerSignUpValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;
    const userExist = await customerSchema.findOne({ email: value.email });
    if (userExist) {
      return res.badRequest({
        message: getLanguage('en').emailRegisteredAlready,
      });
    }

    const data = await customerSchema.create({
      ...value,
      //   location: {
      //     type: 'Point',
      //     coordinates: [value.location.longitude, value.location.latitude],
      //   },
    });
    console.log(data);

    return res.ok({ message: getLanguage('en').userRegistered, data });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

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
    const data = await customerSchema.aggregate([
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
          createdDate: '$createdAt',
          customerId: 1,
          trashed: {
            $ifNull: ['$trashed', false],
          },
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
