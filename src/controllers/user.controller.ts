import { getUserByNumber, insertDeviceTokenData, insertRegisterUserData } from "../services/user.service";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { AuthorizedRequest } from "../types/user";
import { encryptPassword } from "../utils/helpers/auth";
import errors from "../utils/helpers/errors";

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