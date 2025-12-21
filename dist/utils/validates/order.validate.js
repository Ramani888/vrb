"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusValidation = exports.getOrderByUserValidation = exports.checkRazorpayOrderValidation = exports.addRazorpayOrderValidation = exports.addOrderValidation = exports.addUnloadingDetailsValidation = exports.insertDeviceTokenValidation = exports.updateNotificationStatusValidation = exports.getNotificationCountValidation = exports.getNotificationValidation = exports.sendPushNotificationValidation = exports.updateTrackingDetailsValidation = exports.addTrackingDetailsValidation = void 0;
exports.addTrackingDetailsValidation = {
    trackingId: 'required|string',
    orderId: 'required|string',
    packingId: 'required|string'
};
exports.updateTrackingDetailsValidation = {
    _id: 'required|string'
};
exports.sendPushNotificationValidation = {
    title: 'required|string',
    body: 'required|string',
    imageUrl: 'required|string'
};
exports.getNotificationValidation = {
    userId: 'required|string'
};
exports.getNotificationCountValidation = {
    userId: 'required|string'
};
exports.updateNotificationStatusValidation = {
    status: 'required|boolean',
    notificationId: 'required|string'
};
exports.insertDeviceTokenValidation = {
    token: 'required|string',
    userId: 'required|string'
};
exports.addUnloadingDetailsValidation = {
    orderId: 'required|string'
};
exports.addOrderValidation = {
    paymentId: 'string',
    userId: 'required|string',
    totalAmount: 'required|numeric',
    product: 'required|array'
};
exports.addRazorpayOrderValidation = {
    amount: 'required|numeric'
};
exports.checkRazorpayOrderValidation = {
    order_id: 'required|string'
};
exports.getOrderByUserValidation = {
    userId: 'required|string'
};
exports.updateOrderStatusValidation = {
    orderId: 'required|string',
    status: 'required|string'
};
