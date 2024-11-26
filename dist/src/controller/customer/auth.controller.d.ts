import { Response } from 'express';
import { RequestParams } from '../../utils/types/expressTypes';
export declare const createCustomer: (req: RequestParams, res: Response) => Promise<void>;
export declare const updateCustomer: (req: RequestParams, res: Response) => Promise<void>;
export declare const getCustomers: (req: RequestParams, res: Response) => Promise<void>;
export declare const getCities: (req: RequestParams, res: Response) => Promise<void>;
export declare const getCountries: (req: RequestParams, res: Response) => Promise<void>;
export declare const moveToTrashCustomer: (req: RequestParams, res: Response) => Promise<void>;
export declare const deleteCustomerById: (req: RequestParams, res: Response) => Promise<void>;
