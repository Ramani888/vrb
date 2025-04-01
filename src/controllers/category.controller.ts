import { AuthorizedRequest } from "../types/user";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import dotenv from "dotenv"
import { deleteImageS3 } from "../utils/helpers/global";
import { addCategoryData, deleteCategoryData, getAllCategoryData, getCategoryDataById, updateCategoryData } from "../services/category.service";
dotenv.config();

export const addCategory = async (req: AuthorizedRequest, res: Response) => {
    const file = req.file;
    const bodyData = req.body;

    if (!file) {
        res.status(StatusCodes.BAD_REQUEST).send({ error: 'Image file is missing.' });
        return;
    }

    const categoryUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.key}`;

    try {
        const categoryData = {
            name: req?.body?.name,
            imagePath: categoryUrl
        };
        await addCategoryData(categoryData);
        return res.status(StatusCodes.OK).send({ success: true, message: "Category data inserted." });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const updateCategory = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;
    const file = req.file;

    try {
        const categoryData = await getCategoryDataById(bodyData?._id);

        if (!categoryData || categoryData.length === 0) {
            res.status(StatusCodes.NOT_FOUND).send({ error: 'Category data not found.' });
            return;
        }

        if (file) {
            const categoryUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.key}`;

            // Delete Image
            const imagePath = categoryData[0]?.imagePath ?? undefined; // Ensure it's `undefined` instead of `null`
            if (imagePath) {
                await deleteImageS3(imagePath);
            }

            // Insert Data
            await updateCategoryData({
                ...bodyData,
                imagePath: categoryUrl, // Ensure `imagePath` is `string | undefined`
            });
        } else {
            await updateCategoryData({
                ...bodyData,
                imagePath: categoryData[0]?.imagePath ?? undefined,
            });
        }

        return res.status(StatusCodes.OK).send({ success: true, message: "Category data updated." });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
};

export const getAllCategory = async (req: AuthorizedRequest, res: Response) => {
    try {
        const data = await getAllCategoryData();
        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getCategoryById = async (req: AuthorizedRequest, res: Response) => {
    const { categoryId } = req.query;
    try {
        const data = await getCategoryDataById(categoryId);
        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const deleteCategory = async (req: AuthorizedRequest, res: Response) => {
    const { categoryId } = req.query;

    try {
        const categoryData = await getCategoryDataById(categoryId);
        if (!categoryData || categoryData.length === 0) {
            res.status(StatusCodes.NOT_FOUND).send({ error: 'Category not found.' });
            return;
        }

        // Ensure imagePath is valid
        const imagePath = categoryData[0]?.imagePath ?? undefined;
        if (imagePath) {
            await deleteImageS3(imagePath);
        }

        await deleteCategoryData(categoryId);
        return res.status(StatusCodes.OK).send({ success: true, message: "Category data deleted." });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
};