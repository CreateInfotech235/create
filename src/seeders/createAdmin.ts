import adminSchema from '../models/admin.schema';
import adminSettingSchema from '../models/adminSettings.schema';
import CurrencySchema from '../models/currency.schema';
import { encryptPassword } from '../utils/common';

export default async () => {
  if ((await adminSchema.find()).length === 0) {
    const data = JSON.parse(process.env.ADMIN_DATA);
    data.password = await encryptPassword({ password: data.password });
    await adminSchema.create(data);
  }

  if ((await adminSettingSchema.find()).length === 0) {
    let currency = await CurrencySchema.findOne();

    if (!currency) {
      currency = await CurrencySchema.create({
        name: 'Pound',
        symbol: '£',
        position: 'right',
      });
    }

    await adminSettingSchema.create({ currency: currency._id });
  }
};
