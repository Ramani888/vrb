import { DeliveryAddress } from "../models/deliveryAddress.model";
import mongoose from "mongoose";
import { IDeliveryAddress, ITrackingDetails, IUnloadingDetails } from "../types/order";
import { TrackingDetails } from "../models/trackingDetails.model";
import { Order } from "../models/order.model";
import { UnloadingDetails } from "../models/unloadingDetails.model";

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

export const addTrackingData = async (data: ITrackingDetails) => {
    try {
        const newData = new TrackingDetails(data);
        await newData.save();
        return;
    } catch (e) {
        throw e;
    }
}

export const updateOrderStatusData = async (orderId: string, status: string) => {
    try {
        const documentId = new mongoose.Types.ObjectId(orderId);
        await Order.updateOne(
            { _id: documentId}, 
            { $set: {
                status: status,
            }},
            { upsert: true }
        );
        return;
    } catch (e) {
        throw e;
    }
}

export const updateTrackingDetail = async (bodyData: ITrackingDetails) => {
    try {
        const documentId = new mongoose.Types.ObjectId(bodyData?._id?.toString());
        const result = await TrackingDetails?.findByIdAndUpdate(documentId, bodyData, {
            new: true,
            runValidators: true
        });
        return result;
    } catch (e) {
        throw e;
    }
}

export const insertUnloadingData = async (data: IUnloadingDetails) => {
    try {
        const newData = new UnloadingDetails(data);
        await newData.save();
    } catch (e) {
        throw e;
    }
}