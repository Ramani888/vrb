"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryValidation = exports.getCategoryByIdValidation = exports.updateCategoryValidation = exports.addCategoryValidation = void 0;
exports.addCategoryValidation = {
    name: 'required|string'
};
exports.updateCategoryValidation = {
    _id: 'required|string'
};
exports.getCategoryByIdValidation = {
    categoryId: 'required|string'
};
exports.deleteCategoryValidation = {
    categoryId: 'required|string'
};
