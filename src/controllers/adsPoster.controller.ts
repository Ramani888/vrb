import { AuthorizedRequest } from "../types/user";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import dotenv from "dotenv"
import { addAdsPosterData, deleteAdsPosterData, getAdsPosterDataById, getAllAdsPosterData, updateAdsPosterData } from "../services/adsPoster.service";
import { deleteImageS3, deleteVpsUpload } from "../utils/helpers/global";
dotenv.config();

export const addAdsPoster = async (req: AuthorizedRequest, res: Response) => {
    const file = req.file;

    if (!file) {
        res.status(StatusCodes.BAD_REQUEST).send({ error: 'Image file is missing.' });
        return;
    }

    const posterUrl = `https://vrfashionjewelleary.in/uploads/images/${req.file.filename}`;

    try {
        const data = {
            imagePath: posterUrl
        };

        await addAdsPosterData(data);
        res.status(StatusCodes.OK).send({ success: true, message: 'Ads Poster data inserted.' });
    } catch (error) {
        console.error('Error adding ads poster:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'Failed to insert ads poster data.' });
    }
}

export const updateAdsPoster = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;
    const file = req.file;
    try {
        const adsPosterData = await getAdsPosterDataById(bodyData?._id);

        if (!adsPosterData || adsPosterData.length === 0) {
            res.status(StatusCodes.NOT_FOUND).send({ error: 'Ads poster data not found.' });
            return;
        }

        if (file) {
            const posterUrl = `https://vrfashionjewelleary.in/uploads/images/${req.file.filename}`;

            // Delete Image (if exists)
            const imagePath = adsPosterData[0]?.imagePath ?? ''; // Ensure it's a string
            if (imagePath) {
                await deleteVpsUpload(imagePath);
            }

            // Insert Data
            const dataObject = {
                imagePath: posterUrl,
                _id: bodyData._id
            };
            await updateAdsPosterData(dataObject);
        } else {
            await updateAdsPosterData({ ...bodyData, imagePath: adsPosterData[0]?.imagePath ?? '' });
        }

        res.status(StatusCodes.OK).send({ success: true, message: "Ads Poster data updated." });
    } catch (error) {
        console.error('Error updating ads poster:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'Failed to update ads poster data.' });
    }
}

export const getAllAdsPoster = async (req: AuthorizedRequest, res: Response) => {
    try {
        const data = await getAllAdsPosterData();
        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const deleteAdsPoster = async (req: AuthorizedRequest, res: Response) => {
    const { adsPosterId } = req.query;
    try {
        const adsPosterData = await getAdsPosterDataById(adsPosterId);

        if (!adsPosterData || adsPosterData.length === 0) {
            res.status(StatusCodes.NOT_FOUND).send({ error: 'Ads Poster Data not found.' });
            return;
        }

        // Ensure imagePath is a valid string before deleting
        const imagePath = adsPosterData[0]?.imagePath ?? ''; 
        if (imagePath) {
            await deleteVpsUpload(imagePath);
        }

        // Delete ad poster data
        await deleteAdsPosterData(adsPosterId);

        return res.status(StatusCodes.OK).send({ success: true, message: "Ads Poster data deleted." });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}