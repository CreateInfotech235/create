import { Response } from 'express';
import { RequestParams } from '../../utils/types/expressTypes';
export declare const orderCreation: (req: RequestParams, res: Response) => Promise<void>;
export declare const orderUpdate: (req: RequestParams, res: Response) => Promise<void>;
export declare const cancelOrder: (req: RequestParams, res: Response) => Promise<void>;
export declare const getAllOrdersFromMerchant: (req: RequestParams, res: Response) => Promise<void>;
export declare const getAllRecentOrdersFromMerchant: (req: RequestParams, res: Response) => Promise<void>;
export declare const deleteOrderFormMerchant: (req: RequestParams, res: Response) => Promise<void>;
export declare const moveToTrash: (req: RequestParams, res: Response) => Promise<void>;
