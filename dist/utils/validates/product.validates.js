"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchProductValidation = exports.updateProductRewardValidation = exports.updateProductDiscountValidation = exports.updateProductPramotionFlagValidation = exports.deleteProductValidation = exports.getProductByIdValidation = exports.getProductByCategoryIdValidation = exports.updateProductActionValidation = exports.getPramotionProductValidation = exports.getAllProductValidation = exports.updateProductValidation = exports.addProductValidation = void 0;
exports.addProductValidation = {
    categoryId: 'required|string',
    productBaseMetalId: 'required|string',
    productPlatingId: 'required|string',
    productStoneTypeId: 'required|string',
    productTrendId: 'required|string',
    name: 'required|string',
    image: 'required|array',
    code: 'required|string',
    price: 'required|numeric',
    mrp: 'required|numeric',
    qty: 'required|numeric',
    inSuratCityCharge: 'required|numeric',
    inGujratStateCharge: 'required|numeric',
    inOutStateCharge: 'required|numeric',
    isPramotion: 'boolean',
    isPause: 'boolean'
};
exports.updateProductValidation = {
    _id: 'required|string'
};
exports.getAllProductValidation = {
    userId: 'string'
};
exports.getPramotionProductValidation = {
    userId: 'string'
};
exports.updateProductActionValidation = {
    productId: 'required|string'
};
exports.getProductByCategoryIdValidation = {
    userId: 'string',
    categoryId: 'required|string'
};
exports.getProductByIdValidation = {
    userId: 'string',
    productId: 'required|string'
};
exports.deleteProductValidation = {
    productId: 'required|string'
};
exports.updateProductPramotionFlagValidation = {
    _id: 'required|string',
    isPramotion: 'required|boolean'
};
exports.updateProductDiscountValidation = {
    _id: 'required|string',
    discount: 'required|numeric'
};
exports.updateProductRewardValidation = {
    _id: 'required|string',
    reward: 'required|numeric'
};
exports.getSearchProductValidation = {
    userId: 'required|string',
    search: 'required|string'
};
