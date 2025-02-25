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
exports.getMongoCommonPagination = exports.updateWallet = exports.emailSend = exports.emailOrMobileOtp = exports.createAuthTokens = exports.removeUploadedFile = exports.createNotification = exports.uploadFile = exports.generateIntRandomNo = exports.encryptPassword = exports.passwordValidation = exports.sendMailService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const enum_1 = require("../enum");
const admin_schema_1 = __importDefault(require("../models/admin.schema"));
const adminSettings_schema_1 = __importDefault(require("../models/adminSettings.schema"));
const deliveryMan_schema_1 = __importDefault(require("../models/deliveryMan.schema"));
const user_schema_1 = __importDefault(require("../models/user.schema"));
const wallet_schema_1 = __importDefault(require("../models/wallet.schema"));
const notificatio_schema_1 = __importDefault(require("../models/notificatio.schema"));
const sendMailService = (to, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_PASSWORD,
        },
    });
    try {
        yield transporter.verify();
        console.log('SMTP server is ready to take messages');
    }
    catch (error) {
        console.error('SMTP connection error:', error);
        throw new Error('Failed to connect to SMTP server');
    }
    try {
        const info = yield transporter.sendMail({
            from: process.env.APP_EMAIL,
            to,
            subject,
            text,
        });
        console.log('Email sent: %s', info.messageId);
        return info;
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
});
exports.sendMailService = sendMailService;
const passwordValidation = (password, hashPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.compare(password, hashPassword);
});
exports.passwordValidation = passwordValidation;
const encryptPassword = (_a) => __awaiter(void 0, [_a], void 0, function* ({ password }) {
    const createHash = yield bcrypt_1.default.hash(password, 10);
    return createHash;
});
exports.encryptPassword = encryptPassword;
const generateIntRandomNo = (start = 1, end = 11) => (0, crypto_1.randomInt)(start, end);
exports.generateIntRandomNo = generateIntRandomNo;
const uploadFile = (fileName, base64FormatImage, fileType) => {
    return new Promise((resolve, reject) => {
        try {
            const extension = fileName.split(':')[1].split(';')[0].split('/')[1];
            const filePath = `uploads/${Date.now()}-${fileType}.${extension}`;
            fs_1.default.writeFileSync(filePath, Buffer.from(base64FormatImage, 'base64'));
            resolve(filePath);
        }
        catch (error) {
            reject(new Error('Something went wrong with uploading file'));
        }
    });
};
exports.uploadFile = uploadFile;
const createNotification = (_b) => __awaiter(void 0, [_b], void 0, function* ({ userId, subOrderId, title, message, type, orderId, senderId, adminId, }) {
    try {
        const notification = yield notificatio_schema_1.default.create({
            userId,
            subOrderId,
            title,
            message,
            type,
            orderId,
            senderId,
            isRead: false,
            adminId,
        });
        return notification;
    }
    catch (error) {
        console.error('Error creating notification:', error);
        throw new Error('Failed to create notification');
    }
});
exports.createNotification = createNotification;
const removeUploadedFile = (fileName) => {
    try {
        fs_1.default.unlinkSync(fileName);
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.removeUploadedFile = removeUploadedFile;
const createAuthTokens = (id) => {
    const accessToken = jsonwebtoken_1.default.sign({ id }, process.env.ACCESS_SECRET_KEY, { expiresIn: +process.env.JWT_EXPIRY });
    const refreshToken = jsonwebtoken_1.default.sign({ id, accessToken }, process.env.REFRESH_SECRET_KEY, { expiresIn: +process.env.JWT_REFRESH_EXPIRY });
    return { accessToken, refreshToken };
};
exports.createAuthTokens = createAuthTokens;
const emailOrMobileOtp = (email, message) => __awaiter(void 0, void 0, void 0, function* () {
    // if (process.env.ENV !== 'DEV') {
    const adminEmailOptionCheck = yield adminSettings_schema_1.default.findOne();
    if (adminEmailOptionCheck.emailVerify) {
        yield (0, exports.sendMailService)(email, 'Email Otp Verification Mail', message);
    }
    if (adminEmailOptionCheck.mobileNumberVerify) {
        // TODO: Third party integration sms service for otp sent to mobile
    }
    // }
});
exports.emailOrMobileOtp = emailOrMobileOtp;
const emailSend = (email, subject, message) => __awaiter(void 0, void 0, void 0, function* () {
    // if (process.env.ENV !== 'DEV') {
    const adminEmailOptionCheck = yield adminSettings_schema_1.default.findOne();
    if (adminEmailOptionCheck.emailVerify) {
        yield (0, exports.sendMailService)(email, subject, message);
    }
    if (adminEmailOptionCheck.mobileNumberVerify) {
        // TODO: Third party integration sms service for otp sent to mobile
    }
    // }
});
exports.emailSend = emailSend;
const updateWallet = (amount_1, adminId_1, personId_1, transactionType_1, transactionMessage_1, ...args_1) => __awaiter(void 0, [amount_1, adminId_1, personId_1, transactionType_1, transactionMessage_1, ...args_1], void 0, function* (amount, adminId, personId, transactionType, transactionMessage, isCustomer = true) {
    const isDeposit = transactionType === enum_1.TRANSACTION_TYPE.DEPOSIT;
    const userBalance = isDeposit ? amount : -amount;
    const adminBalance = isDeposit ? -amount : amount;
    let personData;
    if (isCustomer) {
        personData = yield user_schema_1.default.findOneAndUpdate({ _id: personId }, { $inc: { balance: userBalance } }, { new: true });
    }
    else {
        personData = yield deliveryMan_schema_1.default.findOneAndUpdate({ _id: personId }, { $inc: { balance: userBalance } }, { new: true });
    }
    yield Promise.all([
        wallet_schema_1.default.create({
            personId,
            message: transactionMessage,
            type: transactionType,
            userFlag: isCustomer ? enum_1.PERSON_TYPE.CUSTOMER : enum_1.PERSON_TYPE.DELIVERY_BOY,
            availableBalance: personData.balance,
            amount,
        }),
        admin_schema_1.default.updateOne({ _id: adminId }, { $inc: { balance: adminBalance } }),
    ]);
});
exports.updateWallet = updateWallet;
const getMongoCommonPagination = ({ pageCount, pageLimit, }) => {
    return [
        {
            $facet: {
                count: [
                    {
                        $count: 'totalDataCount',
                    },
                ],
                data: [
                    {
                        $skip: (pageCount - 1) * pageLimit,
                    },
                    {
                        $limit: pageLimit,
                    },
                ],
            },
        },
        {
            $project: {
                totalDataCount: {
                    $ifNull: [
                        {
                            $arrayElemAt: ['$count.totalDataCount', 0],
                        },
                        0,
                    ],
                },
                data: 1,
            },
        },
    ];
};
exports.getMongoCommonPagination = getMongoCommonPagination;
