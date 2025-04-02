import { Cart } from "../models/cart.model";
import { ICart } from "../types/cart";
import mongoose from "mongoose";

export const addToCartData = async (bodyData: ICart) => {
    try {
        const newData = new Cart(bodyData);
        await newData.save();
        return;
    } catch (err) {
        throw err;
    }
}

export const removeToCartData = async (productId: string, userId: string) => {
    try {
        await Cart.deleteOne({ productId: productId, userId: userId });
        return;
    } catch (err) {
        throw err;
    }
}

export const removeToCartDataAllUser = async (productId: string) => {
    try {
        await Cart.deleteOne({ productId: productId });
        return;
    } catch (err) {
        throw err;
    }
}

export const getCartData = async (userId: string) => {
    try {
        const result = await Cart.aggregate([
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
                    "qty": 1,
                    "total": 1,
                    "user": { $arrayElemAt: ["$userData", 0] },
                    "product": { $arrayElemAt: ["$productData", 0] }
                }
            }
        ]);
        
        // Calculate total amount
        const totalAmount = result?.reduce((total, item) => total + item?.total, 0);
        // Calculate total qty
        const totalQty = result?.reduce((total, item) => total + item?.qty, 0);
        // Calculate total weight
        const totalWeight = result?.reduce((total, item) => total + (item?.product?.weight * item?.qty), 0);

        return { data: result, totalAmount, totalQty, totalWeight };
    } catch (err) {
        throw err;
    }
}

export const updateCartData = async (productId: string, userId: string, qty: number, price: number) => {
    try {
        await Cart.updateOne(
            { productId: productId, userId: userId }, 
            { $set: {
                qty: qty,
                total: qty * price
            }},
            { upsert: true }
        );
        return;
    } catch (err) {
        throw err;
    }
}

export const getCartCountData = async (userId: string) => {
    try {
        const result = await Cart.countDocuments({userId: userId});
        return result
    } catch (err) {
        throw err;
    }
}