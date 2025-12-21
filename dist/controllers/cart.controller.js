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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartCount = exports.updateCart = exports.getCart = exports.removeToCart = exports.addToCart = void 0;
const http_status_codes_1 = require("http-status-codes");
const product_service_1 = require("../services/product.service");
const wishlist_service_1 = require("../services/wishlist.service");
const cart_service_1 = require("../services/cart.service");
const user_service_1 = require("../services/user.service");
const global_1 = require("../utils/helpers/global");
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const bodyData = req.body;
    try {
        const ProductData = yield (0, product_service_1.getProductDataById)(bodyData === null || bodyData === void 0 ? void 0 : bodyData.productId);
        const ProductDetailsData = yield (0, wishlist_service_1.getProductDetailsByUserId)(bodyData === null || bodyData === void 0 ? void 0 : bodyData.productId, bodyData === null || bodyData === void 0 ? void 0 : bodyData.userId);
        if ((_a = ProductDetailsData[0]) === null || _a === void 0 ? void 0 : _a.isCart) {
            res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "The product has already added in your cart list" });
            return;
        }
        yield (0, cart_service_1.addToCartData)(Object.assign(Object.assign({}, bodyData), { total: (bodyData === null || bodyData === void 0 ? void 0 : bodyData.qty) * ProductData[0].price }));
        yield (0, product_service_1.updateProductCartFlag)(bodyData === null || bodyData === void 0 ? void 0 : bodyData.productId, bodyData === null || bodyData === void 0 ? void 0 : bodyData.userId, true);
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "The product has added successfully in your cart list." });
    }
    catch (err) {
        console.error(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
});
exports.addToCart = addToCart;
const removeToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, userId } = req.query;
    try {
        yield (0, cart_service_1.removeToCartData)(productId, userId);
        yield (0, product_service_1.updateProductCartFlag)(productId, userId, false);
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Product remove from cart." });
    }
    catch (err) {
        console.error(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
});
exports.removeToCart = removeToCart;
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId } = req.query;
    try {
        const result = yield (0, cart_service_1.getCartData)(userId);
        let userData = yield (0, user_service_1.getUserDataById)(userId);
        if (!userData) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({ error: 'User data not found.' });
            return;
        }
        const finalResult = yield Promise.all((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const productDetails = yield (0, wishlist_service_1.getProductDetailsByUserId)((_a = item === null || item === void 0 ? void 0 : item.product) === null || _a === void 0 ? void 0 : _a._id, userId);
            const _e = item === null || item === void 0 ? void 0 : item.product, { gst } = _e, rest = __rest(_e, ["gst"]);
            return Object.assign(Object.assign({}, item), { product: Object.assign(Object.assign(Object.assign({}, rest), { isWishlist: ((_b = productDetails[0]) === null || _b === void 0 ? void 0 : _b.isWishlist) || false, isCart: ((_c = productDetails[0]) === null || _c === void 0 ? void 0 : _c.isCart) || false, deliveryCharge: (_d = (0, global_1.checkUserLocationAndGetDeliveryCharge)(userData, item === null || item === void 0 ? void 0 : item.product)) !== null && _d !== void 0 ? _d : 0 }), (gst
                    ? (0, global_1.checkUserGujratState)(userData, item === null || item === void 0 ? void 0 : item.product)
                        ? { gst: Number(gst) }
                        : { sgst: Number(gst) / 2, igst: Number(gst) / 2 }
                    : {})) });
        })));
        let totalDeliveryCharge = 0;
        if ((result === null || result === void 0 ? void 0 : result.totalWeight) <= 499) {
            totalDeliveryCharge = 70;
        }
        else if ((result === null || result === void 0 ? void 0 : result.totalWeight) > 499 && (result === null || result === void 0 ? void 0 : result.totalWeight) <= 999) {
            totalDeliveryCharge = 140;
        }
        else if ((result === null || result === void 0 ? void 0 : result.totalWeight) > 999) {
            totalDeliveryCharge = 210;
        }
        res.status(http_status_codes_1.StatusCodes.OK).send({
            data: {
                data: finalResult,
                totalAmount: result === null || result === void 0 ? void 0 : result.totalAmount,
                totalQty: result === null || result === void 0 ? void 0 : result.totalQty,
                totalDeliveryCharge: totalDeliveryCharge
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
});
exports.getCart = getCart;
const updateCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, userId, qty } = req === null || req === void 0 ? void 0 : req.body;
    try {
        const data = yield (0, product_service_1.getProductDataById)(productId);
        yield (0, cart_service_1.updateCartData)(productId, userId, qty, data[0].price);
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Product qty updated." });
    }
    catch (err) {
        console.error(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
});
exports.updateCart = updateCart;
const getCartCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        const data = yield (0, cart_service_1.getCartCountData)(userId);
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getCartCount = getCartCount;
