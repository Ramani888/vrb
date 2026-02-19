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
exports.insertDeviceToken = exports.updateNotificationStatus = exports.getNotificationCount = exports.getNotification = exports.pushNotification = exports.veryfyToken = exports.sendPushNotification = exports.sendBulkPushNotification = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_service_1 = require("../services/user.service");
const aws_config_1 = __importDefault(require("../config/aws.config"));
const deviceToken_model_1 = require("../models/deviceToken.model");
const notification_service_1 = require("../services/notification.service");
const sendBulkPushNotification = (tokenData, bodyData) => __awaiter(void 0, void 0, void 0, function* () {
    tokenData.forEach((token) => __awaiter(void 0, void 0, void 0, function* () {
        if (token) {
            yield (0, exports.sendPushNotification)(token, bodyData);
        }
    }));
});
exports.sendBulkPushNotification = sendBulkPushNotification;
const sendPushNotification = (token, bodyData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!aws_config_1.default) {
        console.error('Firebase Admin is not initialized');
        return;
    }
    const payload = {
        notification: {
            title: bodyData === null || bodyData === void 0 ? void 0 : bodyData.title,
            body: bodyData === null || bodyData === void 0 ? void 0 : bodyData.body,
            imageUrl: bodyData === null || bodyData === void 0 ? void 0 : bodyData.imageUrl
        },
        token: token
    };
    try {
        const isTokenValid = yield (0, exports.veryfyToken)(token);
        if (isTokenValid) {
            // Send message to validated token
            const result = yield aws_config_1.default.messaging().send(payload);
            console.log(result);
        }
        else {
            console.log("Invalid Token");
            yield (0, user_service_1.deleteDeviceTokenData)(token);
            // await callAnotherService(token); // Call another service when the token is invalid
        }
    }
    catch (error) {
        console.log("Error verifying token:", error);
    }
});
exports.sendPushNotification = sendPushNotification;
const veryfyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!aws_config_1.default) {
        throw new Error('Firebase Admin is not initialized');
    }
    return aws_config_1.default.messaging().send({
        token: token
    }, true);
});
exports.veryfyToken = veryfyToken;
const pushNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyData = req.body;
    try {
        try {
            const tokens = yield deviceToken_model_1.DeviceToken.find().select('token');
            const tokenData = tokens === null || tokens === void 0 ? void 0 : tokens.map((data) => data === null || data === void 0 ? void 0 : data.token);
            const userIds = tokens === null || tokens === void 0 ? void 0 : tokens.map((data) => data === null || data === void 0 ? void 0 : data.userId);
            userIds === null || userIds === void 0 ? void 0 : userIds.map((userId) => __awaiter(void 0, void 0, void 0, function* () {
                const notificationData = {
                    title: bodyData === null || bodyData === void 0 ? void 0 : bodyData.title,
                    subTitle: bodyData === null || bodyData === void 0 ? void 0 : bodyData.body,
                    imageUrl: bodyData === null || bodyData === void 0 ? void 0 : bodyData.imageUrl,
                    userId: userId
                };
                yield (0, notification_service_1.insertNotificationData)(notificationData);
            }));
            yield (0, exports.sendBulkPushNotification)(tokenData, bodyData);
            return res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: 'Notification send successfully.' });
        }
        catch (error) {
            console.error('Error fetching tokens from database:', error);
        }
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.pushNotification = pushNotification;
const getNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        const data = yield (0, notification_service_1.getNotificationData)(userId);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getNotification = getNotification;
const getNotificationCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        const data = yield (0, notification_service_1.getNotificationCountData)(userId);
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getNotificationCount = getNotificationCount;
const updateNotificationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { notificationId, status } = req.query;
    try {
        yield (0, notification_service_1.updateNotificationStatusData)(notificationId, status);
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: 'Notification status update.' });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.updateNotificationStatus = updateNotificationStatus;
const insertDeviceToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyData = req.body;
    try {
        const data = yield (0, user_service_1.insertDeviceTokenData)(bodyData);
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.insertDeviceToken = insertDeviceToken;
