import { Response } from 'express';
import { RequestParams } from '../../utils/types/expressTypes';
export declare const createVehicle: (req: RequestParams, res: Response) => Promise<void>;
export declare const updateVehicle: (req: RequestParams, res: Response) => Promise<void>;
export declare const deleteVehicle: (req: RequestParams, res: Response) => Promise<void>;
export declare const getVehicles: (req: RequestParams, res: Response) => Promise<void>;
export declare const getVehiclesForAll: (req: RequestParams, res: Response) => Promise<void>;
