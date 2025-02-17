import { Response } from 'express';
import { RequestParams } from '../../utils/types/expressTypes';
export declare const createParcelTypes: (req: RequestParams, res: Response) => Promise<void>;
export declare const updateParcelTypes: (req: RequestParams, res: Response) => Promise<void>;
export declare const deleteParcelType: (req: RequestParams, res: Response) => Promise<void>;
export declare const getParcelTypes: (req: RequestParams, res: Response) => Promise<void>;
