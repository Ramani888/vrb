import { INotification } from "../types/notification";
import { Notification } from "../models/notification.model";

export const insertNotificationData = async (data: INotification) => {
    try {
        const newData = new Notification(data);
        await newData.save();
        return;
    } catch (err) {
        throw err;
    }
}