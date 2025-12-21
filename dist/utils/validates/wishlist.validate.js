"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWishlistValidation = exports.removeWishlistValidation = exports.addWishlistValidation = void 0;
exports.addWishlistValidation = {
    productId: 'required|string',
    userId: 'required|string'
};
exports.removeWishlistValidation = {
    productId: 'required|string',
    userId: 'required|string'
};
exports.getWishlistValidation = {
    userId: 'required|string'
};
