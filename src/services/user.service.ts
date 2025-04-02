import { Admin } from "../models/admin.mode";
import { DeviceToken } from "../models/deviceToken.model";
import { User } from "../models/user.model";
import { IDeviceToken, IUsers } from "../types/user";
import mongoose from "mongoose";

export const getUserByNumber = async (number: number) => {
    try {
        const result = await User.find({ mobileNumber: number });
        return result;
    } catch (e) {
        throw e;
    }
}

export const insertRegisterUserData = async (bodyData: IUsers) => {
    try {
        const newUser = new User(bodyData);
        await newUser.save();
        return newUser._id;
    } catch (e) {
        throw e;
    }
}

export const insertDeviceTokenData = async (data: IDeviceToken) => {
    try {
        const newDeviceToken = new DeviceToken(data);
        await newDeviceToken.save();
        return;
    } catch (e) {
        throw e;
    }
}

export const getAdminByEmail = async (email: string) => {
    try {
        const result = await Admin.find({ email: email });
        return result;
    } catch (e) {
        throw e;
    }
}

export const updateUserData = async (bodyData: IUsers) => {
    try {
        const documentId = new mongoose.Types.ObjectId(bodyData?._id?.toString());
        const result = await User.findByIdAndUpdate(documentId, bodyData, {
            new: true,
            runValidators: true
        });
        return result;
    } catch (e) {
        throw e;
    }
}

export const getUserDataById = async (userId: string) => {
    try {
        const documentId = new mongoose.Types.ObjectId(userId);
        const result = await User.findOne({ _id: documentId });
        return result?.toObject();
    } catch (e) {
        throw e;
    }
}

export const getAllUserData = async () => {
    try {
        const result = await User.find();
        return result;
    } catch (e) {
        throw e;
    }
}

export const deleteUserData = async (userId: string) => {
    try {
        const documentId = new mongoose.Types.ObjectId(userId);
        await User.findByIdAndDelete({ _id: documentId });
        return;
    } catch (e) {
        throw e;
    }
}

export const updateUserDataStatus = async (bodyData: IUsers) => {
    try {
        const documentId = new mongoose.Types.ObjectId(bodyData?._id?.toString());
        await User.findByIdAndUpdate(
            { _id: documentId}, 
            { $set: {
                isActive: bodyData?.isActive
            }},
            { upsert: true }
        );
        return;
    } catch (e) {
        throw e;
    }
}

export const deleteDeviceTokenData = async (token: string) => {
    try {
        await DeviceToken.deleteOne({ token: token });
        return;
    } catch (err) {
        throw err;
    }
}