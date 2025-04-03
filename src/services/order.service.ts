import { DeliveryAddress } from "../models/deliveryAddress.model";
import mongoose from "mongoose";
import { IDeliveryAddress, IOrder, IOrderDetails, ITrackingDetails, IUnloadingDetails } from "../types/order";
import { TrackingDetails } from "../models/trackingDetails.model";
import { Order } from "../models/order.model";
import { UnloadingDetails } from "../models/unloadingDetails.model";
import { OrderDetails } from "../models/orderDetails.model";

export const getDeliveryAddressByUserId = async (userId: string) => {
    try {
        const result = await DeliveryAddress.find({ userId: userId });
        return result;
    } catch (e) {
        throw e;
    }
}

export const deleteDeliveryAddressData = async (id: string) => {
    try {
        const documentId = new mongoose.Types.ObjectId(id);
        await DeliveryAddress.deleteOne({ _id: documentId });
        return;
    } catch (e) {
        throw e;
    }
}

export const addDeliveryAddressData = async (bodyData: IDeliveryAddress) => {
    try {
        const newData = new DeliveryAddress(bodyData);
        await newData.save();
    } catch (e) {
        throw e;
    }
}

export const updateDeliveryAddressData = async (bodyData: IDeliveryAddress) => {
    try {
        const documentId = new mongoose.Types.ObjectId(bodyData?._id?.toString());
        const result = await DeliveryAddress.findByIdAndUpdate(documentId, bodyData, {
            new: true,
            runValidators: true
        });
        return result;
    } catch (e) {
        throw e;
    }
}

export const addTrackingData = async (data: ITrackingDetails) => {
    try {
        const newData = new TrackingDetails(data);
        await newData.save();
        return;
    } catch (e) {
        throw e;
    }
}

export const updateOrderStatusData = async (orderId: string, status: string) => {
    try {
        const documentId = new mongoose.Types.ObjectId(orderId);
        await Order.updateOne(
            { _id: documentId}, 
            { $set: {
                status: status,
            }},
            { upsert: true }
        );
        return;
    } catch (e) {
        throw e;
    }
}

export const updateTrackingDetail = async (bodyData: ITrackingDetails) => {
    try {
        const documentId = new mongoose.Types.ObjectId(bodyData?._id?.toString());
        const result = await TrackingDetails?.findByIdAndUpdate(documentId, bodyData, {
            new: true,
            runValidators: true
        });
        return result;
    } catch (e) {
        throw e;
    }
}

export const insertUnloadingData = async (data: IUnloadingDetails) => {
    try {
        const newData = new UnloadingDetails(data);
        await newData.save();
    } catch (e) {
        throw e;
    }
}

export const addOrderData = async (data: IOrder) => {
    try {
        const newData = new Order(data);
        await newData.save();
        return newData._id;
    } catch (e) {
        throw e;
    }
}

export const addOrderDetailsData = async (data: IOrderDetails) => {
    try {
        for (const item of data?.product ?? []) {
            const newData = new OrderDetails({ productId: item?.id, userId: data?.userId, orderId: data?.orderId, qty: item?.qty, totalPrice: item?.qty * item?.price }); // Assuming your model has a field named 'data'
            await newData.save();
        }
        return;
    } catch (e) {
        throw e;
    }
}

export const getOrderData = async () => {
    try {
        const result = await Order.aggregate([
            {
                $addFields: {
                    addressDetails: { $toObjectId: "$deliveryAddressId" },
                    userIdObject: { $toObjectId: "$userId" },
                }
            },
            {
                $lookup: {
                    from: "DeliveryAddress",
                    localField: "addressDetails",
                    foreignField: "_id",
                    as: "addressDetails"
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
                $project: {
                    "_id": 1,
                    "paymentId": 1,
                    "totalAmount": 1,
                    "userId": 1,
                    "status": 1,
                    "updatedAt": 1,
                    "createdAt": 1,
                    "userData": { $arrayElemAt: ["$userData", 0] },
                    "addressDetails": { $arrayElemAt: ["$addressDetails", 0] }
                }
            }
        ]);
        return result;
    } catch (e) {
        throw e;
    }
};

export const getOrderDetailsData = async () => {
    try {
        const result = await OrderDetails.aggregate([
            {
                $addFields: {
                    product: { $toObjectId: "$productId" },
                }
            },
            {
                $lookup: {
                    from: "Product",
                    localField: "product",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $project: {
                    "_id": 1,
                    "userId": 1,
                    "orderId": 1,
                    "qty": 1,
                    "updatedAt": 1,
                    "createdAt": 1,
                    "totalPrice": 1,
                    "productId": 1,
                    "product": { $arrayElemAt: ["$product", 0] }
                }
            }
        ]);
        
        return result;
    } catch (e) {
        throw e;
    }
}

export const getTrackingData = async () => {
    try {
        const result = await TrackingDetails.find();
        return result;
    } catch (e) {
        throw e;
    }
}

export const getUnloadingData = async () => {
    try {
        const result = await UnloadingDetails.find();
        return result;
    } catch (e) {
        throw e;
    }
}

export const getOrderDataByUser = async (userId: string) => {
    try {
        const result = await Order.aggregate([
            {
                $match: {
                  userId: userId
                }
            },
            {
                $addFields: {
                    addressDetails: { $toObjectId: "$deliveryAddressId" },
                    userIdObject: { $toObjectId: "$userId" },
                }
            },
            {
                $lookup: {
                    from: "DeliveryAddress",
                    localField: "addressDetails",
                    foreignField: "_id",
                    as: "addressDetails"
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
                $project: {
                    "_id": 1,
                    "paymentId": 1,
                    "totalAmount": 1,
                    "userId": 1,
                    "status": 1,
                    "updatedAt": 1,
                    "createdAt": 1,
                    "userData": { $arrayElemAt: ["$userData", 0] },
                    "addressDetails": { $arrayElemAt: ["$addressDetails", 0] }
                }
            }
        ]);
        return result;
    } catch (e) {
        throw e;
    }
}

export const getOrderDetailsDataByUser = async (userId: string) => {
    try {
        const result = await OrderDetails.aggregate([
            {
                $match: {
                  userId: userId
                }
            },
            {
                $addFields: {
                    product: { $toObjectId: "$productId" },
                }
            },
            {
                $lookup: {
                    from: "Product",
                    localField: "product",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $project: {
                    "_id": 1,
                    "userId": 1,
                    "orderId": 1,
                    "qty": 1,
                    "updatedAt": 1,
                    "createdAt": 1,
                    "totalPrice": 1,
                    "productId": 1,
                    "product": { $arrayElemAt: ["$product", 0] }
                }
            }
        ]);
        
        return result;
    } catch (e) {
        throw e;
    }
}
