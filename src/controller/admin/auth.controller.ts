import { Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { PERSON_TYPE } from '../../enum';
import { getLanguage } from '../../language/languageHelper';
import adminSchema from '../../models/admin.schema';
import authTokenSchema from '../../models/authToken.schema';
import otpSchema from '../../models/otp.schema';
import SupportTicket from '../../models/SupportTicket';
import { io } from '../../../index';
import {
  createAuthTokens,
  createNotification,
  emailOrMobileOtp,
  emailSend,
  encryptPassword,
  generateIntRandomNo,
  passwordValidation,
  removeUploadedFile,
  uploadFile,
} from '../../utils/common';
import { RequestParams } from '../../utils/types/expressTypes';
import validateParamsWithJoi from '../../utils/validateRequest';
import { adminSignInValidation } from '../../utils/validation/adminSide.validation';
import {
  adminCredentialValidation,
  adminProfileValidation,
  otpVerifyValidation,
  renewTokenValidation,
  resetPasswordValidation,
  sendOtpValidation,
  verifyOtpValidation,
} from '../../utils/validation/auth.validation';
import orderHistorySchema from '../../models/orderHistory.schema';
import orderSchema from '../../models/order.schema';
import orderAssignSchema from '../../models/orderAssignee.schema';
import deliveryManSchema from '../../models/deliveryMan.schema';
import subscribedSchema from '../../models/subcription.schema';
import Notifications from '../../models/notificatio.schema';
import merchantSchema from '../../models/user.schema';
import Ticket from '../../models/Ticket.schema';
import { unreadMessages } from '../Notificationinapp/unreadMessages';
import { getimgurl } from '../getimgurl/getimgurl';
import messagesSchema from '../../models/messages.schema';
import mongoose from 'mongoose';
export const signIn = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      email: string;
      password: string;
    }>(req.body, adminSignInValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }
    const { value } = validateRequest;

    const userExist = await adminSchema.findOne({ email: value.email });

    if (!userExist) {
      return res.badRequest({
        message: getLanguage('en').invalidLoginCredentials,
      });
    }

    const isVerifyPassword = await passwordValidation(
      value.password,
      userExist.password as string,
    );

    if (!isVerifyPassword) {
      return res.badRequest({
        message: getLanguage('en').invalidLoginCredentials,
      });
    }
    await authTokenSchema.deleteMany({ adminId: userExist._id });
    const { accessToken, refreshToken } = createAuthTokens(userExist._id);
    await authTokenSchema.create({
      adminId: userExist._id,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
    return res.ok({
      message: getLanguage('en').loginSuccessfully,
      data: { data: userExist, adminAuthData: { accessToken, refreshToken } },
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const profileCredentialUpdate = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      adminId: string;
      email: string;
      contactNumber: number;
      countryCode: string;
      otp: number;
    }>(req.body, adminCredentialValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }
    const { value } = validateRequest;

    const otpData = await otpSchema.findOne({
      value: value.otp,
      customerEmail: value.email,
      expiry: { $gte: Date.now() },
    });

    if (!otpData) {
      return res.badRequest({ message: getLanguage('en').otpExpired });
    }

    await adminSchema.updateOne({ _id: value.adminId }, { $set: value });

    return res.ok({
      message: getLanguage('en').dataUpdatedSuccessfully,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const sendEmailOrMobileOtp = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      email: string;
      contactNumber: number;
      countryCode: string;
      personType: PERSON_TYPE;
    }>(req.body, otpVerifyValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const otp = generateIntRandomNo(111111, 999999);

    // await emailOrMobileOtp(
    //   value.email,
    //   `This is your otp for registration ${otp}`,
    // );

    await otpSchema.updateOne(
      {
        value: otp,
        customerEmail: value.email,
        customerMobile: value.contactNumber,
      },
      {
        value: otp,
        customerEmail: value.email,
        customerMobile: value.contactNumber,
        action: value.personType,
        expiry: Date.now() + 600000,
      },
      { upsert: true },
    );

    return res.ok({
      message: getLanguage('en').otpSentSuccess,
      data: { otp },
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const profileUpdate = async (req: RequestParams, res: Response) => {
  try {
    const adminData = await adminSchema.findOne({ _id: req.id });
    if (adminData) {
      const id = adminData._id;
      req.body.email = req.body.email.trim();
      req.body.name = req.body.name.trim();
      req.body.countryCode = req.body.countryCode.trim();

      await adminSchema.updateOne({ _id: id }, { $set: req.body });
    } else {
      return res.badRequest({
        message: getLanguage('en').invalidToken,
      });
    }
    return res.ok({
      message: getLanguage('en').dataUpdatedSuccessfully,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const renewToken = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      refreshToken: string;
    }>(req.body, renewTokenValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const data = verify(
      value.refreshToken,
      process.env.REFRESH_SECRET_KEY,
    ) as JwtPayload;

    if (!data?.accessToken) {
      return res.badRequest({ message: getLanguage('en').invalidToken });
    }

    const adminVerify = await adminSchema.findById(data.id);

    if (!adminVerify) {
      return res.badRequest({ message: getLanguage('en').invalidToken });
    }
    await authTokenSchema.deleteMany({ adminId: adminVerify._id });

    const { accessToken, refreshToken } = createAuthTokens(adminVerify._id);

    await authTokenSchema.create({
      adminId: adminVerify._id,
      accessToken: data.accessToken,
      refreshToken: value.refreshToken,
    });
    return res.ok({
      message: getLanguage('en').renewTokenSuccessfully,
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    console.log(error);

    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const logout = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      refreshToken: string;
      personType: PERSON_TYPE;
    }>(req.body, renewTokenValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const data = verify(
      value.refreshToken,
      process.env.REFRESH_SECRET_KEY,
    ) as JwtPayload;

    if (!data?.accessToken) {
      return res.badRequest({ message: getLanguage('en').invalidToken });
    }

    const adminVerify = await adminSchema.findById(data.id);

    if (!adminVerify) {
      return res.badRequest({ message: getLanguage('en').invalidToken });
    }

    const checkTokenExist = await authTokenSchema.findOne({
      accessToken: data.accessToken,
      refreshToken: value.refreshToken,
      isActive: false,
    });

    if (checkTokenExist) {
      return res.badRequest({ message: getLanguage('en').invalidToken });
    }

    return res.ok({
      message: getLanguage('en').logoutSuccessfully,
    });
  } catch (error) {
    console.log(error);

    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getOrderCounts = async (req: RequestParams, res: Response) => {
  try {
    const totalOrders = await orderSchema.countDocuments();

    const createdOrders = await orderHistorySchema.countDocuments({
      status: 'CREATED',
    });
    const assignedOrders = await orderHistorySchema.countDocuments({
      status: 'ASSIGNED',
    });
    const acceptedOrders = await orderAssignSchema.countDocuments({
      status: 'ACCEPTED',
    });
    const arrivedOrders = await orderHistorySchema.countDocuments({
      status: 'ARRIVED',
    });
    const pickedOrders = await orderHistorySchema.countDocuments({
      status: 'PICKED_UP',
    });
    const departedOrders = await orderHistorySchema.countDocuments({
      status: 'DEPARTED',
    });
    const deliveredOrders = await orderHistorySchema.countDocuments({
      status: 'DELIVERED',
    });
    const cancelledOrders = await orderHistorySchema.countDocuments({
      status: 'CANCELLED',
    });
    const deliveryMan = await deliveryManSchema.countDocuments();

    const merchantCount = await merchantSchema.aggregate([
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
      message: getLanguage('en').countedData,
      data: totalCounts,
    });
  } catch (error) {
    console.log(error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getAllNotifications = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const userId = req.id;
    console.log(req.id);

    // Get all notifications for the user
    const notifications = await Notifications.find({ userId })
      .sort({ createdAt: -1 })
      .populate('orderId')
      .populate('senderId');

    return res.status(200).json({
      message: 'Notifications retrieved successfully',
      data: notifications,
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    return res.status(500).json({
      message: 'There was an error retrieving notifications',
    });
  }
};

export const markNotificationAsRead = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const { notificationId } = req.params;
    const userId = req.id;

    const notification = await Notifications.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({
        message: 'Notification not found',
      });
    }

    return res.status(200).json({
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({
      message: 'There was an error updating the notification',
    });
  }
};

export const markAllNotificationsAsRead = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const userId = req.id;

    await Notifications.updateMany({ userId, isRead: false }, { isRead: true });

    return res.status(200).json({
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return res.status(500).json({
      message: 'There was an error updating notifications',
    });
  }
};

export const deleteNotification = async (req: RequestParams, res: Response) => {
  try {
    const { notificationId } = req.params;
    const userId = req.id;
    console.log(req.id);

    const deletedNotification = await Notifications.findOneAndDelete({
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
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({
      message: 'There was an error deleting the notification',
    });
  }
};

export const getUnreadNotificationCount = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    const userId = req.id;

    const count = await Notifications.countDocuments({
      userId,
      isRead: false,
    });

    return res.status(200).json({
      message: 'Unread notification count retrieved successfully',
      data: { count },
    });
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    return res.status(500).json({
      message: 'There was an error retrieving unread notification count',
    });
  }
};

export const getAdminProfile = async (req: RequestParams, res: Response) => {
  console.log('req', req.id);
  try {
    const adminData = await adminSchema.findOne({ _id: req.id });
    return res.ok({
      data: adminData,
    });
  } catch (error) {
    console.log(error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getSupportTicket = async (req: RequestParams, res: Response) => {
  try {
    console.log('Request body:', req.body);
    const id = req.id;
    const data = await SupportTicket.find({ adminId: id })
      .populate('userid', 'firstName lastName email -_id')
      .select('-messages');

    console.log('data', data);
    return res.status(200).json({
      message: 'Support ticket get successfully',
      data: data,
    });
  } catch (error) {
    console.error('Error get support ticket:', error);
    return res.status(500).json({
      message: 'There was an error get the support ticket',
    });
  }
};

export const sendEmailFor = async (req: RequestParams, res: Response) => {
  try {
    console.log('FDksdjgdfgsdjsgb');

    const validateRequest = validateParamsWithJoi<{
      email: string;
      contactNumber: number;
      countryCode: string;
      subject: string;
      messageSend: string;
      personType: PERSON_TYPE;
    }>(req.body, otpVerifyValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }
    const { value } = validateRequest;

    let userExist;

    const isCustomer = value.personType === PERSON_TYPE.CUSTOMER;

    if (isCustomer) {
      userExist = await merchantSchema.findOne({
        email: value.email,
        contactNumber: value.contactNumber,
        countryCode: value.countryCode,
      });
    } else {
      userExist = await deliveryManSchema.findOne({
        email: value.email,
        contactNumber: value.contactNumber,
        countryCode: value.countryCode,
      });
    }

    if (userExist) {
      return res.badRequest({
        message: getLanguage('en').emailRegisteredAlready,
      });
    }

    // const otp = generateIntRandomNo(111111, 999999);

    await emailSend(value.email, value.subject, `${value.messageSend}`);

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
      message: getLanguage('en').EmailSentSuccess,
      // data: { otp },
    });
  } catch (error) {
    console.log(error);
    return res.failureResponse({
      error: error,
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getAllTickets = async (req: RequestParams, res: Response) => {
  try {
    const tickets = await SupportTicket.find({}, 'userid'); // Return only merchantName and _id
    console.log(tickets, 'tickets');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tickets' });
  }
};

// Fetch messages for a specific ticket
export const getMessagesByTicketId = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    console.log(req.params.id, 'fddfdf');
    const ticket = await messagesSchema.find({
      SupportTicketId: req.params.id,
    });
    console.log(ticket, 'ticket');
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

export const Messageupdate = async (req: RequestParams, res: Response) => {
  try {
    const { supportTicketId, messageId } = req.params;
    const { nowmessage } = req.body;
    console.log(supportTicketId, messageId, 'supportTicketId, messageId');
    const ticket = await messagesSchema.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(messageId),
        SupportTicketId: new mongoose.Types.ObjectId(supportTicketId),
      },
      { text: nowmessage },
      { new: true },
    );

    const newmessages = await messagesSchema.find({
      SupportTicketId: new mongoose.Types.ObjectId(supportTicketId),
    });

    io.to(supportTicketId).emit('messageRead', {
      ticketId: supportTicketId,
      update: newmessages,
    });
    res.status(200).json({ message: 'Message updated successfully' });
  } catch (error) {
    console.log(error, 'error');
    res.status(500).json({ message: 'Failed to update message' });
  }
};

export const Messageread = async (req: RequestParams, res: Response) => {
  try {
    const { supportTicketId } = req.params;
    const ticket = await SupportTicket.findById(supportTicketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    await messagesSchema.updateMany(
      {
        SupportTicketId: new mongoose.Types.ObjectId(supportTicketId),
        sender: 'merchant',
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    const newmessages = await messagesSchema.find({
      SupportTicketId: new mongoose.Types.ObjectId(supportTicketId),
    });

    io.to(supportTicketId).emit('messageRead', {
      ticketId: supportTicketId,
      update: newmessages,
    });
    io.to(supportTicketId).emit('Messagedataupdate', {
      unreadMessages: await unreadMessages(
        ticket.userid.toString(),
        'merchant',
      ),
    });

    res.status(200).json({ message: 'Message read successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to read message' });
  }
};

export const MessageDelete = async (req: RequestParams, res: Response) => {
  try {
    const { supportTicketId, messageId } = req.params;
    console.log(supportTicketId, messageId, 'supportTicketId, messageId');
    const ticket = await messagesSchema.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(messageId),
      SupportTicketId: new mongoose.Types.ObjectId(supportTicketId),
    });

    const newmessages = await messagesSchema.find({
      SupportTicketId: new mongoose.Types.ObjectId(supportTicketId),
    });

    io.to(supportTicketId).emit('messageDelete', {
      ticketId: supportTicketId,
      update: newmessages,
    });
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.log(error, 'error');
    res.status(500).json({ message: 'Failed to delete message' });
  }
};

// full url is https://create-courier-8.onrender.com/admin/auth/unreadMessages/66f000000000000000000000
export const getunreadMessages = async (req: RequestParams, res: Response) => {
  try {
    const result = await unreadMessages(undefined, 'merchant');

    if ('error' in result) {
      return res.status(404).json({ message: result.error });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch unread messages' });
  }
};
// Add a new message to a specific ticket
export const addMessageToTicket = async (req: RequestParams, res: Response) => {
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
    if (!text && !file?.data) {
      return res
        .status(400)
        .json({ message: 'Either text or file data is required' });
    }

    // Verify ticket exists
    const ticket = await SupportTicket.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(ticketId),
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
    const messageData: any = {
      text,
      sender,
      SupportTicketId: ticketId, // Ensure SupportTicketId is included
      timestamp: new Date(),
    };

    // Handle file attachment if present
    if (file?.data) {
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
        const extension =
          Object.entries(supportedTypes).find(([_, mimes]) =>
            mimes.includes(mimeType),
          )?.[0] || 'png';

        messageData.file = {
          data: await getimgurl(file.data, extension),
          name: file?.name,
          type: file?.type,
          extension: extension,
        };
        messageData.fileType = extension;
      }
    }

    console.log(messageData, 'messageData');

    // Create and save the message
    const message = await messagesSchema.create(messageData);

    // Emit socket events
    io.to(ticketId).emit('SupportTicketssendMessage', {
      ...message.toObject(),
      ticketId: ticketId,
    });

    io.to(ticketId).emit('Messagedataupdate', {
      unreadMessages: await unreadMessages(
        ticket[0].userid.toString(),
        'admin',
      ),
    });

    // Return all messages for the ticket
    const messages = await messagesSchema.find({ SupportTicketId: ticketId });
    res.json(messages);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ message: 'Failed to add message' });
  }
};

export const deleteMessageFromTicket = async (
  req: RequestParams,
  res: Response,
) => {
  try {
    console.log('Gfgeguefg');

    const { ticketId, messageId } = req.params;

    // Find the ticket by ID
    const ticket = await messagesSchema.findOneAndDelete({
      _id: messageId,
      SupportTicketId: ticketId,
    });

    // Emit the message deletion event via socket
    io.to(ticketId).emit('messageDeleted', { messageId });

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete message' });
  }
};

export const sendOtp = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<{ email: string }>(
      req.body,
      sendOtpValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    // Check if the user exists
    const user = await adminSchema.findOne({ email: value.email });

    if (!user) {
      return res.badRequest({ message: getLanguage('en').emailNotRegistered });
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await emailOrMobileOtp(
      value.email,
      `This is your otp for Reset Password ${otp}`,
    );
    await otpSchema.create({
      value: otp,
      customerEmail: value.email,
      expiry: otpExpiry,
    });

    // Send OTP (mock or use an actual email/SMS service)
    console.log(`OTP for ${value.email}: ${otp}`);

    return res.ok({ message: getLanguage('en').otpSent });
  } catch (error) {
    console.error('Error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const verifyOtp = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<{ otp: number }>(
      req.body,
      verifyOtpValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    // Validate OTP
    const otpData = await otpSchema.findOne({
      value: value.otp,
      expiry: { $gte: Date.now() },
    });

    if (!otpData) {
      return res.badRequest({ message: getLanguage('en').otpExpired });
    }

    // Optionally, mark OTP as used or delete it
    await otpSchema.deleteOne({ _id: otpData._id });

    return res.ok({ message: getLanguage('en').otpVerified });
  } catch (error) {
    console.error('Error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const resetPassword = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      email: string;
      newPassword: string;
    }>(req.body, resetPasswordValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    // Check if the user exists
    const user = await adminSchema.findOne({ email: value.email });

    if (!user) {
      return res.badRequest({ message: getLanguage('en').emailNotRegistered });
    }

    // Encrypt the new password
    const encryptedPassword = await encryptPassword({
      password: value.newPassword,
    });

    // Update the user's password
    await adminSchema.updateOne(
      { email: value.email },
      { $set: { password: encryptedPassword } },
    );

    return res.ok({ message: getLanguage('en').passwordResetSuccess });
  } catch (error) {
    console.error('Error:', error);
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};
