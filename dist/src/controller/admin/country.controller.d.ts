import { Response } from 'express';
import { RequestParams } from '../../utils/types/expressTypes';
export declare const createCountry: (req: RequestParams, res: Response) => Promise<void>;
export declare const updateCountry: (req: RequestParams, res: Response) => Promise<void>;
export declare const getCountries: (req: RequestParams, res: Response) => Promise<void>;
export declare const getCitiesByCountry: (req: RequestParams, res: Response) => Promise<void>;
export declare const deleteCountry: (req: RequestParams, res: Response) => Promise<void>;
