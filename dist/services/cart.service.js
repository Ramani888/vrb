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
exports.getCartCountData = exports.updateCartData = exports.getCartData = exports.removeToCartDataAllUser = exports.removeToCartData = exports.addToCartData = void 0;
const cart_model_1 = require("../models/cart.model");
const addToCartData = (bodyData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newData = new cart_model_1.Cart(bodyData);
        yield newData.save();
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.addToCartData = addToCartData;
const removeToCartData = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cart_model_1.Cart.deleteOne({ productId: productId, userId: userId });
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.removeToCartData = removeToCartData;
const removeToCartDataAllUser = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cart_model_1.Cart.deleteOne({ productId: productId });
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.removeToCartDataAllUser = removeToCartDataAllUser;
const getCartData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cart_model_1.Cart.aggregate([
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
        const totalAmount = result === null || result === void 0 ? void 0 : result.reduce((total, item) => total + (item === null || item === void 0 ? void 0 : item.total), 0);
        // Calculate total qty
        const totalQty = result === null || result === void 0 ? void 0 : result.reduce((total, item) => total + (item === null || item === void 0 ? void 0 : item.qty), 0);
        // Calculate total weight
        const totalWeight = result === null || result === void 0 ? void 0 : result.reduce((total, item) => { var _a; return total + (((_a = item === null || item === void 0 ? void 0 : item.product) === null || _a === void 0 ? void 0 : _a.weight) * (item === null || item === void 0 ? void 0 : item.qty)); }, 0);
        return { data: result, totalAmount, totalQty, totalWeight };
    }
    catch (err) {
        throw err;
    }
});
exports.getCartData = getCartData;
const updateCartData = (productId, userId, qty, price) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cart_model_1.Cart.updateOne({ productId: productId, userId: userId }, { $set: {
                qty: qty,
                total: qty * price
            } }, { upsert: true });
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.updateCartData = updateCartData;
const getCartCountData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cart_model_1.Cart.countDocuments({ userId: userId });
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getCartCountData = getCartCountData;
