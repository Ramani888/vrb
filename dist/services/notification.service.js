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
exports.updateNotificationStatusData = exports.getNotificationCountData = exports.getNotificationData = exports.insertNotificationData = void 0;
const notification_model_1 = require("../models/notification.model");
const mongoose_1 = __importDefault(require("mongoose"));
const insertNotificationData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newData = new notification_model_1.Notification(data);
        yield newData.save();
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.insertNotificationData = insertNotificationData;
const getNotificationData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield notification_model_1.Notification.find({ userId: userId });
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getNotificationData = getNotificationData;
const getNotificationCountData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield notification_model_1.Notification.countDocuments({ userId: userId, isRead: false });
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getNotificationCountData = getNotificationCountData;
const updateNotificationStatusData = (notificationId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documentId = new mongoose_1.default.Types.ObjectId(notificationId === null || notificationId === void 0 ? void 0 : notificationId.toString());
        yield notification_model_1.Notification.updateOne({ _id: documentId }, { $set: {
                isRead: status
            } }, { upsert: true });
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.updateNotificationStatusData = updateNotificationStatusData;
