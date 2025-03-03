import { Request, Response } from 'express';
export declare const createWebSocialMedia: (req: Request, res: Response) => Promise<void>;
export declare const getWebSocialMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
