import { Response } from 'express';
import { RequestParams } from '../../utils/types/expressTypes';
export declare const createExtraCharges: (req: RequestParams, res: Response) => Promise<void>;
export declare const updateExtraCharges: (req: RequestParams, res: Response) => Promise<void>;
export declare const deleteExtraCharge: (req: RequestParams, res: Response) => Promise<void>;
export declare const getExtraCharges: (req: RequestParams, res: Response) => Promise<void>;
