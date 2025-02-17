import { RequestParams } from '../../utils/types/expressTypes';
import { Response } from 'express';
export declare const getApproveSubscription: (req: RequestParams, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const stripPayment: (req: RequestParams, res: Response) => Promise<void>;
