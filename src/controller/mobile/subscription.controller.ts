import { RequestParams } from '../../utils/types/expressTypes';
import subcriptionPurchaseSchema from '../../models/subcriptionPurchase.schema';
import { Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { getLanguage } from '../../language/languageHelper';
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe("sk_test_51QcPPDQMthVbcTznaXonGohKGL7ex2KbsLcqT1dfU48VtQwVZMxXmdD2DElkZ9lj3mLkiOnKK1vySFgb6Jt4cSuG00QtycW7PB");


export const getApproveSubscription = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const { id } = req.params;
    console.log(id, "id1234");

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
    console.log(data, "data1234");
    // Handle case with no results
    // if (!data.length) {
    //   return res.status(404).json({
    //     status: false,
    //     // message: "No approved subscriptions found for this customer.",
    //     message: 'No approved subscriptions found for this merchant.',
    //   });
    // }

    // Success response
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

  console.log("Received Payment Data:", amount, planId, duration, expiryDate, merchantId);

  try {
    // Ensure amount is in the smallest currency unit (e.g., cents for USD, pennies for GBP)
    const formattedAmount = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: formattedAmount, // Amount in smallest currency unit
      currency: "gbp", // Replace with your currency code
      payment_method_types: ["card"], // Allow card payments
      metadata: {
        planId,
        duration,
        expiryDate,
        merchantId
      },
    });

    // Create subscription purchase record
    await subcriptionPurchaseSchema.create({
      subcriptionId: planId,
      merchant: merchantId,
      expiry: expiryDate,
      status: 'APPROVED'
    });

    console.log("Payment Intent Created:", paymentIntent);

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Payment Error:", error);

    res.status(500).send({
      message: "Something went wrong while processing the payment.",
    });
  }
};
