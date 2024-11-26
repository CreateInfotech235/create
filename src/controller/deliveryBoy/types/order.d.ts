import { ORDER_REQUEST } from '../../../enum';

interface OrderAssignType {
  deliveryManId: string;
  orderId: number;
}

interface OrderAcceptType
  extends Pick<OrderAssignType, 'deliveryManId' | 'orderId'> {
  status: ORDER_REQUEST;
}
interface OrderCancelType
  extends Pick<OrderAssignType, 'deliveryManId' | 'orderId'> {
  status: ORDER_REQUEST;
}

interface OrderPickUpType {
  orderId: number;
  userSignature: string;
  pickUpTimestamp: number;
  otp: number;
}

interface OrderDeliverType extends Pick<OrderPickUpType, 'orderId' | 'otp'> {
  deliveryManSignature: string;
  deliverTimestamp: number;
}

interface OrderCancelType extends Pick<OrderPickUpType, 'orderId'> {
  reason: string;
}
