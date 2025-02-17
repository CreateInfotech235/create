import { SUBCRIPTION_REQUEST } from '../../../enum';
import { IPagination } from '../../../utils/types/schema';

type AcceptSubcriptionQueryType = {
  subscriptionId: string;
  subscriptionStatus: SUBCRIPTION_REQUEST;
};

interface ISubcriptionStatusList extends IPagination {
  isSubscribed: boolean | string;
}

interface IManageSubscription {
  type: string;
  amount: number;
  discount: number;
  features: string[];
  days: number;
  subscriptionId?: string | undefined;
  seconds: number;
}
