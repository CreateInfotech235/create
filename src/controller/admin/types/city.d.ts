export interface ICity {
  cityName: string;
  countryID: string;
  fixedCharge: number;
  cancelCharge: number;
  minimumDistance: number;
  minimumWeight: number;
  perDistanceCharge: number;
  perWeightCharge: number;
  commissionType: CHARGE_TYPE;
  adminCommission: number;
  pickupRequest: PICKUP_REQUEST;
  cityId: string;
}

export interface ICityList extends Pick<ICity, 'cityName'> {}

export interface IDayWiseCharge {
  cityId: string;
  productChargeId: string;
  fixedCharge: number;
  charge: number;
  title: string;
  hours: number;
  dayInMs: number;
  dayNumber: number;
}

export interface IProductChargeId
  extends Pick<IDayWiseCharge, 'productChargeId'> {}
