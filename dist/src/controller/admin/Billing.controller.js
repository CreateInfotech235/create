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
exports.getBilling = void 0;
const billing_Schema_1 = __importDefault(require("../../models/billing.Schema"));
const mongoose_1 = __importDefault(require("mongoose"));
const getBilling = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const merchantId = req.query.merchantId; // Get merchant ID from request
        const { status, deliveryManId } = req.query; // Added deliveryManId to query parameters
        const query = {}; // Use 'any' to avoid TypeScript error
        if (merchantId) {
            query.merchantId = new mongoose_1.default.Types.ObjectId(merchantId);
        }
        if (status) {
            query.orderStatus = status;
        }
        if (deliveryManId) {
            query.deliveryBoyId = new mongoose_1.default.Types.ObjectId(deliveryManId);
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
                    'deliveryBoy.createdByAdmin': 1,
                    'deliveryBoy.createdByMerchant': 1,
                },
            },
        ]);
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
