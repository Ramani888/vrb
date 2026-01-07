"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchProductValidation = exports.updateProductRewardValidation = exports.updateProductDiscountValidation = exports.updateProductPramotionFlagValidation = exports.deleteProductValidation = exports.getProductByIdValidation = exports.getProductByCategoryIdValidation = exports.updateProductActionValidation = exports.getPramotionProductValidation = exports.getAllProductValidation = exports.updateProductValidation = exports.addProductValidation = void 0;
exports.addProductValidation = {
    categoryId: 'required|string',
    name: 'required|string',
    code: 'required|string',
    price: 'required|numeric',
    mrp: 'required|numeric',
    qty: 'required|numeric',
    gst: 'required|string',
    inSuratCityCharge: 'required|numeric',
    inGujratStateCharge: 'required|numeric',
    inOutStateCharge: 'required|numeric',
    productBaseMetalId: 'string',
    productPlatingId: 'string',
    productStoneTypeId: 'string',
    productTrendId: 'string',
    productBrandId: 'string',
    productColorId: 'string',
    productOccasionId: 'string',
    productTypeId: 'string',
    size: 'string',
    weight: 'numeric',
    description: 'string',
    isPramotion: 'boolean',
    isPause: 'boolean',
    discount: 'numeric',
    reward: 'numeric'
};
exports.updateProductValidation = {
    _id: 'required|string',
    categoryId: 'string',
    name: 'string',
    code: 'string',
    price: 'numeric',
    mrp: 'numeric',
    qty: 'numeric',
    gst: 'string',
    inSuratCityCharge: 'numeric',
    inGujratStateCharge: 'numeric',
    inOutStateCharge: 'numeric',
    productBaseMetalId: 'string',
    productPlatingId: 'string',
    productStoneTypeId: 'string',
    productTrendId: 'string',
    productBrandId: 'string',
    productColorId: 'string',
    productOccasionId: 'string',
    productTypeId: 'string',
    size: 'string',
    weight: 'numeric',
    description: 'string',
    isPramotion: 'boolean',
    isPause: 'boolean',
    discount: 'numeric',
    reward: 'numeric'
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
