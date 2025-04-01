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
exports.resetPassword = exports.verifyOtp = exports.sendOtp = exports.deleteMessageFromTicket = exports.addMessageToTicket = exports.getunreadMessages = exports.MessageDelete = exports.Messageread = exports.Messageupdate = exports.getMessagesByTicketId = exports.getAllTickets = exports.sendEmailFor = exports.getSupportTicket = exports.getAdminProfile = exports.getUnreadNotificationCount = exports.deleteNotification = exports.markAllNotificationsAsRead = exports.markNotificationAsRead = exports.getAllNotifications = exports.getOrderCounts = exports.logout = exports.renewToken = exports.profileUpdate = exports.sendEmailOrMobileOtp = exports.profileCredentialUpdate = exports.signIn = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const enum_1 = require("../../enum");
const languageHelper_1 = require("../../language/languageHelper");
const admin_schema_1 = __importDefault(require("../../models/admin.schema"));
const authToken_schema_1 = __importDefault(require("../../models/authToken.schema"));
const otp_schema_1 = __importDefault(require("../../models/otp.schema"));
const SupportTicket_1 = __importDefault(require("../../models/SupportTicket"));
const index_1 = require("../../../index");
const common_1 = require("../../utils/common");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const adminSide_validation_1 = require("../../utils/validation/adminSide.validation");
const auth_validation_1 = require("../../utils/validation/auth.validation");
const orderHistory_schema_1 = __importDefault(require("../../models/orderHistory.schema"));
const order_schema_1 = __importDefault(require("../../models/order.schema"));
const orderAssignee_schema_1 = __importDefault(require("../../models/orderAssignee.schema"));
const deliveryMan_schema_1 = __importDefault(require("../../models/deliveryMan.schema"));
const notificatio_schema_1 = __importDefault(require("../../models/notificatio.schema"));
const user_schema_1 = __importDefault(require("../../models/user.schema"));
const unreadMessages_1 = require("../Notificationinapp/unreadMessages");
const getimgurl_1 = require("../getimgurl/getimgurl");
const messages_schema_1 = __importDefault(require("../../models/messages.schema"));
const mongoose_1 = __importDefault(require("mongoose"));
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, adminSide_validation_1.adminSignInValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const userExist = yield admin_schema_1.default.findOne({ email: value.email });
        if (!userExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').invalidLoginCredentials,
            });
        }
        const isVerifyPassword = yield (0, common_1.passwordValidation)(value.password, userExist.password);
        if (!isVerifyPassword) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').invalidLoginCredentials,
            });
        }
        yield authToken_schema_1.default.deleteMany({ adminId: userExist._id });
        const { accessToken, refreshToken } = (0, common_1.createAuthTokens)(userExist._id);
        yield authToken_schema_1.default.create({
            adminId: userExist._id,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').loginSuccessfully,
            data: { data: userExist, adminAuthData: { accessToken, refreshToken } },
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.signIn = signIn;
const profileCredentialUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.adminCredentialValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const otpData = yield otp_schema_1.default.findOne({
            value: value.otp,
            customerEmail: value.email,
            expiry: { $gte: Date.now() },
        });
        if (!otpData) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').otpExpired });
        }
        yield admin_schema_1.default.updateOne({ _id: value.adminId }, { $set: value });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').dataUpdatedSuccessfully,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.profileCredentialUpdate = profileCredentialUpdate;
const sendEmailOrMobileOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.otpVerifyValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const otp = (0, common_1.generateIntRandomNo)(111111, 999999);
        // await emailOrMobileOtp(
        //   value.email,
        //   `This is your otp for registration ${otp}`,
        // );
        yield otp_schema_1.default.updateOne({
            value: otp,
            customerEmail: value.email,
            customerMobile: value.contactNumber,
        }, {
            value: otp,
            customerEmail: value.email,
            customerMobile: value.contactNumber,
            action: value.personType,
            expiry: Date.now() + 600000,
        }, { upsert: true });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').otpSentSuccess,
            data: { otp },
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.sendEmailOrMobileOtp = sendEmailOrMobileOtp;
const profileUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminData = yield admin_schema_1.default.findOne({ _id: req.id });
        if (adminData) {
            const id = adminData._id;
            req.body.email = req.body.email.trim();
            req.body.name = req.body.name.trim();
            req.body.countryCode = req.body.countryCode.trim();
            yield admin_schema_1.default.updateOne({ _id: id }, { $set: req.body });
        }
        else {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').invalidToken,
            });
        }
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').dataUpdatedSuccessfully,
        });
    }
    catch (error) {
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.profileUpdate = profileUpdate;
const renewToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.renewTokenValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const data = (0, jsonwebtoken_1.verify)(value.refreshToken, process.env.REFRESH_SECRET_KEY);
        if (!(data === null || data === void 0 ? void 0 : data.accessToken)) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidToken });
        }
        const adminVerify = yield admin_schema_1.default.findById(data.id);
        if (!adminVerify) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidToken });
        }
        yield authToken_schema_1.default.deleteMany({ adminId: adminVerify._id });
        const { accessToken, refreshToken } = (0, common_1.createAuthTokens)(adminVerify._id);
        yield authToken_schema_1.default.create({
            adminId: adminVerify._id,
            accessToken: data.accessToken,
            refreshToken: value.refreshToken,
        });
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').renewTokenSuccessfully,
            data: { accessToken, refreshToken },
        });
    }
    catch (error) {
        console.log(error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.renewToken = renewToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.renewTokenValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        const data = (0, jsonwebtoken_1.verify)(value.refreshToken, process.env.REFRESH_SECRET_KEY);
        if (!(data === null || data === void 0 ? void 0 : data.accessToken)) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidToken });
        }
        const adminVerify = yield admin_schema_1.default.findById(data.id);
        if (!adminVerify) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidToken });
        }
        const checkTokenExist = yield authToken_schema_1.default.findOne({
            accessToken: data.accessToken,
            refreshToken: value.refreshToken,
            isActive: false,
        });
        if (checkTokenExist) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').invalidToken });
        }
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').logoutSuccessfully,
        });
    }
    catch (error) {
        console.log(error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.logout = logout;
const getOrderCounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalOrders = yield order_schema_1.default.countDocuments();
        const createdOrders = yield orderHistory_schema_1.default.countDocuments({
            status: 'CREATED',
        });
        const assignedOrders = yield orderHistory_schema_1.default.countDocuments({
            status: 'ASSIGNED',
        });
        const acceptedOrders = yield orderAssignee_schema_1.default.countDocuments({
            status: 'ACCEPTED',
        });
        const arrivedOrders = yield orderHistory_schema_1.default.countDocuments({
            status: 'ARRIVED',
        });
        const pickedOrders = yield orderHistory_schema_1.default.countDocuments({
            status: 'PICKED_UP',
        });
        const departedOrders = yield orderHistory_schema_1.default.countDocuments({
            status: 'DEPARTED',
        });
        const deliveredOrders = yield orderHistory_schema_1.default.countDocuments({
            status: 'DELIVERED',
        });
        const cancelledOrders = yield orderHistory_schema_1.default.countDocuments({
            status: 'CANCELLED',
        });
        const deliveryMan = yield deliveryMan_schema_1.default.countDocuments();
        const merchantCount = yield user_schema_1.default.aggregate([
            {
                $lookup: {
                    from: 'subcriptionPurchase',
                    localField: '_id',
                    foreignField: 'merchant',
                    as: 'subcriptionPurchase',
                },
            },
            {
                $unwind: {
                    path: '$subcriptionPurchase',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'subcriptions',
                    localField: 'subcriptionPurchase.subcriptionId',
                    foreignField: '_id',
                    as: 'subcription',
                },
            },
            {
                $project: {
                    _id: 1,
                    subcription: 1,
                    expiry: '$subcriptionPurchase.expiry',
                },
            },
            {
                $addFields: {
                    isActive: {
                        $cond: {
                            if: {
                                $and: [
                                    { $ne: ['$subcription', []] }, // Not empty subcription
                                    { $gte: ['$expiry', new Date()] }, // Expiry is valid
                                ],
                            },
                            then: true,
                            else: false,
                        },
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    subscribedMerchants: {
                        $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] },
                    },
                    unsubscribedMerchants: {
                        $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] },
                    },
                },
            },
        ]);
        let totalCounts = {
            totalOrders,
            createdOrders,
            assignedOrders,
            acceptedOrders,
            arrivedOrders,
            pickedOrders,
            departedOrders,
            deliveredOrders,
            cancelledOrders,
            deliveryMan,
            subscribedMerchants: merchantCount[0].subscribedMerchants,
            unsubscribedMerchants: merchantCount[0].unsubscribedMerchants,
        };
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').countedData,
            data: totalCounts,
        });
    }
    catch (error) {
        console.log(error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getOrderCounts = getOrderCounts;
const getAllNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        console.log(req.id);
        // Get all notifications for the user
        const notifications = yield notificatio_schema_1.default.find({ userId })
            .sort({ createdAt: -1 })
            .populate('orderId')
            .populate('senderId');
        return res.status(200).json({
            message: 'Notifications retrieved successfully',
            data: notifications,
        });
    }
    catch (error) {
        console.error('Error getting notifications:', error);
        return res.status(500).json({
            message: 'There was an error retrieving notifications',
        });
    }
});
exports.getAllNotifications = getAllNotifications;
const markNotificationAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notificationId } = req.params;
        const userId = req.id;
        const notification = yield notificatio_schema_1.default.findOneAndUpdate({ _id: notificationId, userId }, { isRead: true }, { new: true });
        if (!notification) {
            return res.status(404).json({
                message: 'Notification not found',
            });
        }
        return res.status(200).json({
            message: 'Notification marked as read',
            data: notification,
        });
    }
    catch (error) {
        console.error('Error marking notification as read:', error);
        return res.status(500).json({
            message: 'There was an error updating the notification',
        });
    }
});
exports.markNotificationAsRead = markNotificationAsRead;
const markAllNotificationsAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        yield notificatio_schema_1.default.updateMany({ userId, isRead: false }, { isRead: true });
        return res.status(200).json({
            message: 'All notifications marked as read',
        });
    }
    catch (error) {
        console.error('Error marking all notifications as read:', error);
        return res.status(500).json({
            message: 'There was an error updating notifications',
        });
    }
});
exports.markAllNotificationsAsRead = markAllNotificationsAsRead;
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notificationId } = req.params;
        const userId = req.id;
        console.log(req.id);
        const deletedNotification = yield notificatio_schema_1.default.findOneAndDelete({
            _id: notificationId,
            userId,
        });
        console.log(deletedNotification);
        if (!deletedNotification) {
            return res.status(404).json({
                message: 'Notification not found',
            });
        }
        return res.status(200).json({
            message: 'Notification deleted successfully',
            data: deletedNotification,
        });
    }
    catch (error) {
        console.error('Error deleting notification:', error);
        return res.status(500).json({
            message: 'There was an error deleting the notification',
        });
    }
});
exports.deleteNotification = deleteNotification;
const getUnreadNotificationCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const count = yield notificatio_schema_1.default.countDocuments({
            userId,
            isRead: false,
        });
        return res.status(200).json({
            message: 'Unread notification count retrieved successfully',
            data: { count },
        });
    }
    catch (error) {
        console.error('Error getting unread notification count:', error);
        return res.status(500).json({
            message: 'There was an error retrieving unread notification count',
        });
    }
});
exports.getUnreadNotificationCount = getUnreadNotificationCount;
const getAdminProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('req', req.id);
    try {
        const adminData = yield admin_schema_1.default.findOne({ _id: req.id });
        return res.ok({
            data: adminData,
        });
    }
    catch (error) {
        console.log(error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.getAdminProfile = getAdminProfile;
const getSupportTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Request body:', req.body);
        const id = req.id;
        const data = yield SupportTicket_1.default.find({ adminId: id })
            .populate('userid', 'firstName lastName email -_id')
            .select('-messages');
        console.log('data', data);
        return res.status(200).json({
            message: 'Support ticket get successfully',
            data: data,
        });
    }
    catch (error) {
        console.error('Error get support ticket:', error);
        return res.status(500).json({
            message: 'There was an error get the support ticket',
        });
    }
});
exports.getSupportTicket = getSupportTicket;
const sendEmailFor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('FDksdjgdfgsdjsgb');
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.otpVerifyValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        let userExist;
        const isCustomer = value.personType === enum_1.PERSON_TYPE.CUSTOMER;
        if (isCustomer) {
            userExist = yield user_schema_1.default.findOne({
                email: value.email,
                contactNumber: value.contactNumber,
                countryCode: value.countryCode,
            });
        }
        else {
            userExist = yield deliveryMan_schema_1.default.findOne({
                email: value.email,
                contactNumber: value.contactNumber,
                countryCode: value.countryCode,
            });
        }
        if (userExist) {
            return res.badRequest({
                message: (0, languageHelper_1.getLanguage)('en').emailRegisteredAlready,
            });
        }
        // const otp = generateIntRandomNo(111111, 999999);
        yield (0, common_1.emailSend)(value.email, value.subject, `${value.messageSend}`);
        // const data = await otpSchema.updateOne(
        //   {
        //     // value: otp,
        //     customerEmail: value.email,
        //     customerMobile: value.contactNumber,
        //     action: value.personType,
        //   },
        //   {
        //     value: otp,
        //     customerEmail: value.email,
        //     customerMobile: value.contactNumber,
        //     expiry: Date.now() + 600000,
        //     action: value.personType,
        //   },
        //   { upsert: true },
        // );
        // if (!data.upsertedCount && !data.modifiedCount) {
        //   return res.badRequest({ message: getLanguage('en').invalidData });
        // }
        return res.ok({
            message: (0, languageHelper_1.getLanguage)('en').EmailSentSuccess,
            // data: { otp },
        });
    }
    catch (error) {
        console.log(error);
        return res.failureResponse({
            error: error,
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.sendEmailFor = sendEmailFor;
const getAllTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tickets = yield SupportTicket_1.default.find({}, 'userid'); // Return only merchantName and _id
        console.log(tickets, 'tickets');
        res.json(tickets);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch tickets' });
    }
});
exports.getAllTickets = getAllTickets;
// Fetch messages for a specific ticket
const getMessagesByTicketId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params.id, 'fddfdf');
        const ticket = yield messages_schema_1.default.find({
            SupportTicketId: req.params.id,
        });
        console.log(ticket, 'ticket');
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
});
exports.getMessagesByTicketId = getMessagesByTicketId;
const Messageupdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { supportTicketId, messageId } = req.params;
        const { nowmessage } = req.body;
        console.log(supportTicketId, messageId, 'supportTicketId, messageId');
        const ticket = yield messages_schema_1.default.findOneAndUpdate({
            _id: new mongoose_1.default.Types.ObjectId(messageId),
            SupportTicketId: new mongoose_1.default.Types.ObjectId(supportTicketId),
        }, { text: nowmessage }, { new: true });
        const newmessages = yield messages_schema_1.default.find({
            SupportTicketId: new mongoose_1.default.Types.ObjectId(supportTicketId),
        });
        index_1.io.to(supportTicketId).emit('messageRead', {
            ticketId: supportTicketId,
            update: newmessages,
        });
        res.status(200).json({ message: 'Message updated successfully' });
    }
    catch (error) {
        console.log(error, 'error');
        res.status(500).json({ message: 'Failed to update message' });
    }
});
exports.Messageupdate = Messageupdate;
const Messageread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { supportTicketId } = req.params;
        const ticket = yield SupportTicket_1.default.findById(supportTicketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        yield messages_schema_1.default.updateMany({
            SupportTicketId: new mongoose_1.default.Types.ObjectId(supportTicketId),
            sender: 'merchant',
            isRead: false,
        }, {
            isRead: true,
        });
        const newmessages = yield messages_schema_1.default.find({
            SupportTicketId: new mongoose_1.default.Types.ObjectId(supportTicketId),
        });
        index_1.io.to(supportTicketId).emit('messageRead', {
            ticketId: supportTicketId,
            update: newmessages,
        });
        index_1.io.to(supportTicketId).emit('Messagedataupdate', {
            unreadMessages: yield (0, unreadMessages_1.unreadMessages)(ticket.userid.toString(), 'merchant'),
        });
        res.status(200).json({ message: 'Message read successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to read message' });
    }
});
exports.Messageread = Messageread;
const MessageDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { supportTicketId, messageId } = req.params;
        console.log(supportTicketId, messageId, 'supportTicketId, messageId');
        const ticket = yield messages_schema_1.default.findOneAndDelete({
            _id: new mongoose_1.default.Types.ObjectId(messageId),
            SupportTicketId: new mongoose_1.default.Types.ObjectId(supportTicketId),
        });
        const newmessages = yield messages_schema_1.default.find({
            SupportTicketId: new mongoose_1.default.Types.ObjectId(supportTicketId),
        });
        index_1.io.to(supportTicketId).emit('messageDelete', {
            ticketId: supportTicketId,
            update: newmessages,
        });
        res.status(200).json({ message: 'Message deleted successfully' });
    }
    catch (error) {
        console.log(error, 'error');
        res.status(500).json({ message: 'Failed to delete message' });
    }
});
exports.MessageDelete = MessageDelete;
// full url is https://create-courier-8.onrender.com/admin/auth/unreadMessages/66f000000000000000000000
const getunreadMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, unreadMessages_1.unreadMessages)(undefined, 'merchant');
        if ('error' in result) {
            return res.status(404).json({ message: result.error });
        }
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to fetch unread messages' });
    }
});
exports.getunreadMessages = getunreadMessages;
// Add a new message to a specific ticket
const addMessageToTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { text, sender, file } = req.body;
        const ticketId = req.params.id;
        // Validate required fields
        if (!sender) {
            return res.status(400).json({ message: 'Sender is required' });
        }
        if (!['merchant', 'admin'].includes(sender)) {
            return res.status(400).json({ message: 'Invalid sender type' });
        }
        if (!text && !(file === null || file === void 0 ? void 0 : file.data)) {
            return res
                .status(400)
                .json({ message: 'Either text or file data is required' });
        }
        // Verify ticket exists
        const ticket = yield SupportTicket_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(ticketId),
                },
            },
            {
                $project: {
                    userid: 1,
                },
            },
        ]);
        if (!ticket || ticket.length === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        // Prepare message data
        const messageData = {
            text,
            sender,
            SupportTicketId: ticketId, // Ensure SupportTicketId is included
            timestamp: new Date(),
        };
        // Handle file attachment if present
        if (file === null || file === void 0 ? void 0 : file.data) {
            const supportedTypes = {
                png: ['image/png'],
                webp: ['image/webp'],
                jpg: ['image/jpeg'],
                jpeg: ['image/jpeg'],
                gif: ['image/gif'],
                bmp: ['image/bmp'],
                tiff: ['image/tiff'],
                svg: ['image/svg+xml'],
                heif: ['image/heif'],
                ico: ['image/x-icon'],
                avif: ['image/avif'],
                pdf: ['application/pdf'],
                doc: ['application/msword'],
                docx: [
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                ],
                zip: [
                    'application/zip',
                    'application/x-zip-compressed',
                    'x-zip-compressed',
                ],
                rar: ['application/x-rar-compressed'],
                txt: ['text/plain'],
                csv: ['text/csv'],
                json: ['application/json'],
                xml: ['application/xml'],
            };
            const mimeMatch = file.data.match(/^data:([^;]+);/);
            if (mimeMatch) {
                const mimeType = mimeMatch[1];
                const extension = ((_a = Object.entries(supportedTypes).find(([_, mimes]) => mimes.includes(mimeType))) === null || _a === void 0 ? void 0 : _a[0]) || 'png';
                messageData.file = {
                    data: yield (0, getimgurl_1.getimgurl)(file.data, extension),
                    name: file === null || file === void 0 ? void 0 : file.name,
                    type: file === null || file === void 0 ? void 0 : file.type,
                    extension: extension,
                };
                messageData.fileType = extension;
            }
        }
        console.log(messageData, 'messageData');
        // Create and save the message
        const message = yield messages_schema_1.default.create(messageData);
        // Emit socket events
        index_1.io.to(ticketId).emit('SupportTicketssendMessage', Object.assign(Object.assign({}, message.toObject()), { ticketId: ticketId }));
        index_1.io.to(ticketId).emit('Messagedataupdate', {
            unreadMessages: yield (0, unreadMessages_1.unreadMessages)(ticket[0].userid.toString(), 'admin'),
        });
        // Return all messages for the ticket
        const messages = yield messages_schema_1.default.find({ SupportTicketId: ticketId });
        res.json(messages);
    }
    catch (error) {
        console.error('Error adding message:', error);
        res.status(500).json({ message: 'Failed to add message' });
    }
});
exports.addMessageToTicket = addMessageToTicket;
const deleteMessageFromTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Gfgeguefg');
        const { ticketId, messageId } = req.params;
        // Find the ticket by ID
        const ticket = yield messages_schema_1.default.findOneAndDelete({
            _id: messageId,
            SupportTicketId: ticketId,
        });
        // Emit the message deletion event via socket
        index_1.io.to(ticketId).emit('messageDeleted', { messageId });
        res.status(200).json({ message: 'Message deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete message' });
    }
});
exports.deleteMessageFromTicket = deleteMessageFromTicket;
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.sendOtpValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        // Check if the user exists
        const user = yield admin_schema_1.default.findOne({ email: value.email });
        if (!user) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').emailNotRegistered });
        }
        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        yield (0, common_1.emailOrMobileOtp)(value.email, `This is your otp for Reset Password ${otp}`);
        yield otp_schema_1.default.create({
            value: otp,
            customerEmail: value.email,
            expiry: otpExpiry,
        });
        // Send OTP (mock or use an actual email/SMS service)
        console.log(`OTP for ${value.email}: ${otp}`);
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').otpSent });
    }
    catch (error) {
        console.error('Error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.sendOtp = sendOtp;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.verifyOtpValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        // Validate OTP
        const otpData = yield otp_schema_1.default.findOne({
            value: value.otp,
            expiry: { $gte: Date.now() },
        });
        if (!otpData) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').otpExpired });
        }
        // Optionally, mark OTP as used or delete it
        yield otp_schema_1.default.deleteOne({ _id: otpData._id });
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').otpVerified });
    }
    catch (error) {
        console.error('Error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.verifyOtp = verifyOtp;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = (0, validateRequest_1.default)(req.body, auth_validation_1.resetPasswordValidation);
        if (!validateRequest.isValid) {
            return res.badRequest({ message: validateRequest.message });
        }
        const { value } = validateRequest;
        // Check if the user exists
        const user = yield admin_schema_1.default.findOne({ email: value.email });
        if (!user) {
            return res.badRequest({ message: (0, languageHelper_1.getLanguage)('en').emailNotRegistered });
        }
        // Encrypt the new password
        const encryptedPassword = yield (0, common_1.encryptPassword)({
            password: value.newPassword,
        });
        // Update the user's password
        yield admin_schema_1.default.updateOne({ email: value.email }, { $set: { password: encryptedPassword } });
        return res.ok({ message: (0, languageHelper_1.getLanguage)('en').passwordResetSuccess });
    }
    catch (error) {
        console.error('Error:', error);
        return res.failureResponse({
            message: (0, languageHelper_1.getLanguage)('en').somethingWentWrong,
        });
    }
});
exports.resetPassword = resetPassword;
