import { Request, Response } from 'express';
import admin from 'firebase-admin';
import DeliveryManSchema from '../../models/deliveryMan.schema';

// Ensure the environment variable is set
const serviceAccount = require('fs').existsSync(
  '/etc/secrets/create-courier-Not.json',
)
  ? require('/etc/secrets/create-courier-Not.json')
  : require('../../../create-courier-Not.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://create-courier-2e918.firebaseio.com',
});

// Function to remove invalid tokens from the database
const removeInvalidToken = async (token: string) => {
  console.log(`Removing invalid token: ${token}`);
  // Implement database removal logic here
  // Example for MongoDB:
  await DeliveryManSchema.updateOne(
    { deviceToken: token },
    { $set: { deviceToken: '' } },
  );
};

export const sendNotificationinapp = async (
  title: string,
  body: string,
  token: string,
) => {
  try {
    if (!title || !body || !token) {
      throw new Error('Title, body, and token are required.');
    }

    const message = {
      notification: {
        title,
        body,
      },
      token,
    };

    const response = await admin.messaging().send(message);
    console.log('Notification sent successfully:', response);
    return { message: 'Notification sent successfully' };
  } catch (error: any) {
    console.error('Error sending notification:', error);

    // Handle token-related errors
    if (
      error.code === 'messaging/registration-token-not-registered' ||
      error.code === 'messaging/invalid-argument' ||
      error.code === 'messaging/invalid-registration-token'
    ) {
      console.log('Invalid token detected. Removing from database...');
      await removeInvalidToken(token);
    }

    return { error: 'Failed to send notification', details: error.message };
  }
};
