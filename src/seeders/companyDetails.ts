import CompanySchema from '../models/company.schema';

export default async () => {
  if ((await CompanySchema.find()).length === 0) {
    await CompanySchema.create({});
  }
};
