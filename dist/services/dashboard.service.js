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
exports.getTotalQtyGroupByCategory = exports.getSalesChartData = exports.getTopCustomersData = exports.getTopCategoryData = exports.getDashboardData = void 0;
const banner_model_1 = require("../models/banner.model");
const category_model_1 = require("../models/category.model");
const order_model_1 = require("../models/order.model");
const orderDetails_model_1 = require("../models/orderDetails.model");
const product_model_1 = require("../models/product.model");
const user_model_1 = require("../models/user.model");
const getDashboardData = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const totalUsers = yield user_model_1.User.countDocuments({});
        const activeUsers = yield user_model_1.User.countDocuments({ isActive: { $eq: true } });
        const deActiveUsers = yield user_model_1.User.countDocuments({ isActive: { $eq: false } });
        const totalProduct = yield product_model_1.Product.countDocuments({});
        const totalCategory = yield category_model_1.Category.countDocuments({});
        const totalBanner = yield banner_model_1.Banner.countDocuments({});
        const totalOrder = yield order_model_1.Order.countDocuments({});
        const totalAmount = yield order_model_1.Order.aggregate([
            {
                $group: {
                    _id: null,
                    sum: { $sum: "$totalAmount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    sum: 1
                }
            }
        ]);
        const totalRevenue = (_a = totalAmount[0]) === null || _a === void 0 ? void 0 : _a.sum;
        const groupByCategory = yield (0, exports.getTotalQtyGroupByCategory)();
        const salesChartData = yield (0, exports.getSalesChartData)();
        const topCustomerData = yield (0, exports.getTopCustomersData)();
        const topCategoryData = yield (0, exports.getTopCategoryData)();
        return {
            totalUsers: totalUsers,
            activeUsers: activeUsers,
            deActiveUsers: deActiveUsers,
            totalProduct: totalProduct,
            totalCategory: totalCategory,
            totalBanner: totalBanner,
            totalOrder: totalOrder,
            totalRevenue: totalRevenue,
            categoryProductChartData: groupByCategory,
            salesChartData: salesChartData,
            topCustomerData: topCustomerData,
            topCategoryData: topCategoryData
        };
    }
    catch (e) {
        throw e;
    }
});
exports.getDashboardData = getDashboardData;
const getTopCategoryData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield orderDetails_model_1.OrderDetails.aggregate([
            {
                $lookup: {
                    from: "Order", // Name of the Users collection (case-sensitive)
                    let: { orderIdStr: "$orderId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [
                                        { $toString: "$_id" }, // Convert ObjectId to string
                                        "$$orderIdStr" // Use the userId from the order
                                    ]
                                }
                            }
                        }
                    ],
                    as: "order"
                }
            },
            {
                $unwind: "$order" // Unwind the user array
            },
            {
                $lookup: {
                    from: "Product", // Name of the Users collection (case-sensitive)
                    let: { productIdStr: "$productId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [
                                        { $toString: "$_id" }, // Convert ObjectId to string
                                        "$$productIdStr" // Use the userId from the order
                                    ]
                                }
                            }
                        }
                    ],
                    as: "product"
                }
            },
            {
                $unwind: "$product" // Unwind the user array
            },
            {
                $lookup: {
                    from: "Category", // Name of the Users collection (case-sensitive)
                    let: { categoryIdStr: "$product.categoryId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [
                                        { $toString: "$_id" }, // Convert ObjectId to string
                                        "$$categoryIdStr" // Use the userId from the order
                                    ]
                                }
                            }
                        }
                    ],
                    as: "category"
                }
            },
            {
                $unwind: "$category" // Unwind the user array
            },
            {
                $group: {
                    _id: "$product.categoryId", // Group by category name
                    totalAmount: { $sum: "$order.totalAmount" },
                    name: { $first: "$category.name" },
                }
            },
            {
                $project: {
                    _id: 0, // Exclude _id field
                    name: 1, // Include categoryName field
                    totalAmount: 1
                }
            },
            { $limit: 5 }
        ]);
        return result;
    }
    catch (e) {
        throw e;
    }
});
exports.getTopCategoryData = getTopCategoryData;
const getTopCustomersData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield order_model_1.Order.aggregate([
            {
                $group: {
                    _id: "$userId", // Group by user ID
                    totalAmount: { $sum: "$totalAmount" }
                }
            },
            {
                $lookup: {
                    from: "Users", // Name of the Users collection (case-sensitive)
                    let: { userIdStr: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [
                                        { $toString: "$_id" }, // Convert ObjectId to string
                                        "$$userIdStr" // Use the userId from the order
                                    ]
                                }
                            }
                        }
                    ],
                    as: "user"
                }
            },
            {
                $unwind: "$user" // Unwind the user array
            },
            {
                $project: {
                    _id: 0, // Exclude the default _id field
                    userId: "$_id",
                    totalAmount: 1,
                    user: 1 // Include the user object
                }
            },
            { $limit: 5 }
        ]);
        return result;
    }
    catch (error) {
        throw error;
    }
});
exports.getTopCustomersData = getTopCustomersData;
const getSalesChartData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield orderDetails_model_1.OrderDetails.aggregate([
            {
                $match: {
                    qty: { $exists: true }
                }
            },
            {
                $addFields: {
                    orderIdObjectId: { $toObjectId: "$orderId" }
                }
            },
            {
                $lookup: {
                    from: "Order", // Name of the Order collection
                    localField: "orderIdObjectId",
                    foreignField: "_id",
                    as: "order"
                }
            },
            {
                $unwind: "$order"
            },
            {
                $project: {
                    createdAt: { $toDate: "$order.createdAt" }, // Convert createdAt to date
                    qty: 1 // Include qty from OrderDetail collection
                }
            },
            {
                $sort: { "createdAt": 1 } // Sort by createdAt field in ascending order
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by date only
                    y: { $sum: "$qty" } // Sum qty for each date
                }
            },
            {
                $match: {
                    y: { $gt: 0 } // Filter out documents with totalQty less than or equal to 0
                }
            },
            {
                $project: {
                    _id: 0, // Exclude _id field from the output
                    x: { $toLong: { $toDate: "$_id" } }, // Convert createdAt to number
                    y: 1 // Include totalQty field in the output
                }
            }
        ]);
        return result;
    }
    catch (e) {
        throw e;
    }
});
exports.getSalesChartData = getSalesChartData;
const getTotalQtyGroupByCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield orderDetails_model_1.OrderDetails.aggregate([
            {
                $addFields: {
                    productObjectId: { $toObjectId: "$productId" } // Convert productId to ObjectId
                }
            },
            {
                $lookup: {
                    from: "Product",
                    localField: "productObjectId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: "$product" // Since lookup produces an array, unwind to destructure it
            },
            {
                $addFields: {
                    categoryIdObjectId: { $toObjectId: "$product.categoryId" } // Convert categoryId to ObjectId
                }
            },
            {
                $lookup: {
                    from: "Category",
                    localField: "categoryIdObjectId",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category" // Since lookup produces an array, unwind to destructure it
            },
            {
                $group: {
                    _id: "$category.name", // Group by category name
                    y: { $sum: "$qty" }
                }
            },
            {
                $project: {
                    name: "$_id", // Rename _id to categoryName
                    y: 1
                }
            }
        ]);
        return result;
    }
    catch (e) {
        throw e;
    }
});
exports.getTotalQtyGroupByCategory = getTotalQtyGroupByCategory;
