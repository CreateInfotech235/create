import { Request } from 'express';
import mongoose from 'mongoose';

export declare interface RequestParams extends Request {
  body: Record<string, any>;
  params: Record<string, any>;
  query: Record<string, any>;
  id?: mongoose.Types.ObjectId;
  language?: string;
}

export declare interface encryptPasswordParams {
  password: string;
}

export declare type responseData = {
  statusCode?: number;
  message?: string;
  data?: Array<object> | object;
  error?: any;
};
export declare type responseDatanotAble = {
  statusCode: 800;
  message?: string;
  data?: Array<object> | object;
  error?: any;
};

export declare interface errorMessages {
  [key: string]: string;
}

export declare type language = 'en';

export declare type Payload =
  | Array<number | string | boolean | object>
  | object;
