import { ORDER_REQUEST } from '../../../enum';

interface OrderAssignType {
  deliveryManId: string;
  orderId: number;
}

interface OrderAcceptType
  extends Pick<OrderAssignType, 'deliveryManId' | 'orderId'> {
  status: ORDER_REQUEST;
}
interface OrderAcceptTypeMulti
  extends Pick<OrderAssignType, 'deliveryManId' | 'orderId'> {
  status: ORDER_REQUEST;
  subOrderId : number;
}
interface OrderCancelType
  extends Pick<OrderAssignType, 'deliveryManId' | 'orderId'> {
  status: ORDER_REQUEST;
}
interface OrderCancelTypeMultiSubOrder
  extends Pick<OrderAssignType, 'deliveryManId' | 'orderId' | 'subOrderId'| 'reason'> {
  status: ORDER_REQUEST;
}

interface OrderPickUpType {
  orderId: number;
  subOrderId:number[];
  userSignature: string;
  pickupTimestamp: number;
  otp: number;
}

interface OrderDeliverType extends Pick<OrderPickUpType, 'orderId' | 'otp'> {
  deliveryManSignature: string;
  deliverTimestamp: number;
}
interface OrderDeliverTypeMulti extends Pick<OrderPickUpType, 'orderId' | 'otp'> {
  deliveryManSignature: string;
  deliverTimestamp: number;
  subOrderId : number;
}

interface OrderCancelType extends Pick<OrderPickUpType, 'orderId'> {
  reason: string;
}
