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
exports.switchSubscriptionPlan = exports.stripPayment = exports.getApproveSubscription = void 0;
const subcriptionPurchase_schema_1 = __importDefault(require("../../models/subcriptionPurchase.schema"));
const mongoose_1 = require("mongoose");
const stripe_1 = __importDefault(require("stripe"));
const subcription_schema_1 = __importDefault(require("../../models/subcription.schema"));
// Initialize Stripe with your secret key
// sk_test_51QWXp5FWojz9eoui3b20GWIoF6Yxged00OdF74C7SSSqnpYie13SsJWAm6ev4AvSaA8lLl3JjZJWvRxqeIB9wihP00AaiXdZKs
const stripe = new stripe_1.default('sk_test_51QWXp5FWojz9eoui3b20GWIoF6Yxged00OdF74C7SSSqnpYie13SsJWAm6ev4AvSaA8lLl3JjZJWvRxqeIB9wihP00AaiXdZKs');
const getApproveSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(id, 'id123456');
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
        const getuserallsubcription = yield subcriptionPurchase_schema_1.default.find({
            merchant: merchantId,
        });
        // get last subcription expiry date
        const lastsubcriptionexpirydate = getuserallsubcription.reduce((latest, current) => {
            if (!latest || !latest.expiry)
                return current;
            if (!current || !current.expiry)
                return latest;
            return new Date(current.expiry) > new Date(latest.expiry)
                ? current
                : latest;
        }, null);
        console.log(lastsubcriptionexpirydate, 'lastsubcriptionexpirydate');
        // get day of lastsubcriptionexpirydate
        const subcriptiondata = yield subcription_schema_1.default.findById(planId);
        const startDate = lastsubcriptionexpirydate
            ? new Date(lastsubcriptionexpirydate.expiry) > new Date()
                ? new Date(lastsubcriptionexpirydate.expiry)
                : new Date()
            : new Date();
        //  add day of subcriptiondata to startDate
        const expiry = new Date(startDate.getTime() + subcriptiondata.seconds * 1000);
        yield subcriptionPurchase_schema_1.default.create({
            subcriptionId: planId,
            merchant: merchantId,
            // if last subcription expiry date is greater than current date then add 1 month to the expiry date
            expiry: expiry,
            status: 'APPROVED',
            startDate: startDate,
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
const switchSubscriptionPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { planId, merchantId } = req.body;
    try {
        // Validate input data
        if (!planId || !merchantId) {
            return res.status(400).json({
                status: false,
                message: 'Plan ID and Merchant ID are required',
            });
        }
        // Find and expire all active subscriptions for the merchant
        const activeSubscriptions = yield subcriptionPurchase_schema_1.default.find({
            merchant: merchantId,
            status: 'APPROVED',
            expiry: { $gt: new Date() },
        });
        if (activeSubscriptions.length > 0) {
            yield Promise.all(activeSubscriptions.map((subscription) => __awaiter(void 0, void 0, void 0, function* () {
                yield subcriptionPurchase_schema_1.default.findByIdAndUpdate(subscription._id, {
                    status: 'EXPIRED',
                });
            })));
        }
        // Get the new plan details
        const newPlan = yield subcriptionPurchase_schema_1.default.findById(planId);
        if (!newPlan) {
            return res.status(404).json({
                status: false,
                message: 'Invalid plan ID',
            });
        }
        // Calculate new expiry date
        const planDetails = yield subcription_schema_1.default.findById(newPlan.subcriptionId);
        const startDate = new Date();
        const newExpiry = new Date(startDate.getTime() + planDetails.seconds * 1000);
        // Update the new subscription plan
        yield subcriptionPurchase_schema_1.default.findByIdAndUpdate(newPlan._id, {
            expiry: newExpiry,
            startDate: startDate,
            status: 'APPROVED',
        });
        return res.status(200).json({
            status: true,
            message: 'Subscription plan switched successfully',
        });
    }
    catch (error) {
        console.error('Error switching subscription plan:', error);
        return res.status(500).json({
            status: false,
            message: 'Something went wrong while switching subscription plan',
        });
    }
});
exports.switchSubscriptionPlan = switchSubscriptionPlan;
