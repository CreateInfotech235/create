import { Request, Response } from 'express';
export declare const createWebNavbar: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export declare const getWebNavbar: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
