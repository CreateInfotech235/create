import customerSchema from '../../models/customer.schema';
import { Response } from 'express';
import { getLanguage } from '../../language/languageHelper';
import { RequestParams } from '../../utils/types/expressTypes';
import validateParamsWithJoi from '../../utils/validateRequest';
import { customerSignUpValidation } from '../../utils/validation/auth.validation';

export const addCustomer = async (req: RequestParams, res: Response) => {
    try {
        const validateRequest = validateParamsWithJoi<{
            name: string;
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
                coordinates: [value.location.longitude, value.location.latitude],
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