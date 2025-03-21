import customerSchema from '../../models/customer.schema';
import { Response } from 'express';
import { getLanguage } from '../../language/languageHelper';
import { RequestParams } from '../../utils/types/expressTypes';
import validateParamsWithJoi from '../../utils/validateRequest';
import {
  customerSignUpValidation,
  customerUpdateValidation,
} from '../../utils/validation/auth.validation';
import adminSchema from '../../models/admin.schema';
import mongoose from 'mongoose';
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

    const datamarcent = await adminSchema.findById(req.id);
    await adminSchema.updateOne(
      { _id: req.id },
      { $set: { showCustomerNumber: datamarcent.showCustomerNumber + 1 } },
    );

    const data = await customerSchema.create({
      ...value,
      createdByAdmin: true,
      showCustomerNumber: datamarcent.showCustomerNumber,
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
    const merchantId = await req.query.merchantId;
    if (!merchantId) {
      return res.badRequest({
        message: getLanguage('en').merchantIdRequired,
      });
    }
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
          countryName: '$countryData.countryName',
          city: '$city',
          country: '$country',
          address: '$address',
          postCode: '$postCode',
          firstName: { $ifNull: ['$firstName', ''] },
          lastName: { $ifNull: ['$lastName', ''] },
          email: '$email',
          mobileNumber: '$mobileNumber',
          location: '$location',
          NHS_Number: '$NHS_Number',
          createdDate: '$createdAt',
          customerId: 1,
          merchantId: 1,
          showCustomerNumber: '$showCustomerNumber',
          trashed:1
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
      merchantId?: String;
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
