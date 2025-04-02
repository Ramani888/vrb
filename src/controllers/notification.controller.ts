import { AuthorizedRequest } from "../types/user";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { deleteDeviceTokenData } from "../services/user.service";
import firebaseAdmin from '../config/firebase.config';

export const sendBulkPushNotification = async (tokenData: any[], bodyData: any) => {
    tokenData.forEach(async (token: string) => {
        if (token) {
            await sendPushNotification(token, bodyData);
        }
    })
}

export const sendPushNotification = async (token: string, bodyData: any) => {
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
    return firebaseAdmin.messaging().send({
        token: token
    }, true)
}