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
exports.updateOrderStatus = exports.getOrderByUser = exports.getOrder = exports.getOrderPaymentStatus = exports.createRazorpayOrder = exports.addOrder = exports.getPayment = exports.refundPayment = exports.capturePayment = exports.insertUnloading = exports.insertUnloadingVideo = exports.insertUnloadingImage = exports.updateTracking = exports.addTracking = exports.getDeliveryAddress = exports.updateDeliveryAddress = exports.deleteDeliveryAddress = exports.addDeliveryAddress = void 0;
const http_status_codes_1 = require("http-status-codes");
const order_service_1 = require("../services/order.service");
const storage_1 = require("firebase/storage");
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("firebase/app");
const firbase_config_1 = __importDefault(require("../config/firbase.config"));
const global_1 = require("../utils/helpers/global");
const axios_1 = __importDefault(require("axios"));
const razorpay_1 = __importDefault(require("razorpay"));
const reward_service_1 = require("../services/reward.service");
const cart_service_1 = require("../services/cart.service");
const product_service_1 = require("../services/product.service");
const razorpayOrder_model_1 = require("../models/razorpayOrder.model");
dotenv_1.default.config();
const firebaseApp = (0, app_1.initializeApp)(firbase_config_1.default.firebaseConfig);
const storage = (0, storage_1.getStorage)();
const razorpay = new razorpay_1.default({
    key_id: 'rzp_live_g5FHxyE0FQivlu',
    key_secret: 'C14bmIZD7SMjU4cZ0GjrID7g',
});
const addDeliveryAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const bodyData = req.body;
    try {
        const isAddressExist = yield (0, order_service_1.getDeliveryAddressByUserId)(bodyData === null || bodyData === void 0 ? void 0 : bodyData.userId);
        if (isAddressExist.length > 0) {
            yield (0, order_service_1.deleteDeliveryAddressData)((_b = (_a = isAddressExist[0]) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString());
        }
        yield (0, order_service_1.addDeliveryAddressData)(Object.assign({}, bodyData));
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Delivery address added successfully." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.addDeliveryAddress = addDeliveryAddress;
const deleteDeliveryAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        yield (0, order_service_1.deleteDeliveryAddressData)(id);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Delivery address data deleted." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.deleteDeliveryAddress = deleteDeliveryAddress;
const updateDeliveryAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyData = req.body;
    try {
        yield (0, order_service_1.updateDeliveryAddressData)(bodyData);
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Delivery address data updated." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.updateDeliveryAddress = updateDeliveryAddress;
const getDeliveryAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        const deliveryAddressData = yield (0, order_service_1.getDeliveryAddressByUserId)(userId);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ deliveryAddressData });
    }
    catch (e) {
        console.log(e);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ e });
    }
});
exports.getDeliveryAddress = getDeliveryAddress;
const addTracking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyData = req.body;
    try {
        yield (0, order_service_1.addTrackingData)(Object.assign({}, bodyData));
        yield (0, order_service_1.updateOrderStatusData)(bodyData === null || bodyData === void 0 ? void 0 : bodyData.orderId, 'Shipped');
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Tracking detail inserted." });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
});
exports.addTracking = addTracking;
const updateTracking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyData = req.body;
    try {
        if (bodyData === null || bodyData === void 0 ? void 0 : bodyData.deleteVideo) {
            const fileRef = (0, storage_1.ref)(storage, bodyData === null || bodyData === void 0 ? void 0 : bodyData.deleteVideo);
            yield (0, storage_1.deleteObject)(fileRef);
        }
        yield (0, order_service_1.updateTrackingDetail)(Object.assign({}, bodyData));
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Tracking data updated." });
    }
    catch (e) {
        console.log(e);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ e });
    }
});
exports.updateTracking = updateTracking;
const insertUnloadingImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    try {
        if (!file) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: 'Image file is missing.' });
            return;
        }
        const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.key}`;
        res.status(http_status_codes_1.StatusCodes.OK).send({ imageUrl });
    }
    catch (err) {
        console.error(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.insertUnloadingImage = insertUnloadingImage;
const insertUnloadingVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: 'Video file is missing.' });
            return;
        }
        const videoUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.key}`;
        res.status(http_status_codes_1.StatusCodes.OK).send({ videoUrl });
    }
    catch (err) {
        console.error(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.insertUnloadingVideo = insertUnloadingVideo;
const insertUnloading = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyData = req.body;
    try {
        yield (0, order_service_1.insertUnloadingData)(bodyData);
        yield (0, order_service_1.updateOrderStatusData)(bodyData === null || bodyData === void 0 ? void 0 : bodyData.orderId, 'Delivered');
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Order unloadin details upload successfully." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.insertUnloading = insertUnloading;
const capturePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { paymentId, payment } = req.body;
        const url = `https://${global_1.RAZOR_PAY_KEY_ID}:${global_1.RAZOR_PAY_KEY_SECRET}@api.razorpay.com/v1/payments/${paymentId}/capture`;
        const data = {
            amount: payment * 100,
            currency: 'INR',
        };
        const response = yield axios_1.default.post(url, data, {
            auth: {
                username: global_1.RAZOR_PAY_KEY_ID,
                password: global_1.RAZOR_PAY_KEY_SECRET,
            },
        });
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Payment capture successfully." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.capturePayment = capturePayment;
const refundPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { paymentId, payment } = req.body;
        const razorpay = new razorpay_1.default({
            key_id: global_1.RAZOR_PAY_KEY_ID,
            key_secret: global_1.RAZOR_PAY_KEY_SECRET,
        });
        // Fetch payment details
        const paymentDetails = yield razorpay.payments.fetch(paymentId);
        //Before capture payment
        const url = `https://${global_1.RAZOR_PAY_KEY_ID}:${global_1.RAZOR_PAY_KEY_SECRET}@api.razorpay.com/v1/payments/${paymentId}/capture`;
        const data = {
            amount: payment * 100,
            currency: 'INR',
        };
        if ((paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.status) === 'refunded' || (paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.status) === 'failed') {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ success: false, message: "Payment already refunded or failed." });
        }
        else if ((paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.status) !== 'captured') {
            const resCapture = yield axios_1.default.post(url, data, {
                auth: {
                    username: global_1.RAZOR_PAY_KEY_ID,
                    password: global_1.RAZOR_PAY_KEY_SECRET,
                },
            });
        }
        // Calculate the refund amount as 80% of the payment amount
        const amount = Number((payment * 80) / 100).toFixed(2);
        const refundData = {
            amount: Number(amount) * 100,
            speed: 'normal',
            notes: {
                notes_key_1: "Beam me up Scotty.",
                notes_key_2: "Engage"
            },
            receipt: `Receipt_${paymentId}_${Date.now()}`, // Make receipt unique
        };
        // console.log(`Refund Request Data: ${JSON.stringify(refundData)}`);
        const response = yield razorpay.payments.refund(paymentId, refundData);
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Payment refunded successfully." });
    }
    catch (err) {
        console.error('err', err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.refundPayment = refundPayment;
const getPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { paymentId } = req.query;
        const razorpay = new razorpay_1.default({
            key_id: global_1.RAZOR_PAY_KEY_ID,
            key_secret: global_1.RAZOR_PAY_KEY_SECRET,
        });
        const data = yield razorpay.payments.fetch(paymentId);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.error(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getPayment = getPayment;
const addOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const bodyData = req.body;
    try {
        const deliveryAddressData = yield (0, order_service_1.getDeliveryAddressByUserId)(bodyData === null || bodyData === void 0 ? void 0 : bodyData.userId);
        const orderId = yield (0, order_service_1.addOrderData)(Object.assign(Object.assign({}, bodyData), { deliveryAddressId: (_b = (_a = deliveryAddressData[0]) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString() }));
        yield (0, order_service_1.addOrderDetailsData)(Object.assign(Object.assign({}, bodyData), { orderId: orderId }));
        const totalReward = (_c = bodyData === null || bodyData === void 0 ? void 0 : bodyData.product) === null || _c === void 0 ? void 0 : _c.reduce((accumulator, item) => {
            return accumulator + (item === null || item === void 0 ? void 0 : item.reward);
        }, 0);
        const rewardData = {
            userId: bodyData === null || bodyData === void 0 ? void 0 : bodyData.userId,
            orderId: orderId === null || orderId === void 0 ? void 0 : orderId.toString(),
            reward: totalReward,
            isEarned: true
        };
        yield (0, reward_service_1.addRewardData)(rewardData);
        if (bodyData === null || bodyData === void 0 ? void 0 : bodyData.isWallet) {
            const totalRedeemReward = bodyData === null || bodyData === void 0 ? void 0 : bodyData.wallet;
            const rewardData = {
                userId: bodyData === null || bodyData === void 0 ? void 0 : bodyData.userId,
                orderId: orderId === null || orderId === void 0 ? void 0 : orderId.toString(),
                reward: totalRedeemReward,
                isRedeemed: true
            };
            yield (0, reward_service_1.addRewardData)(rewardData);
        }
        (_d = bodyData === null || bodyData === void 0 ? void 0 : bodyData.product) === null || _d === void 0 ? void 0 : _d.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, cart_service_1.removeToCartData)(item === null || item === void 0 ? void 0 : item.id, bodyData === null || bodyData === void 0 ? void 0 : bodyData.userId);
            yield (0, product_service_1.updateProductCartFlag)(item === null || item === void 0 ? void 0 : item.id, bodyData === null || bodyData === void 0 ? void 0 : bodyData.userId, false);
        }));
        return res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Order completed successfully." });
    }
    catch (e) {
        console.log(e);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ e });
    }
});
exports.addOrder = addOrder;
const createRazorpayOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, currency = 'INR', receipt } = req.body;
    try {
        const options = {
            amount: amount * 100, // amount in paise
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
        };
        const order = yield razorpay.orders.create(options);
        // Save to MongoDB
        yield razorpayOrder_model_1.RazorpayOrder.create({
            razorpayOrderId: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            status: order.status,
        });
        res.status(200).json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Order creation failed', details: error });
    }
});
exports.createRazorpayOrder = createRazorpayOrder;
const getOrderPaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order_id } = req.query;
        const payments = yield razorpay.orders.fetchPayments(order_id);
        // if (payments.items.length > 0) {
        //   const payment = payments.items[0];
        //   if (payment.status === 'captured' || payment.status === 'authorized') {
        //     return res.status(200).json({ success: true, payment });
        //   } else {
        //     return res.status(200).json({ success: false, status: payment.status });
        //   }
        // } else {
        //   return res.status(200).json({ success: false, message: 'No payments found yet' });
        // }
        // Find the order in your MongoDB database
        const order = yield razorpayOrder_model_1.RazorpayOrder.findOne({ razorpayOrderId: order_id });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found in database" });
        }
        // const paidPayment = payments.items.find((p) => p.status === "captured" || p.status === "authorized");
        if (((order === null || order === void 0 ? void 0 : order.status) === "captured" || (order === null || order === void 0 ? void 0 : order.status) === "authorized") && (order === null || order === void 0 ? void 0 : order.paymentId)) {
            res.json({ status: "paid", payment_id: order === null || order === void 0 ? void 0 : order.paymentId });
        }
        else {
            res.json({ status: "pending" });
        }
    }
    catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});
exports.getOrderPaymentStatus = getOrderPaymentStatus;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderData = yield (0, order_service_1.getOrderData)(); // Assuming getOrderData() retrieves order data
        const orderDetailsData = yield (0, order_service_1.getOrderDetailsData)(); // Assuming getOrderDetailsData() retrieves order details data
        const trackingData = yield (0, order_service_1.getTrackingData)();
        const unloadingData = yield (0, order_service_1.getUnloadingData)();
        // Map through order data and find associated product details
        const data = orderData === null || orderData === void 0 ? void 0 : orderData.map((order) => {
            const findProductDetails = orderDetailsData === null || orderDetailsData === void 0 ? void 0 : orderDetailsData.filter((detailsData) => String(detailsData.orderId) === String(order._id));
            const findTrackingDetails = trackingData === null || trackingData === void 0 ? void 0 : trackingData.find((detailsData) => String(detailsData.orderId) === String(order._id));
            const findUnloadingData = unloadingData === null || unloadingData === void 0 ? void 0 : unloadingData.find((detailsData) => String(detailsData.orderId) === String(order._id));
            return Object.assign(Object.assign({}, order), { productDetails: findProductDetails, trackingDetails: findTrackingDetails, unloadingDetails: findUnloadingData });
        });
        return res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
});
exports.getOrder = getOrder;
const getOrderByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        const orderData = yield (0, order_service_1.getOrderDataByUser)(userId); // Assuming getOrderData() retrieves order data
        const orderDetailsData = yield (0, order_service_1.getOrderDetailsDataByUser)(userId); // Assuming getOrderDetailsData() retrieves order details data
        const trackingData = yield (0, order_service_1.getTrackingData)();
        const unloadingData = yield (0, order_service_1.getUnloadingData)();
        // Map through order data and find associated product details
        const data = orderData === null || orderData === void 0 ? void 0 : orderData.map((order) => {
            const findProductDetails = orderDetailsData === null || orderDetailsData === void 0 ? void 0 : orderDetailsData.filter((detailsData) => String(detailsData.orderId) === String(order._id));
            const findTrackingDetails = trackingData === null || trackingData === void 0 ? void 0 : trackingData.find((detailsData) => String(detailsData.orderId) === String(order._id));
            const findUnloadingData = unloadingData === null || unloadingData === void 0 ? void 0 : unloadingData.find((detailsData) => String(detailsData.orderId) === String(order._id));
            return Object.assign(Object.assign({}, order), { productDetails: findProductDetails, trackingDetails: findTrackingDetails, unloadingDetails: findUnloadingData });
        });
        return res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
});
exports.getOrderByUser = getOrderByUser;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, status } = req.query;
    try {
        yield (0, order_service_1.updateOrderStatusData)(orderId, status);
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Order status updated." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.updateOrderStatus = updateOrderStatus;
