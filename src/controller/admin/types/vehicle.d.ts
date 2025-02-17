import { SWITCH } from '../../../enum';

type VehicleType = {
  name: string;
  capacity: number;
  size: number;
  description: string;
  city: string[];
  image: string;
  vehicleId: string;
} & Record<'cityType' | 'cityWise', VEHICLE_CITY_TYPE>;

interface IVehicleDelete extends Pick<VehicleType, 'vehicleId'> {
  status: SWITCH;
}
