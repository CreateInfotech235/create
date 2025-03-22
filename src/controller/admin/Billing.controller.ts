import BillingSchema from '../../models/billing.Schema';
import { RequestParams } from '../../utils/types/expressTypes';
import { Response } from 'express';
import mongoose from 'mongoose';

export const getBilling = async (req: RequestParams, res: Response) => {
  try {
    const merchantId = req.query.merchantId; // Get merchant ID from request
    const { status, deliveryManId } = req.query; // Added deliveryManId to query parameters
    const query: any = {}; // Use 'any' to avoid TypeScript error
    if (merchantId) {
      query.merchantId = new mongoose.Types.ObjectId(merchantId);
    }

    if (status) {
      query.orderStatus = status;
    }
    if (deliveryManId) {
      query.deliveryBoyId = new mongoose.Types.ObjectId(deliveryManId);
    }

    console.log(query);

    const data = await BillingSchema.aggregate([
      { $match: query }, // Match the query first
      {
        $lookup: {
          from: 'deliveryMan',
          localField: 'deliveryBoyId',
          foreignField: '_id',
          as: 'deliveryBoy',
        },
      },
      {
        $unwind: '$deliveryBoy',
      },
      {
        $addFields: {
          deliveryBoyName: {
            $concat: ['$deliveryBoy.firstName', ' ', '$deliveryBoy.lastName'],
          },
        },
      },
      {
        $addFields: {
          totalAmountOfPackage: {
            $sum: '$subOrderdata.amountOfPackage',
          },
        },
      },

      {
        $sort: {
          orderId: -1, // Sort by orderId in ascending order
        },
      },

      {
        $project: {
          _id: 1,
          deliveryBoyId: 1,
          merchantId: 1,
          reason: 1,
          orderId: 1,
          approvedAmount: 1,
          charge: 1,
          panaltyAmount: 1,
          interestAmount: 1,
          paidAmount: 1,
          totalAmountOfPackage: 1,
          orderStatus: 1,
          isApproved: 1,
          isPaid: 1,
          showOrderId: 1,
          createdAt: 1,
          updatedAt: 1,
          subOrderdata: 1,
          chargeMethod: 1,
          deliveryBoyName: 1,
          totalCharge: 1,
          'deliveryBoy.contactNumber': 1,
          'deliveryBoy.email': 1,
          'deliveryBoy.adminCharge': 1,
          'deliveryBoy.createdByAdmin': 1,
          'deliveryBoy.createdByMerchant': 1,
        },
      },
    ]);

    return res.ok({
      message: 'Billing data retrieved successfully',
      data: data,
    });
  } catch (error) {
    console.log('error', error);
    return res.failureResponse({
      message: 'Something went wrong',
      data: null,
    });
  }
};
