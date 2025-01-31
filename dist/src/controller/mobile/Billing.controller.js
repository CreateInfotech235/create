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
const bile_Schema_1 = __importDefault(require("../../models/bile.Schema"));
const getBilling = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const merchantId = req.id; // Get merchant ID from request
        const { status, deliveryManId } = req.query; // Added deliveryManId to query parameters
        const query = { merchantId }; // Use 'any' to avoid TypeScript error
        if (status) {
            query.orderStatus = status;
        }
        console.log(query);
        const data = yield bile_Schema_1.default.aggregate([
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
                    pickupAddress: 1,
                    deliveryAddress: 1,
                    pickupLocation: 1,
                    deliveryLocation: 1,
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
            var _a, _b;
            const existingGroup = acc.find((group) => group.orderId === curr.orderId);
            if (existingGroup) {
                // Add to subdata if orderId exists
                existingGroup.subdata.push({
                    subOrderId: curr.subOrderId,
                    pickupTime: curr.pickupTime,
                    charge: (_a = curr.totalCharge) !== null && _a !== void 0 ? _a : 0,
                    orderStatus: curr.orderStatus,
                    chargeMethod: curr.chargeMethod,
                    pickupAddress: curr.pickupAddress,
                    deliveryAddress: curr.deliveryAddress,
                    pickupLocation: curr.pickupLocation,
                    deliveryLocation: curr.deliveryLocation,
                    isApproved: curr.isApproved,
                    isPaid: curr.isPaid,
                    averageTime: curr.averageTime
                });
            }
            else {
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
                            charge: (_b = curr.totalCharge) !== null && _b !== void 0 ? _b : 0,
                            orderStatus: curr.orderStatus,
                            chargeMethod: curr.chargeMethod,
                            isApproved: curr.isApproved,
                            pickupAddress: curr.pickupAddress,
                            deliveryAddress: curr.deliveryAddress,
                            pickupLocation: curr.pickupLocation,
                            deliveryLocation: curr.deliveryLocation,
                            isPaid: curr.isPaid,
                            averageTime: curr.averageTime
                        }]
                });
            }
            return acc;
        }, []);
        // Sort subdata arrays by subOrderId
        groupedData.forEach((group) => {
            group.subdata.sort((a, b) => a.subOrderId - b.subOrderId);
        });
        if (!groupedData || groupedData.length === 0) {
            return res.failureResponse({
                message: "No billing data found",
                data: null
            });
        }
        return res.ok({ message: "Billing data retrieved successfully", data: groupedData });
    }
    catch (error) {
        console.log('error', error);
        return res.failureResponse({
            message: "Something went wrong",
            data: null
        });
    }
});
exports.getBilling = getBilling;
