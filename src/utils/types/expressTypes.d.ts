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
  message?: string;
  data?: Array<object> | object;
};

export declare interface errorMessages {
  [key: string]: string;
}

export declare type language = 'en';

export declare type Payload =
  | Array<number | string | boolean | object>
  | object;
