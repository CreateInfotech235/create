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
    console.log(req.query.existss);

    const customers = await customerSchema.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: 'merchants',
          localField: 'merchantId',
          foreignField: '_id',
          as: 'merchantDetails',
        },
      },
      {
        $unwind: {
          path: '$merchantDetails',
          preserveNullAndEmptyArrays: true, // This ensures merchantDetails is included even if null
        },
      },
      {
        $project: {
          showCustomerNumber: 1,
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
                  { $ifNull: ['$merchantDetails.lastName', ''] },
                ],
              },
              '-',
            ],
          },
        },
      },
      {
        $match: (() => {
          if (req.query.existss === 'true') {
            return { createdByAdmin: true };
          }
          if (req.query.existss === 'false') {
            return { createdByAdmin: false };
          }
          return {};
        })(),
      },
    ]);

    // console.log('🚀 ~ getAllCustomer ~ customers:', customers);
    res.status(200).json({ data: customers });
  } catch (error) {
    console.log('🚀 ~ getAllCustomer ~ error:', error);
    res.status(500).json({ message: getLanguage('en').somethingWentWrong });
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
