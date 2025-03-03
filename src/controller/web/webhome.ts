import WebHome from '../../models/webHome.schema';
import HomeLandingpage from '../../models/Homelandingpage';
import { Request, Response } from 'express';
import { valid } from 'joi';
import WebNavbar from '../../models/webNavbar.schema';
import Joi from 'joi';
import { HomeLandingpageType } from './type';
import validateParamsWithJoi from '../../utils/validateRequest';
import { webhomelandingpageValidation } from '../../utils/validation/web.validation';
import { getimgurl } from '../getimgurl/getimgurl';

export const createWebhomelandingpage = async (req: Request, res: Response) => {
  console.log('req.body', req.body);
  try {
    const validateRequest = validateParamsWithJoi<HomeLandingpageType>(
      req.body,
      webhomelandingpageValidation,
    );
    console.log('validateRequest', validateRequest);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const AutoTyperlist = validateRequest.value.AutoTyperlist;
    const subTitle = validateRequest.value.subTitle;
    const description = validateRequest.value.description;
    const bgImage = validateRequest.value.bgImage;

    if (bgImage.includes('base64')) {
      validateRequest.value.bgImage = await getimgurl(bgImage);
    }

    const isfasttimecreate = await HomeLandingpage.findOne();

    if (isfasttimecreate) {
      await HomeLandingpage.findOneAndUpdate({}, {
        AutoTyperlist: AutoTyperlist,
        subTitle: subTitle,
        description: description,
        bgImage: validateRequest.value.bgImage,
      } );
      return res.status(200).json({
        status: 200,
        message: 'Web Landing Page Updated Successfully',
      });
    }
    else{
      console.log('validateRequest.value', validateRequest.value);
      const webLandingpage = await HomeLandingpage.create(validateRequest.value);

    res.status(201).json({
      status: 201,
      message: 'Web Landing Page Created Successfully',
        webLandingpage,
      });
    }
  } catch (error) {
    console.error('Error in createWebLandingpage:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};

export const getWebLandingPage = async (req: Request, res: Response) => {
  try {
    const webLandingPage = await HomeLandingpage.findOne();

    if (!webLandingPage) {
      return res.status(404).json({
        status: 404,
        message: 'Web Landing Page Not Found',
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Web Landing Page Fetched Successfully',
      webLandingPage,
    });
  } catch (error) {
    console.error('Error in getWebLandingPage:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};


export const updateWebHome = async (req: Request, res: Response) => {
    try {
        const webHome = await WebHome.findOneAndUpdate({}, req.body, { new: true });
        res.status(201).json({
            status: 201,
            message: "Web Home Updated Successfully",
            webHome
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error
        });
    }
}




