import subcriptionSchema from '../models/subcription.schema';

export default async () => {
  const checkSubcriptions = await subcriptionSchema.find();

  if (checkSubcriptions.length === 0) {
    await subcriptionSchema.create({
      type: '1 Month Free Trial',
      amount: 0,
      seconds: 2592000,
    });
  }
};
