import { INotification } from "../types/notification";
import { Notification } from "../models/notification.model";
import mongoose from "mongoose";

export const insertNotificationData = async (data: INotification) => {
    try {
        const newData = new Notification(data);
        await newData.save();
        return;
    } catch (err) {
        throw err;
    }
}

export const getNotificationData = async (userId: string) => {
    try {
        const result = await Notification.find({userId: userId});
        return result;
    } catch (err) {
        throw err;
    }
}

export const getNotificationCountData = async (userId: string) => {
    try {
        const result = await Notification.countDocuments({userId: userId, isRead: false});
        return result
    } catch (err) {
        throw err;
    }
}

export const updateNotificationStatusData = async (notificationId: string, status: boolean) => {
    try {
        const documentId = new mongoose.Types.ObjectId(notificationId?.toString());
        await Notification.updateOne(
            { _id: documentId}, 
            { $set: {
                isRead: status
            }},
            { upsert: true }
        );
        return;
    } catch (err) {
        throw err;
    }
}