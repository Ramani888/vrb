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
exports.getSearchProduct = exports.getProductType = exports.getProductTrend = exports.getProductStoneType = exports.getProductPlating = exports.getProductOccasion = exports.getProductColor = exports.getProductBrand = exports.getProductBaseMetal = exports.updateProductAction = exports.getProductUnderten = exports.getProductUnderFive = exports.getProductUnderThree = exports.getProductUnderTwo = exports.getPramotionProduct = exports.updateProductReward = exports.updateProductDiscount = exports.updateProductPramotionFlag = exports.deleteProduct = exports.getProductById = exports.getProductByCategoryId = exports.getAllProduct = exports.updateProduct = exports.addProduct = void 0;
const http_status_codes_1 = require("http-status-codes");
const product_service_1 = require("../services/product.service");
const category_service_1 = require("../services/category.service");
const deviceToken_model_1 = require("../models/deviceToken.model");
const notification_service_1 = require("../services/notification.service");
const notification_controller_1 = require("./notification.controller");
const global_1 = require("../utils/helpers/global");
const user_service_1 = require("../services/user.service");
const wishlist_service_1 = require("../services/wishlist.service");
const cart_service_1 = require("../services/cart.service");
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const files = req.files;
        const bodyData = req.body;
        // Validate minimum 2 images
        if (!(files === null || files === void 0 ? void 0 : files.image) || files.image.length < 2) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
                success: false,
                message: "Please select minimum two images."
            });
        }
        // Prepare image data with VPS paths
        const imageData = files.image.map((file) => ({
            path: `${process.env.APP_URL}/uploads/images/${file.filename}`
        }));
        // Prepare video data
        const videoPath = (files === null || files === void 0 ? void 0 : files.video) && files.video.length > 0
            ? `${process.env.APP_URL}/uploads/videos/${files.video[0].filename}`
            : undefined;
        // Prepare product data
        const productData = {
            categoryId: bodyData.categoryId,
            name: bodyData.name,
            code: bodyData.code,
            price: Number(bodyData.price),
            mrp: Number(bodyData.mrp),
            qty: Number(bodyData.qty),
            gst: bodyData.gst,
            inSuratCityCharge: Number(bodyData.inSuratCityCharge),
            inGujratStateCharge: Number(bodyData.inGujratStateCharge),
            inOutStateCharge: Number(bodyData.inOutStateCharge),
            image: imageData,
            videoPath: videoPath,
            isPause: bodyData.isPause === 'true' || bodyData.isPause === true ? true : false,
        };
        // Add optional fields if provided
        if (bodyData.productBaseMetalId)
            productData.productBaseMetalId = bodyData.productBaseMetalId;
        if (bodyData.productPlatingId)
            productData.productPlatingId = bodyData.productPlatingId;
        if (bodyData.productStoneTypeId)
            productData.productStoneTypeId = bodyData.productStoneTypeId;
        if (bodyData.productTrendId)
            productData.productTrendId = bodyData.productTrendId;
        if (bodyData.productBrandId)
            productData.productBrandId = bodyData.productBrandId;
        if (bodyData.productColorId)
            productData.productColorId = bodyData.productColorId;
        if (bodyData.productOccasionId)
            productData.productOccasionId = bodyData.productOccasionId;
        if (bodyData.productTypeId)
            productData.productTypeId = bodyData.productTypeId;
        if (bodyData.size)
            productData.size = bodyData.size;
        if (bodyData.weight)
            productData.weight = Number(bodyData.weight);
        if (bodyData.description)
            productData.description = bodyData.description;
        if (bodyData.discount)
            productData.discount = Number(bodyData.discount);
        if (bodyData.reward)
            productData.reward = Number(bodyData.reward);
        productData.isPramotion = bodyData.isPramotion === 'true' || bodyData.isPramotion === true ? true : false;
        const productId = yield (0, product_service_1.addProductData)(productData);
        // Send notification to all users
        const categoryData = yield (0, category_service_1.getCategoryDataById)(bodyData.categoryId);
        const tokens = yield deviceToken_model_1.DeviceToken.find();
        const tokenData = tokens === null || tokens === void 0 ? void 0 : tokens.map((data) => data === null || data === void 0 ? void 0 : data.token);
        const userIds = tokens === null || tokens === void 0 ? void 0 : tokens.map((data) => data === null || data === void 0 ? void 0 : data.userId);
        userIds === null || userIds === void 0 ? void 0 : userIds.forEach((userId) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const notificationData = {
                title: (_a = categoryData[0]) === null || _a === void 0 ? void 0 : _a.name,
                subTitle: bodyData.name,
                imageUrl: (_b = imageData[0]) === null || _b === void 0 ? void 0 : _b.path,
                userId: userId,
                productId: productId,
                productName: bodyData.name
            };
            yield (0, notification_service_1.insertNotificationData)(notificationData);
        }));
        const pushNotificationData = {
            title: (_a = categoryData[0]) === null || _a === void 0 ? void 0 : _a.name,
            body: bodyData.name,
        };
        yield (0, notification_controller_1.sendBulkPushNotification)(tokenData, pushNotificationData);
        res.status(http_status_codes_1.StatusCodes.OK).send({
            success: true,
            message: "Product added successfully.",
            productId: productId
        });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: "Failed to add product.",
            error: err
        });
    }
});
exports.addProduct = addProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        const bodyData = req.body;
        if (!bodyData._id) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
                success: false,
                message: "Product ID is required."
            });
        }
        // Parse existing images if provided
        let existingImages = [];
        if (bodyData.existingImages) {
            try {
                existingImages = JSON.parse(bodyData.existingImages);
            }
            catch (e) {
                console.error("Error parsing existingImages:", e);
            }
        }
        // Parse deleted images if provided
        let deleteImages = [];
        if (bodyData.deleteImages) {
            try {
                deleteImages = JSON.parse(bodyData.deleteImages);
            }
            catch (e) {
                console.error("Error parsing deleteImages:", e);
            }
        }
        // Delete images from VPS if specified
        if (deleteImages && deleteImages.length > 0) {
            for (const deleteImageData of deleteImages) {
                if (deleteImageData === null || deleteImageData === void 0 ? void 0 : deleteImageData.path) {
                    yield (0, global_1.deleteVpsUpload)(deleteImageData.path);
                }
            }
        }
        // Handle video deletion
        if (bodyData.deleteVideo) {
            yield (0, global_1.deleteVpsUpload)(bodyData.deleteVideo);
        }
        // Prepare new images with VPS paths
        const newImages = (files === null || files === void 0 ? void 0 : files.image) ? files.image.map((file) => ({
            path: `${process.env.APP_URL}/uploads/images/${file.filename}`
        })) : [];
        // Combine existing and new images
        const allImages = [...existingImages, ...newImages];
        // Validate minimum 2 images
        if (allImages.length < 2) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
                success: false,
                message: "Please select minimum two images."
            });
        }
        // Prepare video path
        let videoPath = bodyData.existingVideo || null;
        if ((files === null || files === void 0 ? void 0 : files.video) && files.video.length > 0) {
            videoPath = `${process.env.APP_URL}/uploads/videos/${files.video[0].filename}`;
        }
        else if (bodyData.deleteVideo) {
            videoPath = null;
        }
        // Prepare update data
        const updateData = {
            _id: bodyData._id,
            image: allImages,
            videoPath: videoPath
        };
        // Update fields if provided
        if (bodyData.categoryId)
            updateData.categoryId = bodyData.categoryId;
        if (bodyData.name)
            updateData.name = bodyData.name;
        if (bodyData.code)
            updateData.code = bodyData.code;
        if (bodyData.price)
            updateData.price = Number(bodyData.price);
        if (bodyData.mrp)
            updateData.mrp = Number(bodyData.mrp);
        if (bodyData.qty)
            updateData.qty = Number(bodyData.qty);
        if (bodyData.gst)
            updateData.gst = bodyData.gst;
        if (bodyData.inSuratCityCharge !== undefined)
            updateData.inSuratCityCharge = Number(bodyData.inSuratCityCharge);
        if (bodyData.inGujratStateCharge !== undefined)
            updateData.inGujratStateCharge = Number(bodyData.inGujratStateCharge);
        if (bodyData.inOutStateCharge !== undefined)
            updateData.inOutStateCharge = Number(bodyData.inOutStateCharge);
        // Update optional fields
        if (bodyData.productBaseMetalId !== undefined)
            updateData.productBaseMetalId = bodyData.productBaseMetalId;
        if (bodyData.productPlatingId !== undefined)
            updateData.productPlatingId = bodyData.productPlatingId;
        if (bodyData.productStoneTypeId !== undefined)
            updateData.productStoneTypeId = bodyData.productStoneTypeId;
        if (bodyData.productTrendId !== undefined)
            updateData.productTrendId = bodyData.productTrendId;
        if (bodyData.productBrandId !== undefined)
            updateData.productBrandId = bodyData.productBrandId;
        if (bodyData.productColorId !== undefined)
            updateData.productColorId = bodyData.productColorId;
        if (bodyData.productOccasionId !== undefined)
            updateData.productOccasionId = bodyData.productOccasionId;
        if (bodyData.productTypeId !== undefined)
            updateData.productTypeId = bodyData.productTypeId;
        if (bodyData.size !== undefined)
            updateData.size = bodyData.size;
        if (bodyData.weight !== undefined)
            updateData.weight = Number(bodyData.weight);
        if (bodyData.description !== undefined)
            updateData.description = bodyData.description;
        if (bodyData.discount !== undefined)
            updateData.discount = Number(bodyData.discount);
        if (bodyData.reward !== undefined)
            updateData.reward = Number(bodyData.reward);
        if (bodyData.isPramotion !== undefined)
            updateData.isPramotion = bodyData.isPramotion === 'true' || bodyData.isPramotion === true ? true : false;
        if (bodyData.isPause !== undefined)
            updateData.isPause = bodyData.isPause === 'true' || bodyData.isPause === true ? true : false;
        yield (0, product_service_1.updateProductData)(updateData);
        res.status(http_status_codes_1.StatusCodes.OK).send({
            success: true,
            message: "Product updated successfully."
        });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: "Failed to update product.",
            error: err
        });
    }
});
exports.updateProduct = updateProduct;
const getAllProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        const result = yield (0, product_service_1.getAllProductData)();
        if (!userId) {
            const data = result === null || result === void 0 ? void 0 : result.map((item) => {
                return Object.assign(Object.assign({}, item === null || item === void 0 ? void 0 : item._doc), { isWishlist: false, isCart: false, deliveryCharge: 0 });
            });
            return res.status(http_status_codes_1.StatusCodes.OK).send({ data });
        }
        const userData = yield (0, user_service_1.getUserDataById)(userId);
        if (!userData) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: 'user data not found.' });
            return;
        }
        const finalResult = result === null || result === void 0 ? void 0 : result.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const productDetails = yield (0, product_service_1.getProductDetailsByUserId)((_a = item === null || item === void 0 ? void 0 : item._id) === null || _a === void 0 ? void 0 : _a.toString(), userId);
            const _e = item === null || item === void 0 ? void 0 : item._doc, { gst } = _e, rest = __rest(_e, ["gst"]);
            return Object.assign(Object.assign(Object.assign({}, rest), { isWishlist: ((_b = productDetails[0]) === null || _b === void 0 ? void 0 : _b.isWishlist) ? true : false, isCart: ((_c = productDetails[0]) === null || _c === void 0 ? void 0 : _c.isCart) ? true : false, deliveryCharge: (_d = (0, global_1.checkUserLocationAndGetDeliveryCharge)(userData, item)) !== null && _d !== void 0 ? _d : 0 }), ((item === null || item === void 0 ? void 0 : item.gst) ? (0, global_1.checkUserGujratState)(userData, item) ? { gst: Number(item === null || item === void 0 ? void 0 : item.gst) } : { sgst: Number(item === null || item === void 0 ? void 0 : item.gst) / 2, igst: Number(item === null || item === void 0 ? void 0 : item.gst) / 2 } : {}));
        }));
        const data = yield Promise.all(finalResult);
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getAllProduct = getAllProduct;
const getProductByCategoryId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId, userId } = req.query;
    if (!categoryId) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: 'Params categoryId data is empty.' });
        return;
    }
    try {
        const result = yield (0, product_service_1.getProductDataByCategoryId)(categoryId);
        if (!userId) {
            const data = result === null || result === void 0 ? void 0 : result.map((item) => {
                return Object.assign(Object.assign({}, item === null || item === void 0 ? void 0 : item._doc), { isWishlist: false, isCart: false, deliveryCharge: 0 });
            });
            return res.status(http_status_codes_1.StatusCodes.OK).send({ data });
        }
        const userData = yield (0, user_service_1.getUserDataById)(userId);
        if (!userData) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: 'user data not found.' });
            return;
        }
        const finalResult = result === null || result === void 0 ? void 0 : result.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const productDetails = yield (0, product_service_1.getProductDetailsByUserId)((_a = item === null || item === void 0 ? void 0 : item._id) === null || _a === void 0 ? void 0 : _a.toString(), userId);
            const _e = item === null || item === void 0 ? void 0 : item._doc, { gst } = _e, rest = __rest(_e, ["gst"]);
            return Object.assign(Object.assign(Object.assign({}, rest), { isWishlist: ((_b = productDetails[0]) === null || _b === void 0 ? void 0 : _b.isWishlist) ? true : false, isCart: ((_c = productDetails[0]) === null || _c === void 0 ? void 0 : _c.isCart) ? true : false, deliveryCharge: (_d = (0, global_1.checkUserLocationAndGetDeliveryCharge)(userData, item)) !== null && _d !== void 0 ? _d : 0 }), ((item === null || item === void 0 ? void 0 : item.gst) ? (0, global_1.checkUserGujratState)(userData, item) ? { gst: Number(item === null || item === void 0 ? void 0 : item.gst) } : { sgst: Number(item === null || item === void 0 ? void 0 : item.gst) / 2, igst: Number(item === null || item === void 0 ? void 0 : item.gst) / 2 } : {}));
        }));
        const data = yield Promise.all(finalResult);
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getProductByCategoryId = getProductByCategoryId;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, userId } = req.query;
    if (!productId) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: 'Params productId data is empty.' });
        return;
    }
    try {
        const result = yield (0, product_service_1.getProductDataById)(productId);
        if (!userId) {
            const data = result === null || result === void 0 ? void 0 : result.map((item) => {
                return Object.assign(Object.assign({}, item), { isWishlist: false, isCart: false, deliveryCharge: 0 });
            });
            return res.status(http_status_codes_1.StatusCodes.OK).send({ data });
        }
        const userData = yield (0, user_service_1.getUserDataById)(userId);
        if (!userData) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: 'user data not found.' });
            return;
        }
        const finalResult = result === null || result === void 0 ? void 0 : result.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const productDetails = yield (0, product_service_1.getProductDetailsByUserId)((_a = item === null || item === void 0 ? void 0 : item._id) === null || _a === void 0 ? void 0 : _a.toString(), userId);
            const { gst } = item, rest = __rest(item, ["gst"]);
            return Object.assign(Object.assign(Object.assign({}, rest), { isWishlist: ((_b = productDetails[0]) === null || _b === void 0 ? void 0 : _b.isWishlist) ? true : false, isCart: ((_c = productDetails[0]) === null || _c === void 0 ? void 0 : _c.isCart) ? true : false, deliveryCharge: (_d = (0, global_1.checkUserLocationAndGetDeliveryCharge)(userData, item)) !== null && _d !== void 0 ? _d : 0 }), ((item === null || item === void 0 ? void 0 : item.gst) ? (0, global_1.checkUserGujratState)(userData, item) ? { gst: Number(item === null || item === void 0 ? void 0 : item.gst) } : { sgst: Number(item === null || item === void 0 ? void 0 : item.gst) / 2, igst: Number(item === null || item === void 0 ? void 0 : item.gst) / 2 } : {}));
        }));
        const data = yield Promise.all(finalResult);
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getProductById = getProductById;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { productId } = req.query;
    if (!productId) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: 'Params productId data is empty.' });
        return;
    }
    try {
        const productData = yield (0, product_service_1.getProductDataById)(productId);
        if (!productData) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({ error: 'Product not found.' });
            return;
        }
        if ((_a = productData[0]) === null || _a === void 0 ? void 0 : _a.image) {
            for (const image of (_b = productData[0]) === null || _b === void 0 ? void 0 : _b.image) {
                const imagePath = (_c = image === null || image === void 0 ? void 0 : image.path) !== null && _c !== void 0 ? _c : '';
                if (imagePath) {
                    yield (0, global_1.deleteVpsUpload)(imagePath);
                }
            }
        }
        const videoPath = (_e = (_d = productData[0]) === null || _d === void 0 ? void 0 : _d.videoPath) !== null && _e !== void 0 ? _e : ''; // Ensure it's a string
        if (videoPath) {
            yield (0, global_1.deleteVpsUpload)(videoPath);
        }
        yield (0, product_service_1.deleteProductData)(productId);
        //Product remove from wishlist if available in wishlist.
        yield (0, wishlist_service_1.removeWishlistDataAllUser)(productId);
        //Product remove from cart if available in cart
        yield (0, cart_service_1.removeToCartDataAllUser)(productId);
        // Delete product detail data
        yield (0, product_service_1.deleteProductDetailsData)(productId);
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Product data deleted." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.deleteProduct = deleteProduct;
const updateProductPramotionFlag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyData = req.body;
    try {
        yield (0, product_service_1.updateProductPramotionFlagData)(Object.assign({}, bodyData));
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Product data updated." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.updateProductPramotionFlag = updateProductPramotionFlag;
const updateProductDiscount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyData = req.body;
    try {
        yield (0, product_service_1.updateProductDiscountData)(Object.assign({}, bodyData));
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Product data updated." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.updateProductDiscount = updateProductDiscount;
const updateProductReward = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyData = req.body;
    try {
        yield (0, product_service_1.updateProductRewardData)(Object.assign({}, bodyData));
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Product data updated." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.updateProductReward = updateProductReward;
const getPramotionProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        const result = yield (0, product_service_1.getPramotionProductData)();
        if (!userId) {
            const data = result === null || result === void 0 ? void 0 : result.map((item) => {
                return Object.assign(Object.assign({}, item === null || item === void 0 ? void 0 : item._doc), { isWishlist: false, isCart: false, deliveryCharge: 0 });
            });
            return res.status(http_status_codes_1.StatusCodes.OK).send({ data });
        }
        const userData = yield (0, user_service_1.getUserDataById)(userId);
        if (!userData) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: 'user data not found.' });
            return;
        }
        if (userData) {
            const finalResult = result === null || result === void 0 ? void 0 : result.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                const productDetails = yield (0, product_service_1.getProductDetailsByUserId)((_a = item === null || item === void 0 ? void 0 : item._id) === null || _a === void 0 ? void 0 : _a.toString(), userId);
                const _e = item === null || item === void 0 ? void 0 : item._doc, { gst } = _e, rest = __rest(_e, ["gst"]);
                return Object.assign(Object.assign(Object.assign({}, rest), { isWishlist: ((_b = productDetails[0]) === null || _b === void 0 ? void 0 : _b.isWishlist) ? true : false, isCart: ((_c = productDetails[0]) === null || _c === void 0 ? void 0 : _c.isCart) ? true : false, deliveryCharge: (_d = (0, global_1.checkUserLocationAndGetDeliveryCharge)(userData, item)) !== null && _d !== void 0 ? _d : 0 }), ((item === null || item === void 0 ? void 0 : item.gst) ? (0, global_1.checkUserGujratState)(userData, item) ? { gst: Number(item === null || item === void 0 ? void 0 : item.gst) } : { sgst: Number(item === null || item === void 0 ? void 0 : item.gst) / 2, igst: Number(item === null || item === void 0 ? void 0 : item.gst) / 2 } : {}));
            }));
            const data = yield Promise.all(finalResult);
            res.status(http_status_codes_1.StatusCodes.OK).send({ data });
        }
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getPramotionProduct = getPramotionProduct;
const getProductUnderTwo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        const result = yield (0, product_service_1.getProductUnderTwoData)();
        if (!userId) {
            const data = result === null || result === void 0 ? void 0 : result.map((item) => {
                return Object.assign(Object.assign({}, item === null || item === void 0 ? void 0 : item._doc), { isWishlist: false, isCart: false, deliveryCharge: 0 });
            });
            return res.status(http_status_codes_1.StatusCodes.OK).send({ data });
        }
        const userData = yield (0, user_service_1.getUserDataById)(userId);
        if (!userData) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: 'user data not found.' });
            return;
        }
        const finalResult = result === null || result === void 0 ? void 0 : result.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const productDetails = yield (0, product_service_1.getProductDetailsByUserId)((_a = item === null || item === void 0 ? void 0 : item._id) === null || _a === void 0 ? void 0 : _a.toString(), userId);
            const _e = item === null || item === void 0 ? void 0 : item._doc, { gst } = _e, rest = __rest(_e, ["gst"]);
            return Object.assign(Object.assign(Object.assign({}, rest), { isWishlist: ((_b = productDetails[0]) === null || _b === void 0 ? void 0 : _b.isWishlist) ? true : false, isCart: ((_c = productDetails[0]) === null || _c === void 0 ? void 0 : _c.isCart) ? true : false, deliveryCharge: (_d = (0, global_1.checkUserLocationAndGetDeliveryCharge)(userData, item)) !== null && _d !== void 0 ? _d : 0 }), ((item === null || item === void 0 ? void 0 : item.gst) ? (0, global_1.checkUserGujratState)(userData, item) ? { gst: Number(item === null || item === void 0 ? void 0 : item.gst) } : { sgst: Number(item === null || item === void 0 ? void 0 : item.gst) / 2, igst: Number(item === null || item === void 0 ? void 0 : item.gst) / 2 } : {}));
        }));
        const data = yield Promise.all(finalResult);
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getProductUnderTwo = getProductUnderTwo;
const getProductUnderThree = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        const result = yield (0, product_service_1.getProductUnderThreeData)();
        if (!userId) {
            const data = result === null || result === void 0 ? void 0 : result.map((item) => {
                return Object.assign(Object.assign({}, item === null || item === void 0 ? void 0 : item._doc), { isWishlist: false, isCart: false, deliveryCharge: 0 });
            });
            return res.status(http_status_codes_1.StatusCodes.OK).send({ data });
        }
        const userData = yield (0, user_service_1.getUserDataById)(userId);
        if (!userData) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: 'user data not found.' });
            return;
        }
        const finalResult = result === null || result === void 0 ? void 0 : result.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const productDetails = yield (0, product_service_1.getProductDetailsByUserId)((_a = item === null || item === void 0 ? void 0 : item._id) === null || _a === void 0 ? void 0 : _a.toString(), userId);
            const _e = item === null || item === void 0 ? void 0 : item._doc, { gst } = _e, rest = __rest(_e, ["gst"]);
            return Object.assign(Object.assign(Object.assign({}, rest), { isWishlist: ((_b = productDetails[0]) === null || _b === void 0 ? void 0 : _b.isWishlist) ? true : false, isCart: ((_c = productDetails[0]) === null || _c === void 0 ? void 0 : _c.isCart) ? true : false, deliveryCharge: (_d = (0, global_1.checkUserLocationAndGetDeliveryCharge)(userData, item)) !== null && _d !== void 0 ? _d : 0 }), ((item === null || item === void 0 ? void 0 : item.gst) ? (0, global_1.checkUserGujratState)(userData, item) ? { gst: Number(item === null || item === void 0 ? void 0 : item.gst) } : { sgst: Number(item === null || item === void 0 ? void 0 : item.gst) / 2, igst: Number(item === null || item === void 0 ? void 0 : item.gst) / 2 } : {}));
        }));
        const data = yield Promise.all(finalResult);
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getProductUnderThree = getProductUnderThree;
const getProductUnderFive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        const result = yield (0, product_service_1.getProductUnderFiveData)();
        if (!userId) {
            const data = result === null || result === void 0 ? void 0 : result.map((item) => {
                return Object.assign(Object.assign({}, item === null || item === void 0 ? void 0 : item._doc), { isWishlist: false, isCart: false, deliveryCharge: 0 });
            });
            return res.status(http_status_codes_1.StatusCodes.OK).send({ data });
        }
        const userData = yield (0, user_service_1.getUserDataById)(userId);
        if (!userData) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: 'user data not found.' });
            return;
        }
        const finalResult = result === null || result === void 0 ? void 0 : result.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const productDetails = yield (0, product_service_1.getProductDetailsByUserId)((_a = item === null || item === void 0 ? void 0 : item._id) === null || _a === void 0 ? void 0 : _a.toString(), userId);
            const _e = item === null || item === void 0 ? void 0 : item._doc, { gst } = _e, rest = __rest(_e, ["gst"]);
            return Object.assign(Object.assign(Object.assign({}, rest), { isWishlist: ((_b = productDetails[0]) === null || _b === void 0 ? void 0 : _b.isWishlist) ? true : false, isCart: ((_c = productDetails[0]) === null || _c === void 0 ? void 0 : _c.isCart) ? true : false, deliveryCharge: (_d = (0, global_1.checkUserLocationAndGetDeliveryCharge)(userData, item)) !== null && _d !== void 0 ? _d : 0 }), ((item === null || item === void 0 ? void 0 : item.gst) ? (0, global_1.checkUserGujratState)(userData, item) ? { gst: Number(item === null || item === void 0 ? void 0 : item.gst) } : { sgst: Number(item === null || item === void 0 ? void 0 : item.gst) / 2, igst: Number(item === null || item === void 0 ? void 0 : item.gst) / 2 } : {}));
        }));
        const data = yield Promise.all(finalResult);
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getProductUnderFive = getProductUnderFive;
const getProductUnderten = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        const result = yield (0, product_service_1.getProductUnderTenData)();
        if (!userId) {
            const data = result === null || result === void 0 ? void 0 : result.map((item) => {
                return Object.assign(Object.assign({}, item === null || item === void 0 ? void 0 : item._doc), { isWishlist: false, isCart: false, deliveryCharge: 0 });
            });
            return res.status(http_status_codes_1.StatusCodes.OK).send({ data });
        }
        const userData = yield (0, user_service_1.getUserDataById)(userId);
        if (!userData) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: 'user data not found.' });
            return;
        }
        const finalResult = result === null || result === void 0 ? void 0 : result.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const productDetails = yield (0, product_service_1.getProductDetailsByUserId)((_a = item === null || item === void 0 ? void 0 : item._id) === null || _a === void 0 ? void 0 : _a.toString(), userId);
            const _e = item === null || item === void 0 ? void 0 : item._doc, { gst } = _e, rest = __rest(_e, ["gst"]);
            return Object.assign(Object.assign(Object.assign({}, rest), { isWishlist: ((_b = productDetails[0]) === null || _b === void 0 ? void 0 : _b.isWishlist) ? true : false, isCart: ((_c = productDetails[0]) === null || _c === void 0 ? void 0 : _c.isCart) ? true : false, deliveryCharge: (_d = (0, global_1.checkUserLocationAndGetDeliveryCharge)(userData, item)) !== null && _d !== void 0 ? _d : 0 }), ((item === null || item === void 0 ? void 0 : item.gst) ? (0, global_1.checkUserGujratState)(userData, item) ? { gst: Number(item === null || item === void 0 ? void 0 : item.gst) } : { sgst: Number(item === null || item === void 0 ? void 0 : item.gst) / 2, igst: Number(item === null || item === void 0 ? void 0 : item.gst) / 2 } : {}));
        }));
        const data = yield Promise.all(finalResult);
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getProductUnderten = getProductUnderten;
const updateProductAction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.query;
    try {
        yield (0, product_service_1.updateProductActionData)(productId);
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.updateProductAction = updateProductAction;
const getProductBaseMetal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, product_service_1.getProductBaseMetalData)();
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getProductBaseMetal = getProductBaseMetal;
const getProductBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, product_service_1.getProductBrandData)();
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getProductBrand = getProductBrand;
const getProductColor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, product_service_1.getProductColorData)();
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getProductColor = getProductColor;
const getProductOccasion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, product_service_1.getProductOccasionData)();
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getProductOccasion = getProductOccasion;
const getProductPlating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, product_service_1.getProductPlatingData)();
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getProductPlating = getProductPlating;
const getProductStoneType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, product_service_1.getProductStoneTypeData)();
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getProductStoneType = getProductStoneType;
const getProductTrend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, product_service_1.getProductTrendData)();
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getProductTrend = getProductTrend;
const getProductType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, product_service_1.getProductTypeData)();
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getProductType = getProductType;
const getSearchProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, search } = req.query;
    try {
        const result = yield (0, product_service_1.getSearchProductData)(search);
        if (!userId) {
            const data = result === null || result === void 0 ? void 0 : result.map((item) => {
                return Object.assign(Object.assign({}, item === null || item === void 0 ? void 0 : item._doc), { isWishlist: false, isCart: false, deliveryCharge: 0 });
            });
            return res.status(http_status_codes_1.StatusCodes.OK).send({ data });
        }
        const userData = yield (0, user_service_1.getUserDataById)(userId);
        if (!userData) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: 'user data not found.' });
            return;
        }
        const finalResult = result === null || result === void 0 ? void 0 : result.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const productDetails = yield (0, product_service_1.getProductDetailsByUserId)((_a = item === null || item === void 0 ? void 0 : item._id) === null || _a === void 0 ? void 0 : _a.toString(), userId);
            return Object.assign(Object.assign({}, item === null || item === void 0 ? void 0 : item._doc), { isWishlist: ((_b = productDetails[0]) === null || _b === void 0 ? void 0 : _b.isWishlist) ? true : false, isCart: ((_c = productDetails[0]) === null || _c === void 0 ? void 0 : _c.isCart) ? true : false, deliveryCharge: (_d = (0, global_1.checkUserLocationAndGetDeliveryCharge)(userData, item)) !== null && _d !== void 0 ? _d : 0 });
        }));
        const data = yield Promise.all(finalResult);
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getSearchProduct = getSearchProduct;
