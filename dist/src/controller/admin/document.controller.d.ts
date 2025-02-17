import { Response } from 'express';
import { RequestParams } from '../../utils/types/expressTypes';
export declare const createDocument: (req: RequestParams, res: Response) => Promise<void>;
export declare const updateDocument: (req: RequestParams, res: Response) => Promise<void>;
export declare const deleteDocument: (req: RequestParams, res: Response) => Promise<void>;
export declare const getDocuments: (req: RequestParams, res: Response) => Promise<void>;
