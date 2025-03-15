import { Response } from 'express';
import { getLanguage } from '../../language/languageHelper';
import { RequestParams } from '../../utils/types/expressTypes';
import BillingSchema from '../../models/billing.Schema';
import DeliveryManSchema from '../../models/deliveryMan.schema';

export const getBilling = async (req: RequestParams, res: Response) => {
  try {
    const merchantId = req.id; // Get merchant ID from request
    const { status, deliveryManId } = req.query; // Added deliveryManId to query parameters
    const query: any = { merchantId }; // Use 'any' to avoid TypeScript error
    if (status) {
      query.orderStatus = status;
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
        },
      },
    ]);

    console.log(data, 'data123');
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
export const BillingApprove = async (req: RequestParams, res: Response) => {
  try {
    const { orderId, reason, approvedAmount } = req.body;
    const merchantId = req.id;

    // Validate request body
    if (!orderId || !approvedAmount) {
      return res.badRequest({ message: 'Invalid request body' });
    }

    // Find billing record matching orderId and merchantId
    const billingData = await BillingSchema.findOne({
      orderId,
      merchantId
    });

    if (!billingData) {
      return res.badRequest({ message: 'No billing records found' });
    }

    // Check if already approved
    if (billingData.isApproved) {
      return res.badRequest({ message: 'Billing has already been approved' });
    }

    // Update delivery man's balance
    await DeliveryManSchema.findByIdAndUpdate(billingData.deliveryBoyId, {
      $inc: {
        balance: approvedAmount
      }
    });
console.log(reason, "reason");

    // Approve billing
    await BillingSchema.findByIdAndUpdate(billingData._id, {
      $set: {
        isApproved: true,
        reason: reason || '',
        approvedAmount: approvedAmount
      }
    });

    return res.ok({ message: 'Billing approved successfully', data: billingData });

  } catch (error) {
    console.log(error, "error");
    console.error('Error in BillingApprove:', error);
    return res.failureResponse({ message: 'Something went wrong', data: null });
  }
};
