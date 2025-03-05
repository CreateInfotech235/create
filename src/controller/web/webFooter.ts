import WebFooter from '../../models/webFooter';
import { Request, Response } from 'express';
import { FooterType } from './type';
import validateParamsWithJoi from '../../utils/validateRequest';
import { FooterpageValidation } from '../../utils/validation/web.validation';
export const createWebFooter = async (req: Request, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<FooterType>(
      req.body,
      FooterpageValidation,
    );


    console.log('validateRequest', validateRequest);
    

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const isalreadycreated = await WebFooter.findOne();
    console.log(isalreadycreated);
    
    if (isalreadycreated) {
      const webFooter = await WebFooter.findOneAndUpdate({}, validateRequest.value, { new: true });
      console.log(webFooter);
  
      return res.status(200).json({
        status: 200,
        message: 'Web Footer Update Successfully',
        webFooter,
      });
    }

    const webFooter = await WebFooter.create(validateRequest.value);

    res.status(201).json({
      status: 201,
      message: 'Web Footer Created Successfully',
      webFooter,
    });
  } catch (error: any) {
    console.error('Error in createWebFooter:', error);
    res.status(500).json({
      status: 500,
      message: error?.message,
    });
  }
};

export const getWebFooter = async (req: Request, res: Response) => {
  try {
    const webFooter = await WebFooter.findOne();

    if (!webFooter) {
      return res.status(404).json({
        status: 404,
        message: 'Web Footer Not Found',
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Web Footer Fetched Successfully',
      webFooter,
    });
  } catch (error) {
    console.error('Error in getWebFooter:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};
