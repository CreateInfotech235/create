import { Request, Response } from 'express';
export declare const createWebFooter: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export declare const getWebFooter: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
