import { Response } from 'express';
import { RequestParams } from '../../utils/types/expressTypes';
export declare const getPaymentData: (req: RequestParams, res: Response) => Promise<void>;
export declare const getPaymentTotal: (req: RequestParams, res: Response) => Promise<void>;
