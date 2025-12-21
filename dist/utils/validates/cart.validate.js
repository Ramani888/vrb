"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartCountValidation = exports.updateCartValidation = exports.getCartValidation = exports.removeCartValidation = exports.addToCartValidation = void 0;
exports.addToCartValidation = {
    productId: 'required|string',
    userId: 'required|string',
    qty: 'required|numeric'
};
exports.removeCartValidation = {
    productId: 'required|string',
    userId: 'required|string'
};
exports.getCartValidation = {
    userId: 'required|string'
};
exports.updateCartValidation = {
    productId: 'required|string',
    userId: 'required|string',
    qty: 'required|numeric'
};
exports.getCartCountValidation = {
    userId: 'required|string'
};
