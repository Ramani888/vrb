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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchProductData = exports.getProductTypeData = exports.getProductTrendData = exports.getProductStoneTypeData = exports.getProductPlatingData = exports.getProductOccasionData = exports.getProductColorData = exports.getProductBrandData = exports.getProductBaseMetalData = exports.updateProductActionData = exports.getProductUnderTenData = exports.getProductUnderFiveData = exports.getProductUnderThreeData = exports.getProductUnderTwoData = exports.getPramotionProductData = exports.updateProductRewardData = exports.updateProductDiscountData = exports.updateProductPramotionFlagData = exports.deleteProductDetailsData = exports.deleteProductData = exports.getProductDataByCategoryId = exports.getAllProductData = exports.updateProductData = exports.addProductData = exports.getProductDetailsByUserId = exports.getProductDataById = exports.updateProductCartFlag = exports.updateProductWishlistFlag = void 0;
const product_model_1 = require("../models/product.model");
const productDetails_model_1 = require("../models/productDetails.model");
const mongoose_1 = __importDefault(require("mongoose"));
const lodash_1 = __importDefault(require("lodash"));
const productBaseMetal_model_1 = require("../models/productBaseMetal.model");
const productBrand_model_1 = require("../models/productBrand.model");
const productColor_model_1 = require("../models/productColor.model");
const productOccasion_model_1 = require("../models/productOccasion.model");
const productPlating_model_1 = require("../models/productPlating.model");
const productStoneType_model_1 = require("../models/productStoneType.model");
const productTrend_model_1 = require("../models/productTrend.model");
const productType_model_1 = require("../models/productType.model");
const updateProductWishlistFlag = (productId, userId, isWishlist) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield productDetails_model_1.ProductDetails.findOneAndUpdate({ userId: userId, productId: productId }, { $set: {
                isWishlist: isWishlist,
            } }, {
            upsert: true,
        });
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.updateProductWishlistFlag = updateProductWishlistFlag;
const updateProductCartFlag = (productId, userId, isCart) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield productDetails_model_1.ProductDetails.findOneAndUpdate({ userId: userId, productId: productId }, { $set: {
                isCart: isCart,
            } }, {
            upsert: true,
        });
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.updateProductCartFlag = updateProductCartFlag;
const getProductDataById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const objectId = new mongoose_1.default.Types.ObjectId(productId);
    try {
        const result = yield product_model_1.Product.aggregate([
            {
                $match: {
                    _id: objectId,
                },
            },
            {
                $addFields: {
                    productBaseMetalObjectId: {
                        $cond: {
                            if: { $and: [
                                    { $ifNull: ["$productBaseMetalId", false] },
                                    { $eq: [{ $strLenCP: { $ifNull: ["$productBaseMetalId", ""] } }, 24] }
                                ] },
                            then: { $toObjectId: "$productBaseMetalId" },
                            else: null,
                        },
                    },
                    productPlatingObjectId: {
                        $cond: {
                            if: { $and: [
                                    { $ifNull: ["$productPlatingId", false] },
                                    { $eq: [{ $strLenCP: { $ifNull: ["$productPlatingId", ""] } }, 24] }
                                ] },
                            then: { $toObjectId: "$productPlatingId" },
                            else: null,
                        },
                    },
                    productStoneTypeObjectId: {
                        $cond: {
                            if: { $and: [
                                    { $ifNull: ["$productStoneTypeId", false] },
                                    { $eq: [{ $strLenCP: { $ifNull: ["$productStoneTypeId", ""] } }, 24] }
                                ] },
                            then: { $toObjectId: "$productStoneTypeId" },
                            else: null,
                        },
                    },
                    productTrendObjectId: {
                        $cond: {
                            if: { $and: [
                                    { $ifNull: ["$productTrendId", false] },
                                    { $eq: [{ $strLenCP: { $ifNull: ["$productTrendId", ""] } }, 24] }
                                ] },
                            then: { $toObjectId: "$productTrendId" },
                            else: null,
                        },
                    },
                    productBrandObjectId: {
                        $cond: {
                            if: { $and: [
                                    { $ifNull: ["$productBrandId", false] },
                                    { $eq: [{ $strLenCP: { $ifNull: ["$productBrandId", ""] } }, 24] }
                                ] },
                            then: { $toObjectId: "$productBrandId" },
                            else: null,
                        },
                    },
                    productColorObjectId: {
                        $cond: {
                            if: { $and: [
                                    { $ifNull: ["$productColorId", false] },
                                    { $eq: [{ $strLenCP: { $ifNull: ["$productColorId", ""] } }, 24] }
                                ] },
                            then: { $toObjectId: "$productColorId" },
                            else: null,
                        },
                    },
                    productOccasionObjectId: {
                        $cond: {
                            if: { $and: [
                                    { $ifNull: ["$productOccasionId", false] },
                                    { $eq: [{ $strLenCP: { $ifNull: ["$productOccasionId", ""] } }, 24] }
                                ] },
                            then: { $toObjectId: "$productOccasionId" },
                            else: null,
                        },
                    },
                    productTypeObjectId: {
                        $cond: {
                            if: { $and: [
                                    { $ifNull: ["$productTypeId", false] },
                                    { $eq: [{ $strLenCP: { $ifNull: ["$productTypeId", ""] } }, 24] }
                                ] },
                            then: { $toObjectId: "$productTypeId" },
                            else: null,
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "ProductBaseMetal",
                    localField: "productBaseMetalObjectId",
                    foreignField: "_id",
                    as: "productBaseMetalData",
                },
            },
            {
                $unwind: {
                    path: "$productBaseMetalData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "ProductPlating",
                    localField: "productPlatingObjectId",
                    foreignField: "_id",
                    as: "productPlatingData",
                },
            },
            {
                $unwind: {
                    path: "$productPlatingData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "ProductStoneType",
                    localField: "productStoneTypeObjectId",
                    foreignField: "_id",
                    as: "productStoneTypeData",
                },
            },
            {
                $unwind: {
                    path: "$productStoneTypeData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "ProductTrend",
                    localField: "productTrendObjectId",
                    foreignField: "_id",
                    as: "productTrendData",
                },
            },
            {
                $unwind: {
                    path: "$productTrendData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "ProductBrand",
                    localField: "productBrandObjectId",
                    foreignField: "_id",
                    as: "productBrandData",
                },
            },
            {
                $unwind: {
                    path: "$productBrandData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "ProductColor",
                    localField: "productColorObjectId",
                    foreignField: "_id",
                    as: "productColorData",
                },
            },
            {
                $unwind: {
                    path: "$productColorData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "ProductOccasion",
                    localField: "productOccasionObjectId",
                    foreignField: "_id",
                    as: "productOccasionData",
                },
            },
            {
                $unwind: {
                    path: "$productOccasionData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "ProductType",
                    localField: "productTypeObjectId",
                    foreignField: "_id",
                    as: "productTypeData",
                },
            },
            {
                $unwind: {
                    path: "$productTypeData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: Object.assign(Object.assign({}, Object.fromEntries(Object.keys(product_model_1.Product.schema.paths).map((k) => [k, 1]))), { productBaseMetalName: "$productBaseMetalData.name", productPlatingName: "$productPlatingData.name", productStoneTypeName: "$productStoneTypeData.name", productTrendName: "$productTrendData.name", productBrandName: "$productBrandData.name", productColorName: "$productColorData.name", productColorCode: "$productColorData.color", productOccasionName: "$productOccasionData.name", productTypeName: "$productTypeData.name" }),
            },
        ]);
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getProductDataById = getProductDataById;
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
const addProductData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newData = new product_model_1.Product(data);
        yield newData.save();
        return newData._id;
    }
    catch (err) {
        throw err;
    }
});
exports.addProductData = addProductData;
const updateProductData = (bodyData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const documentId = new mongoose_1.default.Types.ObjectId((_a = bodyData === null || bodyData === void 0 ? void 0 : bodyData._id) === null || _a === void 0 ? void 0 : _a.toString());
        const result = yield (product_model_1.Product === null || product_model_1.Product === void 0 ? void 0 : product_model_1.Product.findByIdAndUpdate(documentId, bodyData, {
            new: true,
            runValidators: true,
        }));
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.updateProductData = updateProductData;
const getAllProductData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield product_model_1.Product.find();
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getAllProductData = getAllProductData;
const getProductDataByCategoryId = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield product_model_1.Product.find({
            categoryId: categoryId,
            $or: [
                { isPause: false },
                { isPause: { $exists: false } }
            ]
        });
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getProductDataByCategoryId = getProductDataByCategoryId;
const deleteProductData = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documentId = new mongoose_1.default.Types.ObjectId(productId);
        yield product_model_1.Product.findByIdAndDelete({ _id: documentId });
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.deleteProductData = deleteProductData;
const deleteProductDetailsData = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield productDetails_model_1.ProductDetails.deleteMany({ productId: productId });
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.deleteProductDetailsData = deleteProductDetailsData;
const updateProductPramotionFlagData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const documentId = new mongoose_1.default.Types.ObjectId((_a = data === null || data === void 0 ? void 0 : data._id) === null || _a === void 0 ? void 0 : _a.toString());
        yield product_model_1.Product.updateOne({ _id: documentId }, { $set: {
                isPramotion: data === null || data === void 0 ? void 0 : data.isPramotion
            } }, { upsert: true });
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.updateProductPramotionFlagData = updateProductPramotionFlagData;
const updateProductDiscountData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const documentId = new mongoose_1.default.Types.ObjectId((_a = data === null || data === void 0 ? void 0 : data._id) === null || _a === void 0 ? void 0 : _a.toString());
        yield product_model_1.Product.updateOne({ _id: documentId }, { $set: {
                discount: data === null || data === void 0 ? void 0 : data.discount
            } }, { upsert: true });
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.updateProductDiscountData = updateProductDiscountData;
const updateProductRewardData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const documentId = new mongoose_1.default.Types.ObjectId((_a = data === null || data === void 0 ? void 0 : data._id) === null || _a === void 0 ? void 0 : _a.toString());
        yield product_model_1.Product.updateOne({ _id: documentId }, { $set: {
                reward: data === null || data === void 0 ? void 0 : data.reward
            } }, { upsert: true });
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.updateProductRewardData = updateProductRewardData;
const getPramotionProductData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(today.getDate() - 5);
        // Fetch data from the last 5 days and sort by date descending
        const recentProducts = yield product_model_1.Product.find({
            isPramotion: true,
            $or: [
                { isPause: false },
                { isPause: { $exists: false } }
            ],
            createdAt: { $gte: fiveDaysAgo }
        }).sort({ createdAt: -1 });
        // Fetch data older than 5 days
        const olderProducts = yield product_model_1.Product.find({
            isPramotion: true,
            $or: [
                { isPause: false },
                { isPause: { $exists: false } }
            ],
            createdAt: { $lt: fiveDaysAgo }
        });
        // Shuffle the older products randomly
        const shuffledOlderProducts = lodash_1.default.shuffle(olderProducts);
        // Combine recent and shuffled older products
        const result = [...recentProducts, ...shuffledOlderProducts];
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getPramotionProductData = getPramotionProductData;
const getProductUnderTwoData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield product_model_1.Product.find({
            price: { $lte: 200 },
            $or: [
                { isPause: false },
                { isPause: { $exists: false } }
            ]
        });
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getProductUnderTwoData = getProductUnderTwoData;
const getProductUnderThreeData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield product_model_1.Product.find({
            price: { $gt: 200, $lte: 300 },
            $or: [
                { isPause: false },
                { isPause: { $exists: false } }
            ]
        });
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getProductUnderThreeData = getProductUnderThreeData;
const getProductUnderFiveData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield product_model_1.Product.find({
            price: { $gt: 300, $lte: 500 },
            $or: [
                { isPause: false },
                { isPause: { $exists: false } }
            ]
        });
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getProductUnderFiveData = getProductUnderFiveData;
const getProductUnderTenData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield product_model_1.Product.find({
            price: { $gt: 500, $lte: 1000 },
            $or: [
                { isPause: false },
                { isPause: { $exists: false } }
            ]
        });
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getProductUnderTenData = getProductUnderTenData;
const updateProductActionData = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documentId = new mongoose_1.default.Types.ObjectId(productId);
        const product = yield product_model_1.Product.findOne({ _id: documentId });
        yield product_model_1.Product.updateOne({
            _id: documentId
        }, {
            $set: {
                isPause: !(product === null || product === void 0 ? void 0 : product.isPause)
            }
        }, { upsert: true });
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.updateProductActionData = updateProductActionData;
const getProductBaseMetalData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield productBaseMetal_model_1.ProductBaseMetal.find();
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getProductBaseMetalData = getProductBaseMetalData;
const getProductBrandData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield productBrand_model_1.ProductBrand.find();
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getProductBrandData = getProductBrandData;
const getProductColorData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield productColor_model_1.ProductColor.find();
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getProductColorData = getProductColorData;
const getProductOccasionData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield productOccasion_model_1.ProductOccasion.find();
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getProductOccasionData = getProductOccasionData;
const getProductPlatingData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield productPlating_model_1.ProductPlating.find();
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getProductPlatingData = getProductPlatingData;
const getProductStoneTypeData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield productStoneType_model_1.ProductStoneType.find();
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getProductStoneTypeData = getProductStoneTypeData;
const getProductTrendData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield productTrend_model_1.ProductTrend.find();
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getProductTrendData = getProductTrendData;
const getProductTypeData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield productType_model_1.ProductType.find();
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getProductTypeData = getProductTypeData;
const getSearchProductData = (productName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.Product.find({ name: new RegExp(productName, 'i') });
        return products;
    }
    catch (err) {
        throw err;
    }
});
exports.getSearchProductData = getSearchProductData;
