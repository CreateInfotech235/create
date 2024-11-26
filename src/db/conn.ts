import mongoose from 'mongoose';
import Model from '../models/customer.schema';
import DeliveryMan from '../models/deliveryMan.schema';
// Function to update old data and add customerId

export default (dbUri: string) => {
  mongoose
    .connect(dbUri)
    .then(async () => {
      console.log('Database Connection');
    })
    .catch((e) => {
      console.log('Database Not Connected = ', e);
    });
};
