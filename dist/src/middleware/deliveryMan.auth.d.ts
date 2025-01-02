import { NextFunction, Response } from 'express';
import { RequestParams } from '../utils/types/expressTypes';
declare const _default: (req: RequestParams, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export default _default;
