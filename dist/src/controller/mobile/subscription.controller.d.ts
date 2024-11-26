import { RequestParams } from '../../utils/types/expressTypes';
import { Response } from 'express';
export declare const getApproveSubscription: (req: RequestParams, res: Response) => Promise<Response<any, Record<string, any>>>;
