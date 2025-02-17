import { DISTANCE_TYPE } from '../../../enum';

interface ICountry {
  countryName: string;
  distanceType: DISTANCE_TYPE;
  weightType: WEIGHT_TYPE;
  countryId: string;
  name: string;
}

interface ICity {
  countryId: string;
}
