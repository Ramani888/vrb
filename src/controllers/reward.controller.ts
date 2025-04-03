import { AuthorizedRequest } from "../types/user";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { getRewardData } from "../services/reward.service";

export const getReward = async (req: AuthorizedRequest, res: Response) => {
    const { userId } = req.query;

    try {
        const data = await getRewardData(userId);
        res.status(StatusCodes.OK).send({ data });
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: e });
    }
}