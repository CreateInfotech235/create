import { NextFunction, Request, Response } from 'express';
import message from './messages';
import { responseData } from './types/expressTypes';

declare module 'express-serve-static-core' {
  interface Response {
    ok(data: responseData): void;
    badRequest(data: responseData): void;
    failureResponse(data: responseData): void;
    insufficientParameters(data: responseData): void;
    unAuthorizedRequest(data: responseData): void;
    accessForbidden(data: responseData): void;
    dataNotFound(data: responseData): void;
  }
}

/**
 *
 * @param {obj} req : request from controller.
 * @param {obj} res : response from controller.
 * @param {*} next : executes the middleware succeeding the current middleware.
 */
const responseHandler = (req: Request, res: Response, next: NextFunction) => {
  const lang = 'en';

  /* When everything is ok. */
  res.ok = (data: responseData) => {
    message.successResponse(data, res, lang);
  };

  /* Some issues arraised due to user mistake such as invalid data format of data */
  res.badRequest = (data: responseData) => {
    message.badRequest(data, res, lang);
  };

  /* This is when something went wrong or the task was not performed properly */
  res.failureResponse = (data: responseData) => {
    message.failureResponse(data, res, lang);
  };

  /* This is when the parameters are missing */
  res.insufficientParameters = (data: responseData) => {
    message.insufficientParameters(data, res, lang);
  };

  /* This is when a user is trying to access data without token */
  res.unAuthorizedRequest = (data: responseData) => {
    message.unAuthorizedRequest(data, res, lang);
  };

  /* User is authenticated but doesn't have rights to access the requested data */
  res.accessForbidden = (data: responseData) => {
    message.accessForbidden(data, res, lang);
  };
  /* Use for data not found */
  res.dataNotFound = (data: responseData) => {
    message.dataNotFound(data, res, lang);
  };
  next();
};

export default responseHandler;
