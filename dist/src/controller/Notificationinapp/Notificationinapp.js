"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationinapp = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const deliveryMan_schema_1 = __importDefault(require("../../models/deliveryMan.schema"));
// Ensure the environment variable is set
const serviceAccount = require('fs').existsSync('/etc/secrets/create-courier-Not.json')
    ? require('/etc/secrets/create-courier-Not.json')
    : require('../../../create-courier-Not.json');
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    databaseURL: 'https://create-courier-2e918.firebaseio.com',
});
// Function to remove invalid tokens from the database
const removeInvalidToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Removing invalid token: ${token}`);
    // Implement database removal logic here
    // Example for MongoDB:
    yield deliveryMan_schema_1.default.updateOne({ deviceToken: token }, { $set: { deviceToken: '' } });
});
const sendNotificationinapp = (title, body, token) => __awaiter(void 0, void 0, void 0, function* () {
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
        const response = yield firebase_admin_1.default.messaging().send(message);
        console.log('Notification sent successfully:', response);
        return { message: 'Notification sent successfully' };
    }
    catch (error) {
        console.error('Error sending notification:', error);
        // Handle token-related errors
        if (error.code === 'messaging/registration-token-not-registered' ||
            error.code === 'messaging/invalid-argument' ||
            error.code === 'messaging/invalid-registration-token') {
            console.log('Invalid token detected. Removing from database...');
            yield removeInvalidToken(token);
        }
        return { error: 'Failed to send notification', details: error.message };
    }
});
exports.sendNotificationinapp = sendNotificationinapp;
