import { Response } from 'express';
import { RequestParams } from '../../utils/types/expressTypes';
export declare const assignOrder: (req: RequestParams, res: Response) => Promise<void>;
export declare const getOrders: (req: RequestParams, res: Response) => Promise<void>;
export declare const getAllOrders: (req: RequestParams, res: Response) => Promise<void>;
