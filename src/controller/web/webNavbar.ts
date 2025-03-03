import { valid } from 'joi';
import WebNavbar from '../../models/webNavbar.schema';
import { Request, Response } from 'express';
import Joi from 'joi';
import { NavbarType } from './type';
import validateParamsWithJoi from '../../utils/validateRequest';
import { webNavbarValidation } from '../../utils/validation/web.validation';
import { getimgurl } from '../getimgurl/getimgurl';

export const createWebNavbar = async (req: Request, res: Response) => {
  console.log('req.body', req.body);
  try {
    const validateRequest = validateParamsWithJoi<NavbarType>(
      req.body,
      webNavbarValidation,
    );
    console.log('validateRequest', validateRequest);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const logo = validateRequest.value.logo.img;
    const defaultProfileImage = validateRequest.value.defaultProfileImage;

    if (logo.includes('base64')) {
      validateRequest.value.logo.img = await getimgurl(logo);
    }

    if (defaultProfileImage.includes('base64')) {
      validateRequest.value.defaultProfileImage = await getimgurl(
        defaultProfileImage,
      );
    }


   
    const isfasttimecreate = await WebNavbar.findOne();
    console.log('isfasttimecreate', isfasttimecreate);

    if (isfasttimecreate) {
      await WebNavbar.updateOne({}, { $set: validateRequest.value });
      return res.status(200).json({
        status: 200,
        message: 'Web Navbar Updated Successfully',
      });
    }
    console.log('validateRequest.value', validateRequest.value);
    const webNavbar = await WebNavbar.create(validateRequest.value);

    res.status(201).json({
      status: 201,
      message: 'Web Navbar Created Successfully',
      webNavbar,
    });
  } catch (error) {
    console.error('Error in createWebNavbar:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};

export const getWebNavbar = async (req: Request, res: Response) => {
  try {
    const webNavbar = await WebNavbar.findOne();

    if (!webNavbar) {
      return res.status(404).json({
        status: 404,
        message: 'Web Navbar Not Found',
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Web Navbar Fetched Successfully',
      webNavbar,
    });
  } catch (error) {
    console.error('Error in getWebNavbar:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};
