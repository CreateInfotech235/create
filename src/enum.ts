export enum SWITCH {
  ENABLE = 'ENABLE',
  DISABLE = 'DISABLE',
}

export enum isApprovedStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
}

export enum SWITCHSTATUS {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}
export enum PROVIDER {
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  APP = 'APP',
}
export enum ORDER_HISTORY {
  CREATED = 'CREATED',
  ASSIGNED = 'ASSIGNED',
  UNASSIGNED = 'UNASSIGNED',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED',
  PICKED_UP = 'PICKED_UP',
  DEPARTED = 'DEPARTED',
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARRIVED = 'ARRIVED',
  DELAYED = 'DELAYED',
  FAILED = 'FAILED',
  PAYMENT_STATUS_MESSAGE = 'PAYMENT_STATUS_MESSAGE',
}
export enum ORDER_STATUS {
  CREATED = 'CREATED',
  ASSIGNED = 'ASSIGNED',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED',
  PICKED_UP = 'PICKED_UP',
  DEPARTED = 'DEPARTED',
  ARRIVED = 'ARRIVED',
}
export enum ADMIN_ORDER_LOCATIONS {
  ACCEPTED = 'ACCEPTED',
  ASSIGNED = 'ASSIGNED',
  ARRIVED = 'ARRIVED',
  PICKED_UP = 'PICKED_UP',
  DEPARTED = 'DEPARTED',
}
export enum ORDER_LIST {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}
export enum CHARGE_METHOD {
  TIME = 'TIME',
  DISTANCE = 'DISTANCE',
}
export enum ORDER_REQUEST {
  ACCEPTED = 'ACCEPTED',
  REJECT = 'REJECT',
  PENDING = 'PENDING',
}
export enum ORDER_LOCATION {
  PICK_UP = 'PICK_UP',
  DELIVERY = 'DELIVERY',
}
export enum PAYMENT_INFO {
  SUCCESS = 'SUCCESS',
  REJECT = 'REJECT',
  PENDING = 'PENDING',
}
export enum SUBCRIPTION_REQUEST {
  APPROVED = 'APPROVED',
  REJECT = 'REJECT',
  PENDING = 'PENDING',
}
export enum PAYMENT_TYPE {
  CASH = 'CASH',
  WALLET = 'WALLET',
  ONLINE = 'ONLINE',
}
export enum TRANSACTION_TYPE {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
}
export enum VEHICLE_CITY_TYPE {
  ALL = 'ALL',
  CITY_WISE = 'CITY_WISE',
}
export enum PICKUP_REQUEST {
  REGULAR = 'REGULAR',
  EXPRESS = 'EXPRESS',
}
export enum CHARGE_TYPE {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
}
export enum DISTANCE_TYPE {
  KM = 'KM',
  MILES = 'MILES',
}
export enum WEIGHT_TYPE {
  KG = 'KG',
  POUND = 'POUND',
}
export enum PERSON_TYPE {
  CUSTOMER = 'CUSTOMER',
  DELIVERY_BOY = 'DELIVERY_BOY',
  ADMIN = 'ADMIN',
}
export enum DAY_WISE_CHARGE_TYPE {
  SAME_DAY = 'SAME_DAY',
  NEXT_DAY = 'NEXT_DAY',
  THREE_FIVE_DAYS = '3-5_DAYS',
}
