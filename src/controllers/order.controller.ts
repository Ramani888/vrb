import { AuthorizedRequest } from "../types/user";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { addDeliveryAddressData, addTrackingData, deleteDeliveryAddressData, getDeliveryAddressByUserId, updateDeliveryAddressData, updateOrderStatusData, updateTrackingDetail } from "../services/order.service";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import dotenv from "dotenv"
import { initializeApp } from "firebase/app";
import config from "../config/firbase.config";

dotenv.config();

const firebaseApp = initializeApp(config.firebaseConfig);
const storage = getStorage();

export const addDeliveryAddress = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;

    try {
        const isAddressExist = await getDeliveryAddressByUserId(bodyData?.userId);
        if (isAddressExist.length > 0) {
            await deleteDeliveryAddressData(isAddressExist[0]?._id?.toString());
        }
        await addDeliveryAddressData({...bodyData})
        res.status(StatusCodes.OK).send({ success: true, message: "Delivery address added successfully." });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const deleteDeliveryAddress = async (req: AuthorizedRequest, res: Response) => {
    const { id } = req.query;

    try {
        await deleteDeliveryAddressData(id);
        return res.status(StatusCodes.OK).send({ success: true, message: "Delivery address data deleted." });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const updateDeliveryAddress = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;

    try {
        await updateDeliveryAddressData(bodyData)
        res.status(StatusCodes.OK).send({ success: true, message: "Delivery address data updated."});
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getDeliveryAddress = async (req: AuthorizedRequest, res: Response) => {
    const { userId } = req.query;

    try {
        const deliveryAddressData = await getDeliveryAddressByUserId(userId);
        return res.status(StatusCodes.OK).send({ deliveryAddressData });
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ e });
    }
}

export const addTracking = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;
    try {
        await addTrackingData({...bodyData});
        await updateOrderStatusData(bodyData?.orderId, 'Shipped');
        res.status(StatusCodes.OK).send({ success: true, message: "Tracking detail inserted." });
    } catch (error) {
        console.error('Error:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
}

export const updateTracking = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;

    try {
        if (bodyData?.deleteVideo) {
            const fileRef = ref(storage, bodyData?.deleteVideo);
            await deleteObject(fileRef);
        }

        await updateTrackingDetail({...bodyData});
        res.status(StatusCodes.OK).send({ success: true, message: "Tracking data updated." });
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ e });
    }
}