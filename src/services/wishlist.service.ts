import { ProductDetails } from "../models/productDetails.model";
import { Wishlist } from "../models/wishlist.model";
import { IWishlist } from "../types/wishlist";
import mongoose from "mongoose";

export const getProductDetailsByUserId = async (productId: string, userId: string) => {
    try {
        const result = await ProductDetails.find({productId: productId, userId: userId});
        return result;
    } catch (err) {
        throw err;
    }
}

export const addWishlistData = async (data: IWishlist) => {
    try {
        const newData = new Wishlist(data);
        await newData.save();
        return;
    } catch (err) {
        throw err;
    }
}

export const removeWishlistData = async (productId: string, userId: string) => {
    try {
        await Wishlist.findByIdAndDelete({ productId: productId, userId: userId });
        return;
    } catch (err) {
        throw err;
    }
}

export const getWishlistData = async (userId: string) => {
    try {
        const result = await Wishlist.aggregate([
            {
                $match: {
                  userId: userId
                }
            },
            {
                $addFields: {
                    userIdObject: { $toObjectId: "$userId" },
                    productIdObject: { $toObjectId: "$productId" }
                }
            },
            {
                $lookup: {
                    from: "Users",
                    localField: "userIdObject",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            {
                $lookup: {
                    from: "Product",
                    localField: "productIdObject",
                    foreignField: "_id",
                    as: "productData"
                }
            },
            {
                $project: {
                    "_id": 1,
                    "userId": 1,
                    "productId": 1,
                    "createdAt": 1,
                    "updatedAt": 1,
                    "user": { $arrayElemAt: ["$userData", 0] },
                    "product": { $arrayElemAt: ["$productData", 0] }
                }
            }
        ]);
        // Calculate total qty
        return result
    } catch (err) {
        throw err;
    }
}