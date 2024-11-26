import createAdmin from './createAdmin';
import createTrialSubcription from './trialSubcriptions';

export default async () => {
  await createAdmin();
  await createTrialSubcription();
};
