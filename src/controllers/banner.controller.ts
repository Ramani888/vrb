import { AuthorizedRequest } from "../types/user";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import dotenv from "dotenv"
import { addBannerData, deleteBannerData, getAllBannerData, getBannerDataById, updateBannerData } from "../services/banner.service";
import { deleteImageS3, deleteVpsUpload } from "../utils/helpers/global";
dotenv.config();

export const addBanner = async (req: AuthorizedRequest, res: Response) => {
    const file = req.file;
    
    if (!file) {
        res.status(StatusCodes.BAD_REQUEST).send({ error: 'Image file is missing.' });
        return;
    }

    const bannerUrl = `https://vrfashionjewelleary.in/uploads/images/${req.file.filename}`;

    try {
        const bannerData = {
            name: req?.body?.name,
            imagePath: bannerUrl
        };

        await addBannerData(bannerData);
        res.status(StatusCodes.OK).send({ success: true, message: 'Banner data inserted.' });

    } catch (error) {
        console.error('Error adding banner:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'Failed to insert banner data.' });
    }
}

export const updateBanner = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;
    const file = req.file;
    try {
        const bannerData = await getBannerDataById(bodyData?._id);

        if (!bannerData || bannerData.length === 0) {
            res.status(StatusCodes.NOT_FOUND).send({ error: 'Banner data not found.' });
            return;
        }

        let imagePath = bannerData[0]?.imagePath ?? '';

        if (file) {
            const bannerUrl = `https://vrfashionjewelleary.in/uploads/images/${req.file.filename}`;

            await deleteVpsUpload(imagePath);

            imagePath = bannerUrl;
        }

        await updateBannerData({...bodyData, imagePath});

        res.status(StatusCodes.OK).send({ success: true, message: "Banner data updated." });
    } catch (error) {
        console.error('Error updating banner:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'Failed to update banner data.' });
    }
}

export const getAllBanner = async (req: AuthorizedRequest, res: Response) => {
    try {
        const data = await getAllBannerData();
        return res.status(StatusCodes.OK).send({ data });
    } catch (error) {
        console.error('Error fetching all banners:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'Failed to fetch all banners.' });
    }
}

export const deleteBanner = async (req: AuthorizedRequest, res: Response) => {
    const { bannerId } = req.query;
    try {
        const bannerData = await getBannerDataById(bannerId);

        if (!bannerData || bannerData.length === 0) {
            res.status(StatusCodes.NOT_FOUND).send({ error: 'Banner not found.' });
            return;
        }

        const imagePath = bannerData[0]?.imagePath;

        // Delete Image if it exists
        if (imagePath) {
            await deleteVpsUpload(imagePath);
        }

        // Delete Banner Data from Database
        await deleteBannerData(bannerId);

        return res.status(StatusCodes.OK).send({ success: true, message: 'Banner deleted successfully.' });

    } catch (error) {
        console.error('Error deleting banner:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'Failed to delete banner data.' });
    }
}