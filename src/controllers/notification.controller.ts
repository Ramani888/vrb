import { AuthorizedRequest } from "../types/user";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { deleteDeviceTokenData, insertDeviceTokenData } from "../services/user.service";
import firebaseAdmin from '../config/aws.config';
import { DeviceToken } from "../models/deviceToken.model";
import { getNotificationCountData, getNotificationData, insertNotificationData, updateNotificationStatusData } from "../services/notification.service";

export const sendBulkPushNotification = async (tokenData: any[], bodyData: any) => {
    tokenData.forEach(async (token: string) => {
        if (token) {
            await sendPushNotification(token, bodyData);
        }
    })
}

export const sendPushNotification = async (token: string, bodyData: any) => {
    if (!firebaseAdmin) {
        console.error('Firebase Admin is not initialized');
        return;
    }

    const payload = {
        notification: {
            title: bodyData?.title,
            body: bodyData?.body,
            imageUrl: bodyData?.imageUrl
        },
        token: token
    };

    try {
        const isTokenValid = await veryfyToken(token);

        if (isTokenValid) {
            // Send message to validated token
            const result = await firebaseAdmin.messaging().send(payload);
            console.log(result);
        } else {
            console.log("Invalid Token");
            await deleteDeviceTokenData(token)
            // await callAnotherService(token); // Call another service when the token is invalid
        }
    } catch (error) {
        console.log("Error verifying token:", error);
    }
};

export const veryfyToken = async (token: string) => {
    if (!firebaseAdmin) {
        throw new Error('Firebase Admin is not initialized');
    }
    return firebaseAdmin.messaging().send({
        token: token
    }, true)
}

export const pushNotification = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;
    try {
        try {
            const tokens = await DeviceToken.find().select('token');

            const tokenData = tokens?.map((data) => data?.token);

            const userIds = tokens?.map((data) => data?.userId);

            userIds?.map(async (userId) => {
                const notificationData = {
                    title: bodyData?.title,
                    subTitle: bodyData?.body,
                    imageUrl: bodyData?.imageUrl,
                    userId: userId
                }
                await insertNotificationData(notificationData);
            })

            await sendBulkPushNotification(tokenData, bodyData);
            return res.status(StatusCodes.OK).send({ success: true, message: 'Notification send successfully.' });
        } catch (error) {
            console.error('Error fetching tokens from database:', error);
        }
           
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getNotification = async (req: AuthorizedRequest, res: Response) => {
    const { userId } = req.query;

    try {
        const data = await getNotificationData(userId);
        return res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getNotificationCount = async (req: AuthorizedRequest, res: Response) => {
    const { userId } = req.query;

    try {
        const data = await getNotificationCountData(userId);
        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const updateNotificationStatus = async (req: AuthorizedRequest, res: Response) => {
    const { notificationId, status } = req.query;

    try {
        await updateNotificationStatusData(notificationId, status);
        res.status(StatusCodes.OK).send({ success: true, message: 'Notification status update.' });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const insertDeviceToken = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;

    try {
        const data = await insertDeviceTokenData(bodyData);
        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}