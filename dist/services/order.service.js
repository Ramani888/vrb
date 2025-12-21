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
exports.getOrderDetailsDataByUser = exports.getOrderDataByUser = exports.getUnloadingData = exports.getTrackingData = exports.getOrderDetailsData = exports.getOrderData = exports.addOrderDetailsData = exports.addOrderData = exports.insertUnloadingData = exports.updateTrackingDetail = exports.updateOrderStatusData = exports.addTrackingData = exports.updateDeliveryAddressData = exports.addDeliveryAddressData = exports.deleteDeliveryAddressData = exports.getDeliveryAddressByUserId = void 0;
const deliveryAddress_model_1 = require("../models/deliveryAddress.model");
const mongoose_1 = __importDefault(require("mongoose"));
const trackingDetails_model_1 = require("../models/trackingDetails.model");
const order_model_1 = require("../models/order.model");
const unloadingDetails_model_1 = require("../models/unloadingDetails.model");
const orderDetails_model_1 = require("../models/orderDetails.model");
const getDeliveryAddressByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield deliveryAddress_model_1.DeliveryAddress.find({ userId: userId });
        return result;
    }
    catch (e) {
        throw e;
    }
});
exports.getDeliveryAddressByUserId = getDeliveryAddressByUserId;
const deleteDeliveryAddressData = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documentId = new mongoose_1.default.Types.ObjectId(id);
        yield deliveryAddress_model_1.DeliveryAddress.deleteOne({ _id: documentId });
        return;
    }
    catch (e) {
        throw e;
    }
});
exports.deleteDeliveryAddressData = deleteDeliveryAddressData;
const addDeliveryAddressData = (bodyData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newData = new deliveryAddress_model_1.DeliveryAddress(bodyData);
        yield newData.save();
    }
    catch (e) {
        throw e;
    }
});
exports.addDeliveryAddressData = addDeliveryAddressData;
const updateDeliveryAddressData = (bodyData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const documentId = new mongoose_1.default.Types.ObjectId((_a = bodyData === null || bodyData === void 0 ? void 0 : bodyData._id) === null || _a === void 0 ? void 0 : _a.toString());
        const result = yield deliveryAddress_model_1.DeliveryAddress.findByIdAndUpdate(documentId, bodyData, {
            new: true,
            runValidators: true
        });
        return result;
    }
    catch (e) {
        throw e;
    }
});
exports.updateDeliveryAddressData = updateDeliveryAddressData;
const addTrackingData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newData = new trackingDetails_model_1.TrackingDetails(data);
        yield newData.save();
        return;
    }
    catch (e) {
        throw e;
    }
});
exports.addTrackingData = addTrackingData;
const updateOrderStatusData = (orderId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documentId = new mongoose_1.default.Types.ObjectId(orderId);
        yield order_model_1.Order.updateOne({ _id: documentId }, { $set: {
                status: status,
            } }, { upsert: true });
        return;
    }
    catch (e) {
        throw e;
    }
});
exports.updateOrderStatusData = updateOrderStatusData;
const updateTrackingDetail = (bodyData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const documentId = new mongoose_1.default.Types.ObjectId((_a = bodyData === null || bodyData === void 0 ? void 0 : bodyData._id) === null || _a === void 0 ? void 0 : _a.toString());
        const result = yield (trackingDetails_model_1.TrackingDetails === null || trackingDetails_model_1.TrackingDetails === void 0 ? void 0 : trackingDetails_model_1.TrackingDetails.findByIdAndUpdate(documentId, bodyData, {
            new: true,
            runValidators: true
        }));
        return result;
    }
    catch (e) {
        throw e;
    }
});
exports.updateTrackingDetail = updateTrackingDetail;
const insertUnloadingData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newData = new unloadingDetails_model_1.UnloadingDetails(data);
        yield newData.save();
    }
    catch (e) {
        throw e;
    }
});
exports.insertUnloadingData = insertUnloadingData;
const addOrderData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newData = new order_model_1.Order(data);
        yield newData.save();
        return newData._id;
    }
    catch (e) {
        throw e;
    }
});
exports.addOrderData = addOrderData;
const addOrderDetailsData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        for (const item of (_a = data === null || data === void 0 ? void 0 : data.product) !== null && _a !== void 0 ? _a : []) {
            const newData = new orderDetails_model_1.OrderDetails({ productId: item === null || item === void 0 ? void 0 : item.id, userId: data === null || data === void 0 ? void 0 : data.userId, orderId: data === null || data === void 0 ? void 0 : data.orderId, qty: item === null || item === void 0 ? void 0 : item.qty, totalPrice: (item === null || item === void 0 ? void 0 : item.qty) * (item === null || item === void 0 ? void 0 : item.price) }); // Assuming your model has a field named 'data'
            yield newData.save();
        }
        return;
    }
    catch (e) {
        throw e;
    }
});
exports.addOrderDetailsData = addOrderDetailsData;
const getOrderData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield order_model_1.Order.aggregate([
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
    }
    catch (e) {
        throw e;
    }
});
exports.getOrderData = getOrderData;
const getOrderDetailsData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield orderDetails_model_1.OrderDetails.aggregate([
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
    }
    catch (e) {
        throw e;
    }
});
exports.getOrderDetailsData = getOrderDetailsData;
const getTrackingData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield trackingDetails_model_1.TrackingDetails.find();
        return result;
    }
    catch (e) {
        throw e;
    }
});
exports.getTrackingData = getTrackingData;
const getUnloadingData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield unloadingDetails_model_1.UnloadingDetails.find();
        return result;
    }
    catch (e) {
        throw e;
    }
});
exports.getUnloadingData = getUnloadingData;
const getOrderDataByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield order_model_1.Order.aggregate([
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
    }
    catch (e) {
        throw e;
    }
});
exports.getOrderDataByUser = getOrderDataByUser;
const getOrderDetailsDataByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield orderDetails_model_1.OrderDetails.aggregate([
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
    }
    catch (e) {
        throw e;
    }
});
exports.getOrderDetailsDataByUser = getOrderDetailsDataByUser;
