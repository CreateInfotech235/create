import { Response } from 'express';
import { RequestParams } from '../../utils/types/expressTypes';
export declare const createInvoice: (req: RequestParams, res: Response) => Promise<void>;
export declare const getInvoice: (req: RequestParams, res: Response) => Promise<void>;
export declare const updateInvoice: (req: RequestParams, res: Response) => Promise<void>;
export declare const deleteInvoice: (req: RequestParams, res: Response) => Promise<void>;
