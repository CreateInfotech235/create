export interface IUpdateLocation {
  address: string;
  country: string;
  city: string;
  location: {
    latitude: number;
    longitude: number;
  };
}
