import { Banner } from "../models/banner.model";
import { IBanner } from "../types/banner";
import mongoose from "mongoose";

export const addBannerData = async (data: IBanner) => {
    try {
        const newData = new Banner(data);
        await newData.save();
        return;
    } catch (err) {
        throw err;
    }
}

export const getBannerDataById = async (bannerId: string) => {
    const objectId = new mongoose.Types.ObjectId(bannerId);
    try {
        const result = await Banner.find({_id: objectId});
        return result;
    } catch (err) {
        throw err;
    }
}

export const updateBannerData = async (bodyData: IBanner) => {
    try {
        const documentId = new mongoose.Types.ObjectId(bodyData?._id?.toString());
        const result = await Banner.findByIdAndUpdate(documentId, bodyData, {
            new: true,
            runValidators: true
        });
        return result;
    } catch (err) {
        throw err;
    }
}

export const getAllBannerData = async () => {
    try {
        const result = await Banner.find();
        return result;
    } catch (err) {
        throw err;
    }
}

export const deleteBannerData = async (bannerId: string) => {
    try {
        const documentId = new mongoose.Types.ObjectId(bannerId);
        await Banner.findByIdAndDelete({ _id: documentId });
        return;
    } catch (err) {
        throw err;
    }
}