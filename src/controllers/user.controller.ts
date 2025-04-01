import { deleteUserData, getAdminByEmail, getAllUserData, getUserByNumber, getUserDataById, insertDeviceTokenData, insertRegisterUserData, updateUserData, updateUserDataStatus } from "../services/user.service";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { AuthorizedRequest } from "../types/user";
import { comparePassword, encryptPassword } from "../utils/helpers/auth";
import errors from "../utils/helpers/errors";
import jwt from 'jsonwebtoken';
import { generatePassword } from "../utils/helpers/global";
import { getRewardData } from "../services/reward.service";
const env = process.env;

export const insertRegisterUser = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;

    try {
        const isUserExist = await getUserByNumber(bodyData?.mobileNumber);
        if (isUserExist.length > 0) {
            return res.status(StatusCodes.CONFLICT).send({ error: errors.NUMBER_ALREADY_REGISTER });
        }

        const newPassword = await encryptPassword(bodyData?.password)
        const userId = await insertRegisterUserData({...bodyData, password: newPassword})
        const deviceTokenData = {
            userId: userId?.toString(),
            token: bodyData?.fcm_token
        }
        await insertDeviceTokenData(deviceTokenData)
        res.status(StatusCodes.OK).send({ success: true, message: "User register successful." });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const userLogin = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;
    try {
        const isUserExist = await getUserByNumber(bodyData?.mobileNumber);
        if (isUserExist.length === 0) {
            return res.status(StatusCodes.CONFLICT).send({ error: errors.USER_NOT_FOUND });
        }

        const isPasswordValid = await new Promise((resolve) =>
            comparePassword(bodyData?.password, String(isUserExist[0]?.password))
            .then((result) => resolve(result))
            .catch((error) => resolve(false))
        );

        if (!isUserExist[0]?.isActive) {
            return res.status(StatusCodes.CONFLICT).send({ error: errors.INSUFFICIENT_PERMISSIONS });
        }

        if (isPasswordValid) {
            const SECRET_KEY: any = env.SECRET_KEY;
            const token = jwt.sign({ userId: isUserExist[0]?._id.toString(), username: isUserExist[0]?.name }, SECRET_KEY, { expiresIn: '30d' });

            const userDataAndToken = {
                _id: isUserExist[0]?._id,
                businessType: isUserExist[0]?.businessType,
                name: isUserExist[0]?.name,
                mobileNumber: isUserExist[0]?.mobileNumber,
                email: isUserExist[0]?.email,
                country: isUserExist[0]?.country,
                state: isUserExist[0]?.state,
                city: isUserExist[0]?.city,
                pinCode: isUserExist[0]?.pinCode,
                isActive: isUserExist[0]?.isActive,
                token: token,
            };

            res.json({ userDataAndToken, message: 'User login successful.' });
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).send({ error: errors.PASSWORDS_NOT_MATCH });
        }
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const adminLogin = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;
    try {
        const isAdminExist = await getAdminByEmail(bodyData?.email);
        if (isAdminExist.length === 0) {
            return res.status(StatusCodes.CONFLICT).send({ error: errors.EMAIL_NOT_FOUND });
        }

        if (isAdminExist[0]?.password === bodyData?.password) {
            return res.status(StatusCodes.OK).send({ admin: isAdminExist[0], success: true, message: 'Login successfully' });
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).send({ error: errors.PASSWORDS_NOT_MATCH });
        }
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const userRegisterLogin = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;
    try {
        const isUserExist = await getUserByNumber(bodyData?.mobileNumber);

        if (isUserExist?.length > 0) {
            const SECRET_KEY: any = env.SECRET_KEY;
            const token = jwt.sign({ userId: isUserExist[0]?._id.toString(), username: isUserExist[0]?.name }, SECRET_KEY, { expiresIn: '30d' });

            const userDataAndToken = {
                _id: isUserExist[0]?._id,
                businessType: isUserExist[0]?.businessType,
                name: isUserExist[0]?.name,
                mobileNumber: isUserExist[0]?.mobileNumber,
                email: isUserExist[0]?.email,
                country: isUserExist[0]?.country,
                state: isUserExist[0]?.state,
                city: isUserExist[0]?.city,
                pinCode: isUserExist[0]?.pinCode,
                isActive: isUserExist[0]?.isActive,
                token: token,
            };

            res.json({ userDataAndToken, message: 'User login successful.' });
        } else {
            const password = generatePassword()
            const newPassword = await encryptPassword(password)
            const userId = await insertRegisterUserData({...bodyData, password: newPassword})
            const deviceTokenData = {
                userId: userId?.toString(),
                token: bodyData?.fcm_token
            }
            await insertDeviceTokenData(deviceTokenData)

            const newUser = await getUserByNumber(bodyData?.mobileNumber);

            const SECRET_KEY: any = env.SECRET_KEY;
            const token = jwt.sign({ userId: newUser[0]?._id.toString(), username: newUser[0]?.name }, SECRET_KEY, { expiresIn: '30d' });

            const userDataAndToken = {
                _id: newUser[0]?._id,
                businessType: newUser[0]?.businessType,
                name: newUser[0]?.name,
                mobileNumber: newUser[0]?.mobileNumber,
                email: newUser[0]?.email,
                country: newUser[0]?.country,
                state: newUser[0]?.state,
                city: newUser[0]?.city,
                pinCode: newUser[0]?.pinCode,
                isActive: newUser[0]?.isActive,
                token: token,
            };
            res.json({ userDataAndToken, message: 'User login successful.' });
        }
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const updateUser = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;
    try {
        await updateUserData(bodyData)
        res.status(StatusCodes.OK).send({ success: true, message: "User data updated."});
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getUserById = async (req: AuthorizedRequest, res: Response) => {
    const { userId } = req.query;
    try {
        const data = await getUserDataById(userId);
        return res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getAllUser = async (req: AuthorizedRequest, res: Response) => {
    try {
        const userData = await getAllUserData();

        const finalData = userData?.map(async (item: any) => {
            const rewardData = await getRewardData(item?._id?.toString());
            return {
                ...item?._doc,
                rewardData
            }
        })

        const data = await Promise.all(finalData);

        return res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const deleteUser = async (req: AuthorizedRequest, res: Response) => {
    const { userId } = req.query;
    try {
        await deleteUserData(userId);
        return res.status(StatusCodes.OK).send({ success: true, message: "User data deleted." });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const updateUserStatus = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;
    try {
        await updateUserDataStatus(bodyData);
        return res.status(StatusCodes.OK).send({ success: true, message: "User status updated." });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}