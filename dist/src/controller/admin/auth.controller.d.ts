import { Response } from 'express';
import { RequestParams } from '../../utils/types/expressTypes';
export declare const signIn: (req: RequestParams, res: Response) => Promise<void>;
export declare const profileCredentialUpdate: (req: RequestParams, res: Response) => Promise<void>;
export declare const sendEmailOrMobileOtp: (req: RequestParams, res: Response) => Promise<void>;
export declare const profileUpdate: (req: RequestParams, res: Response) => Promise<void>;
export declare const renewToken: (req: RequestParams, res: Response) => Promise<void>;
export declare const logout: (req: RequestParams, res: Response) => Promise<void>;
export declare const getOrderCounts: (req: RequestParams, res: Response) => Promise<void>;
