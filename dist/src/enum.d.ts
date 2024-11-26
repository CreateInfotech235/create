export declare enum SWITCH {
    ENABLE = "ENABLE",
    DISABLE = "DISABLE"
}
export declare enum SWITCHSTATUS {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE"
}
export declare enum PROVIDER {
    GOOGLE = "GOOGLE",
    FACEBOOK = "FACEBOOK",
    APP = "APP"
}
export declare enum ORDER_HISTORY {
    CREATED = "CREATED",
    ASSIGNED = "ASSIGNED",
    ACCEPTED = "ACCEPTED",
    CANCELLED = "CANCELLED",
    DELIVERED = "DELIVERED",
    PICKED_UP = "PICKED_UP",
    DEPARTED = "DEPARTED",
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    ARRIVED = "ARRIVED",
    DELAYED = "DELAYED",
    FAILED = "FAILED",
    PAYMENT_STATUS_MESSAGE = "PAYMENT_STATUS_MESSAGE"
}
export declare enum ORDER_STATUS {
    CREATED = "CREATED",
    ASSIGNED = "ASSIGNED",
    ACCEPTED = "ACCEPTED",
    CANCELLED = "CANCELLED",
    DELIVERED = "DELIVERED",
    PICKED_UP = "PICKED_UP",
    DEPARTED = "DEPARTED",
    ARRIVED = "ARRIVED"
}
export declare enum ADMIN_ORDER_LOCATIONS {
    ACCEPTED = "ACCEPTED",
    ASSIGNED = "ASSIGNED",
    ARRIVED = "ARRIVED",
    PICKED_UP = "PICKED_UP",
    DEPARTED = "DEPARTED"
}
export declare enum ORDER_LIST {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED"
}
export declare enum ORDER_REQUEST {
    ACCEPTED = "ACCEPTED",
    REJECT = "REJECT",
    PENDING = "PENDING"
}
export declare enum ORDER_LOCATION {
    PICK_UP = "PICK_UP",
    DELIVERY = "DELIVERY"
}
export declare enum PAYMENT_INFO {
    SUCCESS = "SUCCESS",
    REJECT = "REJECT",
    PENDING = "PENDING"
}
export declare enum SUBCRIPTION_REQUEST {
    APPROVED = "APPROVED",
    REJECT = "REJECT",
    PENDING = "PENDING"
}
export declare enum PAYMENT_TYPE {
    CASH = "CASH",
    WALLET = "WALLET",
    ONLINE = "ONLINE"
}
export declare enum TRANSACTION_TYPE {
    DEPOSIT = "DEPOSIT",
    WITHDRAW = "WITHDRAW"
}
export declare enum VEHICLE_CITY_TYPE {
    ALL = "ALL",
    CITY_WISE = "CITY_WISE"
}
export declare enum PICKUP_REQUEST {
    REGULAR = "REGULAR",
    EXPRESS = "EXPRESS"
}
export declare enum CHARGE_TYPE {
    FIXED = "FIXED",
    PERCENTAGE = "PERCENTAGE"
}
export declare enum DISTANCE_TYPE {
    KM = "KM",
    MILES = "MILES"
}
export declare enum WEIGHT_TYPE {
    KG = "KG",
    POUND = "POUND"
}
export declare enum PERSON_TYPE {
    CUSTOMER = "CUSTOMER",
    DELIVERY_BOY = "DELIVERY_BOY",
    ADMIN = "ADMIN"
}
export declare enum DAY_WISE_CHARGE_TYPE {
    SAME_DAY = "SAME_DAY",
    NEXT_DAY = "NEXT_DAY",
    THREE_FIVE_DAYS = "3-5_DAYS"
}
