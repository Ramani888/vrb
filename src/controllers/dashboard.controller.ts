import { AuthorizedRequest } from "../types/user";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { getDashboardData } from "../services/dashboard.service";

export const getDashboard = async (req: AuthorizedRequest, res: Response) => {
    try {
        const data = await getDashboardData();
        return res.status(StatusCodes.OK).send({ data });
    } catch (err) { 
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}