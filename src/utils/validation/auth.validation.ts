import Joi from 'joi';
import { PERSON_TYPE } from '../../enum';

export const userSignInValidation = Joi.object().keys({
  email: Joi.string()
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .required(),
  password: Joi.string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .required(),
  personType: Joi.string()
    .valid(PERSON_TYPE.CUSTOMER, PERSON_TYPE.DELIVERY_BOY)
    .required(),
});

export const userSignUpValidation = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string()
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .required(),
  password: Joi.string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .required(),
  contactNumber: Joi.number().required(),
  countryCode: Joi.string().required(),
  // otp: Joi.number().required(),
  otp: Joi.when(
    Joi.alternatives().try(Joi.exist().valid(true).label('createdByAdmin')),
    {
      then: Joi.optional(),
      otherwise: Joi.number().required(),
    },
  ),
  image: Joi.string()
    .regex(/^data:([-\w]+\/[-+\w.]+)?((?:;?[\w]+=[-\w]+)*)(;base64)?,(.*)/i)
    .optional(),
  medicalCertificateNumber: Joi.number().optional(),
  medicalCertificate: Joi.string()
    .regex(/^data:([-\w]+\/[-+\w.]+)?((?:;?[\w]+=[-\w]+)*)(;base64)?,(.*)/i)
    .optional(),
  address: Joi.object()
    .keys({
      street: Joi.string().required(),
      city: Joi.string().required(),
      // state: Joi.string().required(),
      postalCode: Joi.string()
        // .regex(/^\d{5}(-\d{4})?$/)
        .required(), // US postal code example (adjust for other formats)
      country: Joi.string().required(),
    })
    .required(),
  freeSubscription: Joi.boolean().default(false),
  createdByAdmin: Joi.boolean().optional(),
});

export const deliveryManSignUpValidation = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  trashed: Joi.boolean().default(false),
  email: Joi.string()
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .required(),
  password: Joi.string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .required(),
  contactNumber: Joi.number().required(),
  // countryCode: Joi.string().required(),
  address: Joi.string(),
  postCode: Joi.string()
    .regex(/^[A-Za-z0-9\s-]+$/)
    .required(),
  otp: Joi.when(
    Joi.alternatives().try(
      Joi.exist().valid(true).label('createdByAdmin'),
      Joi.exist().label('merchantId'),
    ),
    {
      then: Joi.optional(),
      otherwise: Joi.number().required(),
    },
  ),
  medicalCertificateNumber: Joi.string().optional(),
  documents: Joi.array()
    .items(
      Joi.object({
        documentId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        image: Joi.string().regex(
          /^data:([-\w]+\/[-+\w.]+)?((?:;?[\w]+=[-\w]+)*)(;base64)?,(.*)/i,
        ),
        documentNumber: Joi.string().required(),
      }),
    )
    .optional(),
  image: Joi.string()
    .regex(/^data:([-\w]+\/[-+\w.]+)?((?:;?[\w]+=[-\w]+)*)(;base64)?,(.*)/i)
    .optional(),
  merchantId: Joi.string().optional(),
  createdByAdmin: Joi.boolean().optional(),
});

export const updatePasswordValidation = Joi.object().keys({
  oldPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string().min(8).required(),
});

export const customerUpdateValidation = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  country: Joi.string().optional(),
  city: Joi.string().optional(),
  address: Joi.string().optional(),
  postCode: Joi.string().optional(),
  mobileNumber: Joi.string().optional(),
  email: Joi.string().email().optional(),
  location: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).optional(),
  merchantId: Joi.string().required(),
  trashed: Joi.boolean().optional(),
});

export const customerSignUpValidation = Joi.object().keys({
  firstName: Joi.string().required(),
  merchantId: Joi.string(),
  lastName: Joi.string().required(),
  email: Joi.string()
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .required(),
  address: Joi.string().required(),
  postCode: Joi.string().required(),
  mobileNumber: Joi.string().required(),
  country: Joi.string()
    // .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  city: Joi.string()
    // .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  location: Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number(),
  }),
  createdByAdmin: Joi.boolean().optional(),
  trashed: Joi.boolean().default(false),
});

export const adminCredentialValidation = Joi.object().keys({
  adminId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  email: Joi.string()
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .required(),
  contactNumber: Joi.number().required(),
  countryCode: Joi.string().required(),
  otp: Joi.number().required(),
});

export const adminProfileValidation = Joi.object().keys({
  adminId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  name: Joi.string().required(),
  profileImage: Joi.string()
    .regex(/^data:([-\w]+\/[-+\w.]+)?((?:;?[\w]+=[-\w]+)*)(;base64)?,(.*)/i)
    .required(),
});

export const otpVerifyValidation = Joi.object().keys({
  email: Joi.string()
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .required(),
  contactNumber: Joi.number().required(),
  // countryCode: Joi.string().required(),
  messageSend:Joi.string().required(),
  subject:Joi.string().required(),
  personType: Joi.string()
    .valid(PERSON_TYPE.CUSTOMER, PERSON_TYPE.DELIVERY_BOY, PERSON_TYPE.ADMIN)
    .required(),
});

export const renewTokenValidation = Joi.object().keys({
  refreshToken: Joi.string().required(),
  personType: Joi.string()
    .valid(PERSON_TYPE.CUSTOMER, PERSON_TYPE.DELIVERY_BOY, PERSON_TYPE.ADMIN)
    .required(),
});

export const activateFreeSubcriptionValidation = Joi.object().keys({
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  medicalCertificateNumber: Joi.number().required(),
  medicalCertificate: Joi.string()
    .regex(/^data:([-\w]+\/[-+\w.]+)?((?:;?[\w]+=[-\w]+)*)(;base64)?,(.*)/i)
    .required(),
});
