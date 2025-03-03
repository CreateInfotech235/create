import { Request, Response } from 'express';
export declare const createWebhomelandingpage: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export declare const getWebLandingPage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateWebHome: (req: Request, res: Response) => Promise<void>;
