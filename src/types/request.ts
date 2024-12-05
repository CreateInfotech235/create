import { Request } from 'express';

export interface RequestParams extends Request {
  user?: any; // You can replace 'any' with a more specific user type if needed
}
