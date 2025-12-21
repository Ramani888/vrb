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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWishlist = exports.removeWishlist = exports.addWishlist = void 0;
const http_status_codes_1 = require("http-status-codes");
const wishlist_service_1 = require("../services/wishlist.service");
const product_service_1 = require("../services/product.service");
const addWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const bodyData = req.body;
    try {
        const ProductDetailsData = yield (0, wishlist_service_1.getProductDetailsByUserId)(bodyData === null || bodyData === void 0 ? void 0 : bodyData.productId, bodyData === null || bodyData === void 0 ? void 0 : bodyData.userId);
        if ((_a = ProductDetailsData[0]) === null || _a === void 0 ? void 0 : _a.isWishlist) {
            res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "The product has already saved in your favorite list." });
            return;
        }
        yield (0, wishlist_service_1.addWishlistData)(bodyData);
        yield (0, product_service_1.updateProductWishlistFlag)(bodyData === null || bodyData === void 0 ? void 0 : bodyData.productId, bodyData === null || bodyData === void 0 ? void 0 : bodyData.userId, true);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "The product has saved successfully in your favorite list." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.addWishlist = addWishlist;
const removeWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, userId } = req.query;
    try {
        yield (0, wishlist_service_1.removeWishlistData)(productId, userId);
        yield (0, product_service_1.updateProductWishlistFlag)(productId, userId, false);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Product remove from wishlist." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.removeWishlist = removeWishlist;
const getWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        const result = yield (0, wishlist_service_1.getWishlistData)(userId);
        const finalResult = result === null || result === void 0 ? void 0 : result.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            const productDetails = yield (0, wishlist_service_1.getProductDetailsByUserId)((_a = item === null || item === void 0 ? void 0 : item.product) === null || _a === void 0 ? void 0 : _a._id, userId);
            return Object.assign(Object.assign({}, item), { product: Object.assign(Object.assign({}, item === null || item === void 0 ? void 0 : item.product), { isWishlist: ((_b = productDetails[0]) === null || _b === void 0 ? void 0 : _b.isWishlist) ? true : false, isCart: ((_c = productDetails[0]) === null || _c === void 0 ? void 0 : _c.isCart) ? true : false }) });
        }));
        const data = yield Promise.all(finalResult);
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getWishlist = getWishlist;
