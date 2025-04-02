import { DeliveryAddress } from "../models/deliveryAddress.model";
import mongoose from "mongoose";
import { IDeliveryAddress } from "../types/order";

export const getDeliveryAddressByUserId = async (userId: string) => {
    try {
        const result = await DeliveryAddress.find({ userId: userId });
        return result;
    } catch (e) {
        throw e;
    }
}

export const deleteDeliveryAddressData = async (id: string) => {
    try {
        const documentId = new mongoose.Types.ObjectId(id);
        await DeliveryAddress.deleteOne({ _id: documentId });
        return;
    } catch (e) {
        throw e;
    }
}

export const addDeliveryAddressData = async (bodyData: IDeliveryAddress) => {
    try {
        const newData = new DeliveryAddress(bodyData);
        await newData.save();
    } catch (e) {
        throw e;
    }
}

export const updateDeliveryAddressData = async (bodyData: IDeliveryAddress) => {
    try {
        const documentId = new mongoose.Types.ObjectId(bodyData?._id?.toString());
        const result = await DeliveryAddress.findByIdAndUpdate(documentId, bodyData, {
            new: true,
            runValidators: true
        });
        return result;
    } catch (e) {
        throw e;
    }
}