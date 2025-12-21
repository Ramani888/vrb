"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentMethodValidation = exports.getPaymentValidation = exports.addCapturePaymentValidation = exports.getRewardDataValidation = exports.updateUserStatusValidation = exports.deleteUserValidation = exports.getUserByIdValidation = exports.updateUserValidation = exports.adminLoginValidation = exports.loginValidation = exports.registerLoginValidation = exports.registerValidation = void 0;
exports.registerValidation = {
    mobileNumber: 'required|numeric',
    country: 'required|string',
    state: 'required|string',
    city: 'required|string',
    pinCode: 'required|numeric',
    password: 'required|string',
};
exports.registerLoginValidation = {
    mobileNumber: 'required|numeric',
    country: 'required|string',
    state: 'required|string',
    city: 'required|string',
    pinCode: 'required|numeric'
};
exports.loginValidation = {
    mobileNumber: 'required|numeric',
    password: 'required|string',
};
exports.adminLoginValidation = {
    email: 'required|email',
    password: 'required|string',
};
exports.updateUserValidation = {
    _id: 'required|string'
};
exports.getUserByIdValidation = {
    userId: 'required|string'
};
exports.deleteUserValidation = {
    userId: 'required|string'
};
exports.updateUserStatusValidation = {
    _id: 'required|string',
    isActive: 'required|boolean'
};
exports.getRewardDataValidation = {
    userId: 'required|string'
};
exports.addCapturePaymentValidation = {
    paymentId: 'required|string',
    payment: 'required|numeric'
};
exports.getPaymentValidation = {
    paymentId: 'required|string'
};
exports.updatePaymentMethodValidation = {
    isCashOnDelivery: 'required|boolean'
};
