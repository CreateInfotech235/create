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
exports.BillingApprove = exports.getBilling = void 0;
const billing_Schema_1 = __importDefault(require("../../models/billing.Schema"));
const deliveryMan_schema_1 = __importDefault(require("../../models/deliveryMan.schema"));
const getBilling = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const merchantId = req.id; // Get merchant ID from request
        const { status, deliveryManId } = req.query; // Added deliveryManId to query parameters
        const query = { merchantId }; // Use 'any' to avoid TypeScript error
        if (status) {
            query.orderStatus = status;
        }
        console.log(query);
        const data = yield billing_Schema_1.default.aggregate([
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
    }
    catch (error) {
        console.log('error', error);
        return res.failureResponse({
            message: 'Something went wrong',
            data: null,
        });
    }
});
exports.getBilling = getBilling;
const BillingApprove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, reason, approvedAmount } = req.body;
        const merchantId = req.id;
        // Validate request body
        if (!orderId || !approvedAmount) {
            return res.badRequest({ message: 'Invalid request body' });
        }
        // Find billing record matching orderId and merchantId
        const billingData = yield billing_Schema_1.default.findOne({
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
        yield deliveryMan_schema_1.default.findByIdAndUpdate(billingData.deliveryBoyId, {
            $inc: {
                balance: approvedAmount
            }
        });
        console.log(reason, "reason");
        // Approve billing
        yield billing_Schema_1.default.findByIdAndUpdate(billingData._id, {
            $set: {
                isApproved: true,
                reason: reason || '',
                approvedAmount: approvedAmount
            }
        });
        return res.ok({ message: 'Billing approved successfully', data: billingData });
    }
    catch (error) {
        console.log(error, "error");
        console.error('Error in BillingApprove:', error);
        return res.failureResponse({ message: 'Something went wrong', data: null });
    }
});
exports.BillingApprove = BillingApprove;
