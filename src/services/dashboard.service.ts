import { Banner } from "../models/banner.model";
import { Category } from "../models/category.model";
import { Order } from "../models/order.model";
import { OrderDetails } from "../models/orderDetails.model";
import { Product } from "../models/product.model";
import { User } from "../models/user.model";

export const getDashboardData = async () => {
    try {
        const totalUsers = await User.countDocuments({});
        const activeUsers = await User.countDocuments({isActive: {$eq: true}});
        const deActiveUsers = await User.countDocuments({isActive: {$eq: false}});
        const totalProduct = await Product.countDocuments({});
        const totalCategory = await Category.countDocuments({});
        const totalBanner = await Banner.countDocuments({});
        const totalOrder = await Order.countDocuments({});
        const totalAmount = await Order.aggregate([
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
        const totalRevenue = totalAmount[0]?.sum;
        const groupByCategory = await getTotalQtyGroupByCategory();
        const salesChartData = await getSalesChartData();
        const topCustomerData = await getTopCustomersData();
        const topCategoryData = await getTopCategoryData();
    
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
        }
    } catch (e) {
        throw e;
    }
}

export const getTopCategoryData = async () => {
    try {
        const result = await OrderDetails.aggregate([
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
    } catch (e) {
        throw e;
    }
}

export const getTopCustomersData = async () => {
    try {
        const result = await Order.aggregate([
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
    } catch (error) {
        throw error;
    }
}

export const getSalesChartData = async () => {
    try {
        const result = await OrderDetails.aggregate([
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
    } catch (e) {
        throw e;
    }
}

export const getTotalQtyGroupByCategory = async () => {
    try {
        const result = await OrderDetails.aggregate([
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
    } catch (e) {
        throw e;
    }
}