import { Response } from 'express';
import { getLanguage } from '../../language/languageHelper';
import { RequestParams } from '../../utils/types/expressTypes';
import bileSchema from '../../models/bile.Schema';

export const getBilling = async (req: RequestParams, res: Response) => {
  try {
    const merchantId = req.id; // Get merchant ID from request
    const { status, deliveryManId } = req.query; // Added deliveryManId to query parameters
    const query: any = { merchantId }; // Use 'any' to avoid TypeScript error
    if (status) {
      query.orderStatus = status;
    }

    console.log(query);
    
    const data = await bileSchema.aggregate([
      { $match: query }, // Match the query first
      {
        $lookup: {
          from: "deliveryMan", 
          localField: "deliveryBoyId",
          foreignField: "_id",
          as: "deliveryMan"
        }
      },
      {
        $unwind: "$deliveryMan"
      },
      {
        $sort: { orderId: -1, subOrderId: 1 }
      },
      {
        $project: {
          _id: 1,
          deliveryBoyId: 1,
          merchantId: 1,
          orderId: 1,
          subOrderId: 1,
          pickupTime: 1,
          charge: 1,
          totalCharge: 1,
          orderStatus: 1,
          chargeMethod: 1,
          isApproved: 1,
          isPaid: 1,
          averageTime: 1,
          createdAt: 1,
          updatedAt: 1,
          deliveryMan: {
            _id: "$deliveryMan._id",
            firstName: "$deliveryMan.firstName",
            lastName: "$deliveryMan.lastName",
            email: "$deliveryMan.email",
            contactNumber: "$deliveryMan.contactNumber",
            isVerified: "$deliveryMan.isVerified",
            charge: "$deliveryMan.charge",
            adminCharge: "$deliveryMan.adminCharge",
            createdByAdmin: "$deliveryMan.createdByAdmin",
            createdByMerchant: "$deliveryMan.createdByMerchant"
          }
        }
      }
    ]);

    // Group data by orderId and create subdata array for each group
    const groupedData = data.reduce((acc, curr) => {
      const existingGroup = acc.find((group:any) => group.orderId === curr.orderId);
      
      if (existingGroup) {
        // Add to subdata if orderId exists
        existingGroup.subdata.push({
          subOrderId: curr.subOrderId,
          pickupTime: curr.pickupTime,
          charge: curr.totalCharge??0,
          orderStatus: curr.orderStatus,
          chargeMethod: curr.chargeMethod,
          isApproved: curr.isApproved,
          isPaid: curr.isPaid,
          averageTime: curr.averageTime
        });
      } else {
        // Create new group if orderId doesn't exist
        acc.push({
          _id: curr._id,
          deliveryBoyId: curr.deliveryBoyId,
          merchantId: curr.merchantId,
          orderId: curr.orderId,
          createdAt: curr.createdAt,
          updatedAt: curr.updatedAt,
          deliveryMan: curr.deliveryMan,
          subdata: [{
            subOrderId: curr.subOrderId,
            pickupTime: curr.pickupTime,
            charge: curr.totalCharge??0,
            orderStatus: curr.orderStatus,
            chargeMethod: curr.chargeMethod,
            isApproved: curr.isApproved,
            isPaid: curr.isPaid,
            averageTime: curr.averageTime
          }]
        });
      }
      return acc;
    }, []);

    // Sort subdata arrays by subOrderId
    groupedData.forEach((group:any) => {
      group.subdata.sort((a:any, b:any) => a.subOrderId - b.subOrderId);
    });

    if (!groupedData || groupedData.length === 0) {
      return res.failureResponse({
        message: "No billing data found",
        data: null
      });
    }

    return res.ok({ message: "Billing data retrieved successfully", data:groupedData });
  } catch (error) {
    console.log('error', error);
    return res.failureResponse({
      message: "Something went wrong",
      data: null
    });
  }
};
