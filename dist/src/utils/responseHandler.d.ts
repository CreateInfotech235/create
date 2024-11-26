import { NextFunction, Request, Response } from 'express';
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
declare const responseHandler: (req: Request, res: Response, next: NextFunction) => void;
export default responseHandler;
