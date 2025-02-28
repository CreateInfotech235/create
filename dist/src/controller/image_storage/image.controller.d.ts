import { Request, Response } from 'express';
export declare const uploadImage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getImage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateImage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteImage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
