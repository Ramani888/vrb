"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWishlistData = exports.removeWishlistDataAllUser = exports.removeWishlistData = exports.addWishlistData = exports.getProductDetailsByUserId = void 0;
const productDetails_model_1 = require("../models/productDetails.model");
const wishlist_model_1 = require("../models/wishlist.model");
const getProductDetailsByUserId = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield productDetails_model_1.ProductDetails.find({ productId: productId, userId: userId });
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getProductDetailsByUserId = getProductDetailsByUserId;
const addWishlistData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newData = new wishlist_model_1.Wishlist(data);
        yield newData.save();
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.addWishlistData = addWishlistData;
const removeWishlistData = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield wishlist_model_1.Wishlist.findOneAndDelete({ productId: productId, userId: userId });
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.removeWishlistData = removeWishlistData;
const removeWishlistDataAllUser = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield wishlist_model_1.Wishlist.findOneAndDelete({ productId: productId });
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.removeWishlistDataAllUser = removeWishlistDataAllUser;
const getWishlistData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield wishlist_model_1.Wishlist.aggregate([
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
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getWishlistData = getWishlistData;
