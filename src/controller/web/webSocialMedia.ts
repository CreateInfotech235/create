import { valid } from 'joi';
import { Request, Response } from 'express';
import Joi from 'joi';
import { SocialMediaType } from './type';
import validateParamsWithJoi from '../../utils/validateRequest';
import { webSocialMediaValidation } from '../../utils/validation/web.validation';
import { getimgurl } from '../getimgurl/getimgurl';
import WebSocialMediaSchema from '../../models/webSocialMedia';

export const createWebSocialMedia = async (req: Request, res: Response) => {
  console.log('req.body', req.body);
  try {
    const validateRequest = validateParamsWithJoi<SocialMediaType>(
      req.body,
      webSocialMediaValidation,
    );
    console.log('validateRequest', validateRequest);
    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }


    for (const socialMedia of validateRequest.value.socialMedia) {
      if (socialMedia.icon.includes('base64')) {
        socialMedia.icon = await getimgurl(socialMedia.icon);
      }
    }
    const webSocialMediaData = await WebSocialMediaSchema.findOne();
    if (webSocialMediaData) {
      await WebSocialMediaSchema.findOneAndUpdate({}, validateRequest.value);
    } else {
       await WebSocialMediaSchema.create(validateRequest.value);
    }

    res.status(200).json({
      status: 200,
      message: 'Web Social Media Created Successfully'
    });
  } catch (error) {
    console.error('Error in createWebSocialMedia:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};


export const getWebSocialMedia = async (req: Request, res: Response) => {
  try {
    const webSocialMedia = await WebSocialMediaSchema.findOne();
    if (!webSocialMedia) {
      return res.status(404).json({
        status: 404,
        message: 'Web Social Media Not Found',
      });
    }
    res.status(200).json({
      status: 200,
      message: 'Web Social Media Fetched Successfully',
      webSocialMedia,
    });
  } catch (error) {
    console.error('Error in getWebSocialMedia:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};
