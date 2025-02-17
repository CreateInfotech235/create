import { CHARGE_TYPE } from '../../../enum';
import { IVehicleDelete } from './vehicle';

interface IExtraCharges {
  title: string;
  country: string;
  city: string;
  chargeType: CHARGE_TYPE;
  charge: number;
  extraChargeId: string;
}

interface IExtraChargesDelete
  extends Pick<IExtraCharges & IVehicleDelete, 'extraChargeId' | 'status'> {}

interface IParcelType {
  label: string;
}

interface IParcelTypeUpdate extends Pick<IParcelType, 'label'> {
  parcelTypeId: string;
}

interface IParcelTypeDelete
  extends Pick<IParcelTypeUpdate & IVehicleDelete, 'parcelTypeId' | 'status'> {}
