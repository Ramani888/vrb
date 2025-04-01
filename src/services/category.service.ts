import { Category } from "../models/category.model";
import { ICategory } from "../types/category";
import mongoose from "mongoose";

export const addCategoryData = async (data: ICategory) => {
    try {
        const newData = new Category(data);
        await newData.save();
        return;
    } catch (err) {
        throw err;
    }
}

export const getCategoryDataById = async (categoryId: string) => {
    try {
        const objectId = new mongoose.Types.ObjectId(categoryId);
        const result = await Category.find({_id: objectId});
        return result;
    } catch (err) {
        throw err;
    }
}

export const updateCategoryData = async (data: ICategory) => {
    try {
        const documentId = new mongoose.Types.ObjectId(data?._id?.toString());
        const result = await Category.findByIdAndUpdate(documentId, data, {
            new: true,
            runValidators: true
        });
        return result;
    } catch (err) {
        throw err;
    }
}

export const getAllCategoryData = async () => {
    try {
        const result = await Category.find();
        return result;
    } catch (err) {
        throw err;
    }
}

export const deleteCategoryData = async (categoryId: string) => {
    try {
        const documentId = new mongoose.Types.ObjectId(categoryId);
        await Category.findByIdAndDelete({ _id: documentId });
        return;
    } catch (err) {
        throw err;
    }
}