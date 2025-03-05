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
exports.stripPayment = exports.getApproveSubscription = void 0;
const subcriptionPurchase_schema_1 = __importDefault(require("../../models/subcriptionPurchase.schema"));
const mongoose_1 = require("mongoose");
const stripe_1 = __importDefault(require("stripe"));
// Initialize Stripe with your secret key
// sk_test_51QWXp5FWojz9eoui3b20GWIoF6Yxged00OdF74C7SSSqnpYie13SsJWAm6ev4AvSaA8lLl3JjZJWvRxqeIB9wihP00AaiXdZKs
const stripe = new stripe_1.default('sk_test_51QWXp5FWojz9eoui3b20GWIoF6Yxged00OdF74C7SSSqnpYie13SsJWAm6ev4AvSaA8lLl3JjZJWvRxqeIB9wihP00AaiXdZKs');
const getApproveSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(id, 'id1234');
        // Validate ID
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            return res.status(400).json({
                status: false,
                // message: "Invalid customer ID.",
                message: 'Invalid merchant ID.',
            });
        }
        // Fetch subscriptions
        const data = yield subcriptionPurchase_schema_1.default
            .find({
            //   status: "APPROVED",
            // customer: id,
            merchant: id,
        })
            .populate('subcriptionId');
        console.log(data, 'data1234');
        return res.status(200).json({
            status: true,
            data,
        });
    }
    catch (error) {
        console.error('Error in getApproveSubscription:', error.message);
        return res.status(500).json({
            status: false,
            message: 'Something went wrong while fetching subscriptions.',
        });
    }
});
exports.getApproveSubscription = getApproveSubscription;
const stripPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, planId, duration, expiryDate, merchantId } = req.body;
    console.log('Received Payment Data:', amount, planId, duration, expiryDate, merchantId);
    try {
        // Ensure amount is in the smallest currency unit (e.g., cents for USD, pennies for GBP)
        const formattedAmount = Math.round(amount * 100);
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: formattedAmount, // Amount in smallest currency unit
            currency: 'gbp', // Replace with your currency code
            payment_method_types: ['card'], // Allow card payments
            metadata: {
                planId,
                duration,
                expiryDate,
                merchantId,
            },
        });
        // if subscription plan is already expired then return error
        // Create subscription purchase record
        console.log(paymentIntent, 'paymentIntent');
        // 
        yield subcriptionPurchase_schema_1.default.create({
            subcriptionId: planId,
            merchant: merchantId,
            expiry: expiryDate,
            status: 'APPROVED',
        });
        console.log('Payment Intent Created:', paymentIntent);
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    }
    catch (error) {
        console.error('Stripe Payment Error:', error);
        res.status(500).send({
            message: 'Something went wrong while processing the payment.',
        });
    }
});
exports.stripPayment = stripPayment;
