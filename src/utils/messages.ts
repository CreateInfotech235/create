import { Response } from 'express';
import responseCode from './responseCode';
import { responseData } from './types/expressTypes';

export default {
  successResponse: (data: responseData, res: Response, lang: String) =>
    res.status(responseCode.success).json({
      status: 'SUCCESS',
      message:
        data.message ||
        // language[lang]?.requestSuccessfull ||
        'Your request is successfully executed',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    }),

  failureResponse: (data: responseData, res: Response, lang: String) =>
    res.status(responseCode.internalServerError).json({
      status: 'FAILURE',
      message:
        data.message ||
        // language[lang]?.somethingWentWrong ||
        'Internal server error.',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    }),

  badRequest: (data: responseData, res: Response, lang: String) =>
    res.status(responseCode.badRequest).json({
      status: 'BAD_REQUEST',
      message:
        data.message ||
        // language[lang]?.badRequest ||
        'The request cannot be fulfilled due to bad syntax.',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    }),

  insufficientParameters: (data: responseData, res: Response, lang: String) =>
    res.status(responseCode.badRequest).json({
      status: 'BAD_REQUEST',
      message:
        data.message ||
        // language[lang]?.parameterMissing ||
        'Insufficient parameters.',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    }),

  unAuthorizedRequest: (data: responseData, res: Response, lang: String) =>
    res.status(responseCode.unAuthorizedRequest).json({
      status: 'UNAUTHORIZED',
      message:
        data.message ||
        // language[lang]?.unauthorizedUser ||
        'You are not authorized to access the request.',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    }),

  accessForbidden: (data: responseData, res: Response, lang: String) =>
    res.status(responseCode.accessForbidden).json({
      status: 'ACCESS_FORBIDEN',
      message:
        data.message ||
        // language[lang]?.accessForbidden ||
        'You are not authorized to access the request.',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    }),

  dataNotFound: (data: responseData, res: Response, lang: String) =>
    res.status(responseCode.notFound).json({
      status: 'NOT_FOUND',
      message:
        data.message || /*language[lang]?.notFound ||*/ 'Data not found.',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    }),
};
