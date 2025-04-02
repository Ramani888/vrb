import { AuthorizedRequest } from "../types/user";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { addDeliveryAddressData, deleteDeliveryAddressData, getDeliveryAddressByUserId, updateDeliveryAddressData } from "../services/order.service";

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