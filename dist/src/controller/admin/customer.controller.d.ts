import { Response } from 'express';
import { RequestParams } from '../../utils/types/expressTypes';
export declare const addCustomer: (req: RequestParams, res: Response) => Promise<void>;
export declare const getAllCustomer: (req: RequestParams, res: Response) => Promise<void>;
