import { RequestParams } from '../../utils/types/expressTypes';
import subcriptionPurchaseSchema from '../../models/subcriptionPurchase.schema';
import { Response } from 'express';
import { isValidObjectId } from "mongoose";
import { getLanguage } from '../../language/languageHelper';

export const getApproveSubscription = async (req: RequestParams, res: Response) => {
    try {
        const { id } = req.params;
    
        // Validate ID
        if (!isValidObjectId(id)) {
          return res.status(400).json({
            status: false,
            // message: "Invalid customer ID.",
            message: "Invalid merchant ID.",
          });
        }
    
        // Fetch subscriptions
        const data = await subcriptionPurchaseSchema.find({
        //   status: "APPROVED",
          // customer: id,
          merchant: id,
        }).populate("subcriptionId");
    
        // Handle case with no results
        if (!data.length) {
          return res.status(404).json({
            status: false,
            // message: "No approved subscriptions found for this customer.",
            message: "No approved subscriptions found for this merchant.",
          });
        }
    
        // Success response
        return res.status(200).json({
          status: true,
          data,
        });
      } catch (error : any) {
        console.error("Error in getApproveSubscription:", error.message);
        return res.status(500).json({
          status: false,
          message: "Something went wrong while fetching subscriptions.",
        });
      }
    
  };
  