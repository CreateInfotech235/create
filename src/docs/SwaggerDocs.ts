import swaggerJSDoc from 'swagger-jsdoc';
import {
  ADMIN_ORDER_LOCATIONS,
  CHARGE_TYPE,
  DISTANCE_TYPE,
  ORDER_LOCATION,
  ORDER_REQUEST,
  ORDER_STATUS,
  PAYMENT_TYPE,
  PERSON_TYPE,
  PICKUP_REQUEST,
  SUBCRIPTION_REQUEST,
  SWITCH,
  TRANSACTION_TYPE,
  VEHICLE_CITY_TYPE,
  WEIGHT_TYPE,
} from '../enum';

const signUp = {
  name: { type: 'string' },
  email: { type: 'string', example: 'demo@gmail.com' },
  password: { type: 'string', example: 'demoDEMO@1121' },
  contactNumber: { type: 'number' },
  countryCode: { type: 'string' },
  otp: { type: 'number' },
};

const orderId = {
  orderId: { type: 'number', required: true },
};

const otp = {
  otp: { type: 'number', required: false },
};

const statusField = {
  status: { type: 'string', enum: Object.keys(ORDER_REQUEST), required: true },
};

const acceptOrder = {
  ...orderId,
};

const dayCharges = {
  cityId: { type: 'string' },
  productChargeId: { type: 'string' },
  fixedCharge: { type: 'number' },
  title: { type: 'string' },
  hours: { type: 'number' },
};

const swaggerOption = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Create Courier',
      description: `Backend software for create courier`,
      contact: {
        name: '',
        email: '',
        url: '',
      },
      servers: [`http://localhost:${process.env.PORT}`],
      version: '1.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          name: 'authorization',
          bearerFormat: 'JWT',
          description: ``,
        },
      },
      schemas: {
        UserWithdrawList: {
          type: 'string',
          enum: Object.keys(SUBCRIPTION_REQUEST),
        },
        DeliveryManWalletList: {
          type: 'string',
          enum: Object.keys(TRANSACTION_TYPE),
        },
        AdminCreateVehicle: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            capacity: { type: 'number' },
            size: { type: 'number' },
            description: { type: 'string' },
            cityWise: { type: 'string', enum: VEHICLE_CITY_TYPE },
            city: { type: 'array', items: { type: 'string' } },
            image: { type: 'string' },
          },
        },
        AdminCreateDayCharges: {
          type: 'object',
          properties: dayCharges,
        },
        AdminUpdateDayCharges: {
          type: 'object',
          properties: { ...dayCharges, dayNumber: { type: 'number' } },
        },
        AdminCreateExtraCharge: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            charge: { type: 'number' },
            chargeType: { type: 'string', enum: CHARGE_TYPE },
            country: { type: 'string' },
            city: { type: 'string' },
            cashOnDelivery: { type: 'boolean' },
          },
        },
        AdminDeleteVehicle: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: SWITCH, default: SWITCH.DISABLE },
          },
        },
        AdminCreateParcelType: {
          type: 'object',
          properties: {
            label: { type: 'string' },
          },
        },
        AdminCreateCountry: {
          type: 'object',
          properties: {
            countryName: { type: 'string' },
            distanceType: {
              type: 'string',
              enum: DISTANCE_TYPE,
              default: DISTANCE_TYPE.MILES,
            },
            weightType: {
              type: 'string',
              enum: WEIGHT_TYPE,
              default: WEIGHT_TYPE.POUND,
            },
          },
        },
        AdminCreateCity: {
          type: 'object',
          properties: {
            cityName: { type: 'string' },
            countryID: { type: 'string' },
            fixedCharge: { type: 'number' },
            cancelCharge: { type: 'number' },
            minimumDistance: { type: 'number' },
            minimumWeight: { type: 'number' },
            perDistanceCharge: { type: 'number' },
            perWeightCharge: { type: 'number' },
            commissionType: {
              type: 'string',
              enum: CHARGE_TYPE,
              default: CHARGE_TYPE.FIXED,
            },
            adminCommission: { type: 'number' },
            pickupRequest: {
              type: 'string',
              enum: PICKUP_REQUEST,
              default: PICKUP_REQUEST.REGULAR,
            },
          },
        },
        OrderCreateType: {
          type: 'object',
          properties: {
            parcelType: { type: 'string' },
            weight: { type: 'number' },
            distance: { type: 'number' },
            duration: { type: 'string' },
            country: { type: 'string' },
            city: { type: 'string' },
            paymentCollection: {
              type: 'string',
              enum: PAYMENT_TYPE,
            },
            paymentOrderLocation: {
              type: 'string',
              enum: ORDER_LOCATION,
            },
            vehicle: { type: 'string' },
            pickupDetails: {
              type: 'object',
              properties: {
                location: {
                  type: 'object',
                  properties: {
                    latitude: { type: 'number' },
                    longitude: { type: 'number' },
                  },
                },
                dateTime: { type: 'number' },
                address: { type: 'string' },
                countryCode: { type: 'string' },
                mobileNumber: { type: 'number' },
                email: { type: 'string' },
                pickupRequest: {
                  type: 'string',
                  enum: PICKUP_REQUEST,
                },
                description: { type: 'string' },
                postCode: { type: 'string' },
              },
            },
            deliveryDetails: {
              type: 'object',
              properties: {
                location: {
                  type: 'object',
                  properties: {
                    latitude: { type: 'number' },
                    longitude: { type: 'number' },
                  },
                },
                dateTime: { type: 'number' },
                address: { type: 'string' },
                countryCode: { type: 'string' },
                mobileNumber: { type: 'number' },
                email: { type: 'string' },
                description: { type: 'string' },
                postCode: { type: 'string' },
              },
            },
            cashOnDelivery: { type: 'boolean' },
            deliveryManId: { type: 'string' },
          },
        },
        AdminOrderLocations: {
          status: {
            type: 'string',
            enum: ADMIN_ORDER_LOCATIONS,
          },
        },
        OrderListType: {
          type: 'string',
          enum: Object.keys(ORDER_STATUS),
        },
        OrderIdType: {
          type: 'object',
          properties: orderId,
        },
        OrderDeliveryAccept: {
          type: 'object',
          properties: { ...acceptOrder, ...statusField },
        },
        OrderDelivery: {
          type: 'object',
          properties: acceptOrder,
        },
        OrderArriveType: {
          type: 'object',
          properties: {
            ...acceptOrder,
          },
        },
        OrderPickUpType: {
          type: 'object',
          properties: {
            ...orderId,
            ...otp,
            userSignature: { type: 'string', required: true },
            pickupTimestamp: { type: 'string', required: true },
          },
        },
        OrderDeliveryType: {
          type: 'object',
          properties: {
            ...orderId,
            ...otp,
            deliveryManSignature: { type: 'string', required: true },
            deliverTimestamp: { type: 'string', required: true },
          },
        },
        MobileSignUp: {
          type: 'object',
          properties: {
            ...signUp,
            medicalCertificateNumber: { type: 'number' },
          },
        },
        DeliveryManSignUp: {
          type: 'object',
          properties: {
            ...signUp,
            documents: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  documentId: { type: 'string' },
                  image: { type: 'string' },
                  documentNumber: { type: 'number' },
                },
              },
            },
          },
        },
        DeliveryManUpdateLocation: {
          type: 'object',
          properties: {
            country: { type: 'string' },
            city: { type: 'string' },
            location: {
              type: 'object',
              properties: {
                latitude: { type: 'number' },
                longitude: { type: 'number' },
              },
            },
          },
        },
        MobileSignIn: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'demo@gmail.com' },
            password: { type: 'string', example: 'demoDEMO@1121' },
            personType: {
              type: 'string',
              enum: PERSON_TYPE,
              default: PERSON_TYPE.CUSTOMER,
            },
          },
        },
        MobileOtpVerify: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            contactNumber: { type: 'number' },
            countryCode: { type: 'string' },
            personType: {
              type: 'string',
              enum: PERSON_TYPE,
              default: PERSON_TYPE.CUSTOMER,
            },
          },
        },
        MobileRenewToken: {
          type: 'object',
          properties: {
            refreshToken: {
              type: 'string',
            },
            personType: {
              type: 'string',
              enum: PERSON_TYPE,
              default: PERSON_TYPE.CUSTOMER,
            },
          },
        },
        AdminAssignOrder: {
          type: 'object',
          properties: {
            deliveryManId: { type: 'string' },
            orderId: { type: 'number' },
          },
        },
        AdminCreateDeliveryMan: {
          type: 'object',
          properties: {
            deliveryManId: { type: 'string' },
            documentId: { type: 'string' },
            status: {
              type: 'string',
              enum: SUBCRIPTION_REQUEST,
              default: SUBCRIPTION_REQUEST.APPROVED,
            },
          },
        },
        AdminCreateDocument: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            isRequired: { type: 'boolean' },
          },
        },
        AdminManageSubscription: {
          type: 'object',
          properties: {
            type: { type: 'string' },
            amount: { type: 'number' },
            discount: { type: 'number' },
            features: { type: 'array', items: { type: 'string' } },
            days: { type: 'number' },
            subscriptionId: { type: 'string' },
          },
        },
        AdminAcceptSubscription: {
          type: 'object',
          properties: {
            subscriptionId: { type: 'string' },
            subscriptionStatus: {
              type: 'string',
              enum: [SUBCRIPTION_REQUEST.APPROVED, SUBCRIPTION_REQUEST.REJECT],
              default: SUBCRIPTION_REQUEST.APPROVED,
            },
          },
        },
      },
    },
    // security: [
    //   {
    //     ApiKeyAuth: [],
    //   },
    // ],
  },
  apis: [
    './src/routes/admin/*.ts',
    './src/routes/deliveryBoy/*.ts',
    './src/routes/mobile/*.ts',
  ],
};

const swaggerDocs = swaggerJSDoc(swaggerOption);

export default swaggerDocs;
