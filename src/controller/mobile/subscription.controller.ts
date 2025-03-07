import { RequestParams } from '../../utils/types/expressTypes';
import subcriptionPurchaseSchema from '../../models/subcriptionPurchase.schema';
import { Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { getLanguage } from '../../language/languageHelper';
import Stripe from 'stripe';
import SubcriptionSchema from '../../models/subcription.schema';

// Initialize Stripe with your secret key
// sk_test_51QWXp5FWojz9eoui3b20GWIoF6Yxged00OdF74C7SSSqnpYie13SsJWAm6ev4AvSaA8lLl3JjZJWvRxqeIB9wihP00AaiXdZKs
const stripe = new Stripe(
  'sk_test_51QWXp5FWojz9eoui3b20GWIoF6Yxged00OdF74C7SSSqnpYie13SsJWAm6ev4AvSaA8lLl3JjZJWvRxqeIB9wihP00AaiXdZKs',
);

export const getApproveSubscription = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const { id } = req.params;
    console.log(id, 'id1234');

    // Validate ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: false,
        // message: "Invalid customer ID.",
        message: 'Invalid merchant ID.',
      });
    }

    // Fetch subscriptions
    const data = await subcriptionPurchaseSchema
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
  } catch (error: any) {
    console.error('Error in getApproveSubscription:', error.message);
    return res.status(500).json({
      status: false,
      message: 'Something went wrong while fetching subscriptions.',
    });
  }
};

export const stripPayment = async (req: RequestParams, res: Response) => {
  const { amount, planId, duration, expiryDate, merchantId } = req.body;

  console.log(
    'Received Payment Data:',
    amount,
    planId,
    duration,
    expiryDate,
    merchantId,
  );

  try {
    // Ensure amount is in the smallest currency unit (e.g., cents for USD, pennies for GBP)
    const formattedAmount = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
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
    const getuserallsubcription = await subcriptionPurchaseSchema.find({
      merchant: merchantId,
    });
    // get last subcription expiry date
    const lastsubcriptionexpirydate = getuserallsubcription.reduce((latest, current) => {
      if (!latest || !latest.expiry) return current;
      if (!current || !current.expiry) return latest;
      return new Date(current.expiry) > new Date(latest.expiry) ? current : latest;
    }, null);
    console.log(lastsubcriptionexpirydate, 'lastsubcriptionexpirydate');


    
    
    // get day of lastsubcriptionexpirydate
    const subcriptiondata = await SubcriptionSchema.findById(planId);
    const startDate = lastsubcriptionexpirydate ? new Date(lastsubcriptionexpirydate.expiry) > new Date() ? new Date(lastsubcriptionexpirydate.expiry) : new Date() : new Date();
  //  add day of subcriptiondata to startDate
    const expiry = new Date(startDate.getTime() + subcriptiondata.seconds * 1000);
      await subcriptionPurchaseSchema.create({
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
  } catch (error) {
    console.error('Stripe Payment Error:', error);

    res.status(500).send({
      message: 'Something went wrong while processing the payment.',
    });
  }
};
