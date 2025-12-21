"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBannerValidation = exports.updateBannerValidation = exports.addBannerValidation = void 0;
exports.addBannerValidation = {
    name: 'required|string'
};
exports.updateBannerValidation = {
    _id: 'required|string'
};
exports.deleteBannerValidation = {
    bannerId: 'required|string'
};
