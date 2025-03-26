import { DeviceToken } from "../models/deviceToken.model";
import { User } from "../models/user.model";
import { IDeviceToken, IUsers } from "../types/user";

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