import { AdsPoster } from "../models/adsPoster.model";
import { IAdsPoster } from "../types/adsPoster";
import mongoose from "mongoose";

export const addAdsPosterData = async (data: IAdsPoster) => {
    try {
        const newData = new AdsPoster(data);
        await newData.save();
        return;
    } catch (err) {
        throw err;
    }
}

export const getAdsPosterDataById = async (adsPosterId: string) => {
    const objectId = new mongoose.Types.ObjectId(adsPosterId);
    try {
        const result = await AdsPoster.find({_id: objectId});
        return result;
    } catch (err) {
        throw err;
    }
}

export const updateAdsPosterData = async (data: IAdsPoster) => {
    try {
        const documentId = new mongoose.Types.ObjectId(data?._id?.toString());
        const result = await AdsPoster.findByIdAndUpdate(documentId, data, {
            new: true,
            runValidators: true
        });
        return result;
    } catch (err) {
        throw err;
    }
}

export const getAllAdsPosterData = async () => {
    try {
        const result = await AdsPoster.find();
        return result;
    } catch (err) {
        throw err;
    }
}

export const deleteAdsPosterData = async (adsPosterId: string) => {
    try {
        const documentId = new mongoose.Types.ObjectId(adsPosterId);
        await AdsPoster.findByIdAndDelete({ _id: documentId });
        return;
    } catch (err) {
        throw err;
    }
}