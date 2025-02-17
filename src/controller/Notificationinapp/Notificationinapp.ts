import { Request, Response } from 'express';
import admin from 'firebase-admin';

// Ensure the environment variable is set
const serviceAccount = require('/etc/secrets/create-courier-Not.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://create-courier-2e918.firebaseio.com',
});

export const sendNotificationinapp = async (title: string, body: string, token: string) => {
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
    return { message: 'Notification sent successfully' }; // Removed 'response' from the return object
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new Error('Failed to send notification');
  }
};
