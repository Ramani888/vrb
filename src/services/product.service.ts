import { Product } from "../models/product.model";
import { ProductDetails } from "../models/productDetails.model";
import mongoose from "mongoose";
import _ from "lodash";
import { IProduct } from "../types/product";

export const updateProductWishlistFlag = async (productId: string, userId: string, isWishlist: boolean) => {
    try {
        await ProductDetails.findOneAndUpdate(
            { userId: userId, productId: productId },
            { $set: {
                isWishlist: isWishlist,
            }},
            {
                upsert: true,
            }
        );
        return;
    } catch (err) {
        throw err;
    }
};

export const updateProductCartFlag = async (productId: string, userId: string, isCart: boolean) => {
    try {
        await ProductDetails.findOneAndUpdate(
            { userId: userId, productId: productId },
            { $set: {
                isCart: isCart,
            }},
            {
                upsert: true,
            }
        );
        return;
    } catch (err) {
        throw err;
    }
}

export const getProductDataById = async (productId: string) => {
    const objectId = new mongoose.Types.ObjectId(productId);
    try {
        const result = await Product.aggregate([
            {
                $match: {
                    _id: objectId,
                },
            },
            {
                $addFields: {
                    productBaseMetalObjectId: {
                        $cond: {
                            if: { $eq: [{ $strLenCP: "$productBaseMetalId" }, 24] },
                            then: { $toObjectId: "$productBaseMetalId" },
                            else: null,
                        },
                    },
                    productPlatingObjectId: {
                        $cond: {
                            if: { $eq: [{ $strLenCP: "$productPlatingId" }, 24] },
                            then: { $toObjectId: "$productPlatingId" },
                            else: null,
                        },
                    },
                    productStoneTypeObjectId: {
                        $cond: {
                            if: { $eq: [{ $strLenCP: "$productStoneTypeId" }, 24] },
                            then: { $toObjectId: "$productStoneTypeId" },
                            else: null,
                        },
                    },
                    productTrendObjectId: {
                        $cond: {
                            if: { $eq: [{ $strLenCP: "$productTrendId" }, 24] },
                            then: { $toObjectId: "$productTrendId" },
                            else: null,
                        },
                    },
                    productBrandObjectId: {
                        $cond: {
                            if: { $eq: [{ $strLenCP: "$productBrandId" }, 24] },
                            then: { $toObjectId: "$productBrandId" },
                            else: null,
                        },
                    },
                    productColorObjectId: {
                        $cond: {
                            if: { $eq: [{ $strLenCP: "$productColorId" }, 24] },
                            then: { $toObjectId: "$productColorId" },
                            else: null,
                        },
                    },
                    productOccasionObjectId: {
                        $cond: {
                            if: { $eq: [{ $strLenCP: "$productOccasionId" }, 24] },
                            then: { $toObjectId: "$productOccasionId" },
                            else: null,
                        },
                    },
                    productTypeObjectId: {
                        $cond: {
                            if: { $eq: [{ $strLenCP: "$productTypeId" }, 24] },
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
                $project: {
                    ...Object.fromEntries(
                        Object.keys(Product.schema.paths).map((k) => [k, 1])
                    ),
                    productBaseMetalName: "$productBaseMetalData.name",
                    productPlatingName: "$productPlatingData.name",
                    productStoneTypeName: "$productStoneTypeData.name",
                    productTrendName: "$productTrendData.name",
                    productBrandName: "$productBrandData.name",
                    productColorName: "$productColorData.name",
                    productColorCode: "$productColorData.color",
                    productOccasionName: "$productOccasionData.name",
                    productTypeName: "$productTypeData.name",
                },
            },
        ]);

        return result;
    } catch (err) {
        throw err;
    }
};

export const getProductDetailsByUserId = async (productId: string, userId: string) => {
    try {
        const result = await ProductDetails.find({productId: productId, userId: userId});
        return result;
    } catch (err) {
        throw err;
    }
}

export const addProductData = async (data: IProduct) => {
    try {
        const newData = new Product(data);
        await newData.save();
        return newData._id;
    } catch (err) {
        throw err;
    }
}

export const updateProductData = async (bodyData: IProduct) => {
    try {
        const documentId = new mongoose.Types.ObjectId(bodyData?._id?.toString());
        const result = await Product?.findByIdAndUpdate(documentId, bodyData, {
            new: true,
            runValidators: true,
        });
        return result;
    } catch (err) {
        throw err;
    }
}

export const getAllProductData = async () => {
    try {
        const result = await Product.find();
        return result;
    } catch (err) {
        throw err;
    }
}

export const getProductDataByCategoryId = async (categoryId: string) => {
    try {
        const result = await Product.find({
            categoryId: categoryId,
            $or: [
                { isPause: false },
                { isPause: { $exists: false } }
            ]
        });
        return result;
    } catch (err) {
        throw err;
    }
}

export const deleteProductData = async (productId: string) => {
    try {
        const documentId = new mongoose.Types.ObjectId(productId);
        await Product.findByIdAndDelete({ _id: documentId });
        return;
    } catch (err) {
        throw err;
    }
}

export const deleteProductDetailsData = async (productId: string) => {
    try {
        await ProductDetails.deleteMany({ productId: productId });
        return;
    } catch (err) {
        throw err;
    }
}

export const updateProductPramotionFlagData = async (data: IProduct) => {
    try {
        const documentId = new mongoose.Types.ObjectId(data?._id?.toString());
        await Product.updateOne(
            { _id: documentId}, 
            { $set: {
                isPramotion: data?.isPramotion
            }},
            { upsert: true }
        );
        return;
    } catch (err) {
        throw err;
    }
}

export const updateProductDiscountData = async (data: IProduct) => {
    try {
        const documentId = new mongoose.Types.ObjectId(data?._id?.toString());
        await Product.updateOne(
            { _id: documentId}, 
            { $set: {
                discount: data?.discount
            }},
            { upsert: true }
        );
        return;
    } catch (err) {
        throw err;
    }
}

export const updateProductRewardData = async (data: IProduct) => {
    try {
        const documentId = new mongoose.Types.ObjectId(data?._id?.toString());
        await Product.updateOne(
            { _id: documentId}, 
            { $set: {
                reward: data?.reward
            }},
            { upsert: true }
        );
        return;
    } catch (err) {
        throw err;
    }
}

export const getPramotionProductData = async () => {
    try {
        const today = new Date();
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(today.getDate() - 5);

        // Fetch data from the last 5 days and sort by date descending
        const recentProducts = await Product.find({
            isPramotion: true,
            $or: [
                { isPause: false },
                { isPause: { $exists: false } }
            ],
            createdAt: { $gte: fiveDaysAgo }
        }).sort({ createdAt: -1 });

        // Fetch data older than 5 days
        const olderProducts = await Product.find({
            isPramotion: true,
            $or: [
                { isPause: false },
                { isPause: { $exists: false } }
            ],
            createdAt: { $lt: fiveDaysAgo }
        });

        // Shuffle the older products randomly
        const shuffledOlderProducts = _.shuffle(olderProducts);

        // Combine recent and shuffled older products
        const result = [...recentProducts, ...shuffledOlderProducts];

        return result;
    } catch (err) {
        throw err;
    }
}

export const getProductUnderTwoData = async () => {
    try {
        const result = await Product.find({ 
            price: { $lte: 200 }, 
            $or: [
                { isPause: false },
                { isPause: { $exists: false } }
            ]
        });
        return result;
    } catch (err) {
        throw err;
    }
}

export const getProductUnderThreeData = async () => {
    try {
        const result = await Product.find({ 
            price: { $gt: 200, $lte: 300 }, 
            $or: [
                { isPause: false },
                { isPause: { $exists: false } }
            ]
        });
        return result;
    } catch (err) {
        throw err;
    }
}

export const getProductUnderFiveData = async () => {
    try {
        const result = await Product.find({ 
            price: { $gt: 300, $lte: 500 }, 
            $or: [
                { isPause: false },
                { isPause: { $exists: false } }
            ]
        });
        return result;
    } catch (err) {
        throw err;
    }
}

export const getProductUnderTenData = async () => {
    try {
        const result = await Product.find({ 
            price: { $gt: 500, $lte: 1000 }, 
            $or: [
                { isPause: false },
                { isPause: { $exists: false } }
            ]
        });
        return result;
    } catch (err) {
        throw err;
    }
}

export const updateProductActionData = async (productId: string) => {
    try {
        const documentId = new mongoose.Types.ObjectId(productId);
        const product = await Product.findOne({ _id: documentId });
        await Product.updateOne(
            {
                _id: documentId
            },
            {
                $set: {
                    isPause: !product?.isPause
                }
            },
            { upsert: true }
        )
        return;
    } catch (err) {
        throw err;
    }
}