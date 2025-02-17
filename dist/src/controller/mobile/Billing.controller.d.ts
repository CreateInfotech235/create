import { Response } from 'express';
import { RequestParams } from '../../utils/types/expressTypes';
export declare const getBilling: (req: RequestParams, res: Response) => Promise<void>;
export declare const BillingApprove: (req: RequestParams, res: Response) => Promise<void>;
