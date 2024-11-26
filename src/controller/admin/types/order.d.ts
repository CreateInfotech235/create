import mongoose from 'mongoose';
import {
  ADMIN_ORDER_LOCATIONS,
  ORDER_HISTORY,
  ORDER_LIST,
  ORDER_REQUEST,
  SUBCRIPTION_REQUEST,
  TRANSACTION_TYPE,
} from '../../../enum';
import { IPagination } from '../../../utils/types/schema';

interface OrderAssignType {
  deliveryManId: string;
  orderId: string;
}

interface IDeliveryMan {
  deliveryManId: string;
  pageCount?: number;
  pageLimit?: number;
  orderListType?: ORDER_LIST;
}

interface IUser extends Pick<IDeliveryMan, 'pageCount' | 'pageLimit'> {
  transactionStatus: SUBCRIPTION_REQUEST;
}

interface IWalletList {
  transactionType: TRANSACTION_TYPE;
}

interface IDeliveryManOrderQuery {
  'orderAssignInfo.deliveryBoy': mongoose.Types.ObjectId;
  'orderAssignInfo.status': ORDER_REQUEST;
  status: ORDER_HISTORY;
}

type AdminOrderListType = Record<
  'date' | 'user' | 'deliveryMan' | 'orderId' | 'invoiceId',
  string
> & { status: ORDER_HISTORY } & IPagination;

type AdminOrderLocationType = { status: ADMIN_ORDER_LOCATIONS };

interface IOrderId extends Pick<OrderAssignType, 'orderId'> {}

interface IVerificationStatus {
      deliveryManId: string;
      documentId: string;
      status: SUBCRIPTION_REQUEST;
    }