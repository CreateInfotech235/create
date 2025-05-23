import { Response } from 'express';
import { RequestParams } from '../../utils/types/expressTypes';
export declare const getAssignedOrders: (req: RequestParams, res: Response) => Promise<void>;
export declare const getAssignedOrdersMulti: (req: RequestParams, res: Response) => Promise<void>;
export declare const getOederForDeliveryMan: (req: RequestParams, res: Response) => Promise<void>;
export declare const acceptOrder: (req: RequestParams, res: Response) => Promise<void>;
export declare const arriveOrder: (req: RequestParams, res: Response) => Promise<void>;
export declare const arriveOrderMulti: (req: RequestParams, res: Response) => Promise<void>;
export declare const cancelOrder: (req: RequestParams, res: Response) => Promise<void>;
export declare const cancelMultiOrder: (req: RequestParams, res: Response) => Promise<void>;
export declare const cancelMultiSubOrder: (req: RequestParams, res: Response) => Promise<void>;
export declare const departOrder: (req: RequestParams, res: Response) => Promise<void>;
export declare const departOrderMulti: (req: RequestParams, res: Response) => Promise<void>;
export declare const pickUpOrder: (req: RequestParams, res: Response) => Promise<void>;
export declare const pickUpOrderMulti: (req: RequestParams, res: Response) => Promise<void>;
export declare const sendEmailOrMobileOtp: (req: RequestParams, res: Response) => Promise<void>;
export declare const sendEmailOrMobileOtpMulti: (req: RequestParams, res: Response) => Promise<void>;
export declare const sendEmailOrMobileOtpMultiForDelivery: (req: RequestParams, res: Response) => Promise<void>;
export declare const deliverOrder: (req: RequestParams, res: Response) => Promise<void>;
export declare const deliverOrderMulti: (req: RequestParams, res: Response) => Promise<void>;
export declare const OrderAssigneeSchemaData: (req: RequestParams, res: Response) => Promise<void>;
export declare const allPaymentInfo: (req: RequestParams, res: Response) => Promise<void>;
export declare const getOrderById: (req: RequestParams, res: Response) => Promise<void>;
export declare const getAllCancelledOrders: (req: RequestParams, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export declare const getAllCancelledOrdersMulti: (req: RequestParams, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export declare const getPaymentDataForDeliveryBoy: (req: RequestParams, res: Response) => Promise<void>;
export declare const getMultiOrder: (req: RequestParams, res: Response) => Promise<void>;
export declare const getMultiOrderById: (req: RequestParams, res: Response) => Promise<void>;
export declare const getSubOrderData: (req: RequestParams, res: Response) => Promise<void>;
export declare const logoutdeliveryboy: (req: RequestParams, res: Response) => Promise<void>;
