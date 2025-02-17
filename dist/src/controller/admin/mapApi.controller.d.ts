import { Response } from 'express';
import { RequestParams } from '../../utils/types/expressTypes';
export declare const mapApiCreate: (req: RequestParams, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export declare const getAllmapApi: (req: RequestParams, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getOneMapApi: (req: RequestParams, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateMapApi: (req: RequestParams, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteMapApi: (req: RequestParams, res: Response) => Promise<Response<any, Record<string, any>>>;
