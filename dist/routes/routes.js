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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyValidate_middleware_1 = require("../middleware/bodyValidate.middleware");
const user_validate_1 = require("../utils/validates/user.validate");
const user_controller_1 = require("../controllers/user.controller");
const multer_s3_1 = __importDefault(require("multer-s3"));
const multer_1 = __importDefault(require("multer"));
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
const banner_controller_1 = require("../controllers/banner.controller");
const banner_validate_1 = require("../utils/validates/banner.validate");
const adsPoster_controller_1 = require("../controllers/adsPoster.controller");
const adsPoster_validate_1 = require("../utils/validates/adsPoster.validate");
const category_controller_1 = require("../controllers/category.controller");
const category_validate_1 = require("../utils/validates/category.validate");
const wishlist_validate_1 = require("../utils/validates/wishlist.validate");
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const cart_validate_1 = require("../utils/validates/cart.validate");
const cart_controller_1 = require("../controllers/cart.controller");
const product_validates_1 = require("../utils/validates/product.validates");
const product_controller_1 = require("../controllers/product.controller");
const deliveryAddress_validate_1 = require("../utils/validates/deliveryAddress.validate");
const order_controller_1 = require("../controllers/order.controller");
const order_validate_1 = require("../utils/validates/order.validate");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const notification_controller_1 = require("../controllers/notification.controller");
const reward_controller_1 = require("../controllers/reward.controller");
const razorpayOrder_model_1 = require("../models/razorpayOrder.model");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
var RouteSource;
(function (RouteSource) {
    RouteSource[RouteSource["Body"] = 0] = "Body";
    RouteSource[RouteSource["Query"] = 1] = "Query";
    RouteSource[RouteSource["Params"] = 2] = "Params";
})(RouteSource || (RouteSource = {}));
const router = express_1.default.Router();
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: "public-read", // 🔹 Makes the image public
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const filename = `${Date.now()}_${file.originalname}`;
            cb(null, `uploads/${filename}`); // 🔹 Uploads to 'uploads/' folder
        },
    }),
});
const uploadVideo = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: "public-read", // 🔹 Makes the image public
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const filename = `${Date.now()}_${file.originalname}`;
            cb(null, `videos/${filename}`); // 🔹 Uploads to 'uploads/' folder
        },
    }),
});
// Multer storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith("image")) {
            cb(null, "uploads/images");
        }
        else if (file.mimetype.startsWith("video")) {
            cb(null, "uploads/videos");
        }
        else {
            cb(new Error("Invalid file type"), "");
        }
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path_1.default.extname(file.originalname));
    },
});
// File filter
const fileFilter = (req, file, cb) => {
    // IMAGE field → only images
    if (file.fieldname === "image" &&
        file.mimetype.startsWith("image/")) {
        return cb(null, true);
    }
    // VIDEO field → only videos
    if (file.fieldname === "video" &&
        file.mimetype.startsWith("video/")) {
        return cb(null, true);
    }
    // FILE field → image OR video
    if (file.fieldname === "file" &&
        (file.mimetype.startsWith("image/") ||
            file.mimetype.startsWith("video/"))) {
        return cb(null, true);
    }
    // Reject everything else
    cb(new Error("Invalid file field or file type"));
};
// Multer instance
const vpsUpload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
    },
    fileFilter,
});
// Auth
router.post('/registerUser', (0, bodyValidate_middleware_1.validateBody)(user_validate_1.registerValidation), (req, res, next) => {
    (0, user_controller_1.insertRegisterUser)(req, res).catch(next);
});
router.post('/login', (0, bodyValidate_middleware_1.validateBody)(user_validate_1.loginValidation), (req, res, next) => {
    (0, user_controller_1.userLogin)(req, res).catch(next);
});
router.post('/register/login', (0, bodyValidate_middleware_1.validateBody)(user_validate_1.registerLoginValidation), (req, res, next) => {
    (0, user_controller_1.userRegisterLogin)(req, res).catch(next);
});
// Admin Login
router.post('/admin/login', (0, bodyValidate_middleware_1.validateBody)(user_validate_1.adminLoginValidation), (req, res, next) => {
    (0, user_controller_1.adminLogin)(req, res).catch(next);
});
// User
router.put('/user', (0, bodyValidate_middleware_1.validateBody)(user_validate_1.updateUserValidation), (req, res, next) => {
    (0, user_controller_1.updateUser)(req, res).catch(next);
});
router.get('/user', (0, bodyValidate_middleware_1.validateBody)(user_validate_1.getUserByIdValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, user_controller_1.getUserById)(req, res).catch(next);
});
router.get('/user/all', (req, res, next) => {
    (0, user_controller_1.getAllUser)(req, res).catch(next);
});
router.delete('/user', (0, bodyValidate_middleware_1.validateBody)(user_validate_1.deleteUserValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, user_controller_1.deleteUser)(req, res).catch(next);
});
router.put('/user/status', (0, bodyValidate_middleware_1.validateBody)(user_validate_1.updateUserStatusValidation), (req, res, next) => {
    (0, user_controller_1.updateUserStatus)(req, res).catch(next);
});
// Banner
router.post('/banner', vpsUpload.single('image'), (0, bodyValidate_middleware_1.validateBody)(banner_validate_1.addBannerValidation), (req, res, next) => {
    (0, banner_controller_1.addBanner)(req, res).catch(next);
});
router.put('/banner', vpsUpload.single('image'), (0, bodyValidate_middleware_1.validateBody)(banner_validate_1.updateBannerValidation), (req, res, next) => {
    (0, banner_controller_1.updateBanner)(req, res).catch(next);
});
router.get('/banner', (req, res, next) => {
    (0, banner_controller_1.getAllBanner)(req, res).catch(next);
});
router.delete('/banner', (0, bodyValidate_middleware_1.validateBody)(banner_validate_1.deleteBannerValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, banner_controller_1.deleteBanner)(req, res).catch(next);
});
// Ads Poster
router.post('/ads/poster', upload.single('image'), (req, res, next) => {
    (0, adsPoster_controller_1.addAdsPoster)(req, res).catch(next);
});
router.put('/ads/poster', upload.single('image'), (0, bodyValidate_middleware_1.validateBody)(adsPoster_validate_1.updateAdsPosterValidation), (req, res, next) => {
    (0, adsPoster_controller_1.updateAdsPoster)(req, res).catch(next);
});
router.get('/ads/poster', (req, res, next) => {
    (0, adsPoster_controller_1.getAllAdsPoster)(req, res).catch(next);
});
router.delete('/ads/poster', (0, bodyValidate_middleware_1.validateBody)(adsPoster_validate_1.deleteAdsPosterValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, adsPoster_controller_1.deleteAdsPoster)(req, res).catch(next);
});
// Category
router.post('/category', upload.single('image'), (0, bodyValidate_middleware_1.validateBody)(category_validate_1.addCategoryValidation), (req, res, next) => {
    (0, category_controller_1.addCategory)(req, res).catch(next);
});
router.put('/category', upload.single('image'), (0, bodyValidate_middleware_1.validateBody)(category_validate_1.updateCategoryValidation), (req, res, next) => {
    (0, category_controller_1.updateCategory)(req, res).catch(next);
});
router.get('/category', (req, res, next) => {
    (0, category_controller_1.getAllCategory)(req, res).catch(next);
});
router.get('/category/alone', (0, bodyValidate_middleware_1.validateBody)(category_validate_1.getCategoryByIdValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, category_controller_1.getCategoryById)(req, res).catch(next);
});
router.delete('/category', (0, bodyValidate_middleware_1.validateBody)(category_validate_1.deleteCategoryValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, category_controller_1.deleteCategory)(req, res).catch(next);
});
// Product
router.post('/product', (0, bodyValidate_middleware_1.validateBody)(product_validates_1.addProductValidation), (req, res, next) => {
    (0, product_controller_1.addProduct)(req, res).catch(next);
});
router.put('/product', (0, bodyValidate_middleware_1.validateBody)(product_validates_1.updateProductValidation), (req, res, next) => {
    (0, product_controller_1.updateProduct)(req, res).catch(next);
});
router.get('/product', (0, bodyValidate_middleware_1.validateBody)(product_validates_1.getAllProductValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, product_controller_1.getAllProduct)(req, res).catch(next);
});
router.get('/category/product', (0, bodyValidate_middleware_1.validateBody)(product_validates_1.getProductByCategoryIdValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, product_controller_1.getProductByCategoryId)(req, res).catch(next);
});
router.get('/product/alone', (0, bodyValidate_middleware_1.validateBody)(product_validates_1.getProductByIdValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, product_controller_1.getProductById)(req, res).catch(next);
});
router.delete('/product', (0, bodyValidate_middleware_1.validateBody)(product_validates_1.deleteProductValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, product_controller_1.deleteProduct)(req, res).catch(next);
});
router.put('/product/pramotion/flag', (0, bodyValidate_middleware_1.validateBody)(product_validates_1.updateProductPramotionFlagValidation), (req, res, next) => {
    (0, product_controller_1.updateProductPramotionFlag)(req, res).catch(next);
});
router.put('/product/discount', (0, bodyValidate_middleware_1.validateBody)(product_validates_1.updateProductDiscountValidation), (req, res, next) => {
    (0, product_controller_1.updateProductDiscount)(req, res).catch(next);
});
router.put('/product/reward', (0, bodyValidate_middleware_1.validateBody)(product_validates_1.updateProductRewardValidation), (req, res, next) => {
    (0, product_controller_1.updateProductReward)(req, res).catch(next);
});
router.get('/product/pramotion', (0, bodyValidate_middleware_1.validateBody)(product_validates_1.getPramotionProductValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, product_controller_1.getPramotionProduct)(req, res).catch(next);
});
router.get('/product/under/two', (0, bodyValidate_middleware_1.validateBody)(product_validates_1.getPramotionProductValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, product_controller_1.getProductUnderTwo)(req, res).catch(next);
});
router.get('/product/under/three', (0, bodyValidate_middleware_1.validateBody)(product_validates_1.getPramotionProductValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, product_controller_1.getProductUnderThree)(req, res).catch(next);
});
router.get('/product/under/five', (0, bodyValidate_middleware_1.validateBody)(product_validates_1.getPramotionProductValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, product_controller_1.getProductUnderFive)(req, res).catch(next);
});
router.get('/product/under/ten', (0, bodyValidate_middleware_1.validateBody)(product_validates_1.getPramotionProductValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, product_controller_1.getProductUnderten)(req, res).catch(next);
});
router.put('/product/action', (0, bodyValidate_middleware_1.validateBody)(product_validates_1.updateProductActionValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, product_controller_1.updateProductAction)(req, res).catch(next);
});
// Wishlist
router.post('/wishlist', (0, bodyValidate_middleware_1.validateBody)(wishlist_validate_1.addWishlistValidation), (req, res, next) => {
    (0, wishlist_controller_1.addWishlist)(req, res).catch(next);
});
router.delete('/wishlist', (0, bodyValidate_middleware_1.validateBody)(wishlist_validate_1.removeWishlistValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, wishlist_controller_1.removeWishlist)(req, res).catch(next);
});
router.get('/wishlist', (0, bodyValidate_middleware_1.validateBody)(wishlist_validate_1.getWishlistValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, wishlist_controller_1.getWishlist)(req, res).catch(next);
});
// Cart
router.post('/cart', (0, bodyValidate_middleware_1.validateBody)(cart_validate_1.addToCartValidation), (req, res, next) => {
    (0, cart_controller_1.addToCart)(req, res).catch(next);
});
router.delete('/cart', (0, bodyValidate_middleware_1.validateBody)(cart_validate_1.removeCartValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, cart_controller_1.removeToCart)(req, res).catch(next);
});
router.get('/cart', (0, bodyValidate_middleware_1.validateBody)(cart_validate_1.getCartValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, cart_controller_1.getCart)(req, res).catch(next);
});
router.put('/cart', (0, bodyValidate_middleware_1.validateBody)(cart_validate_1.updateCartValidation), (req, res, next) => {
    (0, cart_controller_1.updateCart)(req, res).catch(next);
});
router.get('/cart/count', (0, bodyValidate_middleware_1.validateBody)(cart_validate_1.getCartCountValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, cart_controller_1.getCartCount)(req, res).catch(next);
});
// Delivery Address
router.post('/delivery/address', (0, bodyValidate_middleware_1.validateBody)(deliveryAddress_validate_1.addDeliveryAddressValidation), (req, res, next) => {
    (0, order_controller_1.addDeliveryAddress)(req, res).catch(next);
});
router.delete('/delivery/address', (0, bodyValidate_middleware_1.validateBody)(deliveryAddress_validate_1.deleteDeliveryAddressValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, order_controller_1.deleteDeliveryAddress)(req, res).catch(next);
});
router.put('/delivery/address', (0, bodyValidate_middleware_1.validateBody)(deliveryAddress_validate_1.updateDeliveryAddressValidation), (req, res, next) => {
    (0, order_controller_1.updateDeliveryAddress)(req, res).catch(next);
});
router.get('/delivery/address', (0, bodyValidate_middleware_1.validateBody)(deliveryAddress_validate_1.getDeliveryAddressValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, order_controller_1.getDeliveryAddress)(req, res).catch(next);
});
// Product Order
router.post('/order', (0, bodyValidate_middleware_1.validateBody)(order_validate_1.addOrderValidation), (req, res, next) => {
    (0, order_controller_1.addOrder)(req, res).catch(next);
});
router.get('/order', (req, res, next) => {
    (0, order_controller_1.getOrder)(req, res).catch(next);
});
router.get('/user/order', (0, bodyValidate_middleware_1.validateBody)(order_validate_1.getOrderByUserValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, order_controller_1.getOrderByUser)(req, res).catch(next);
});
router.put('/order/status', (0, bodyValidate_middleware_1.validateBody)(order_validate_1.updateOrderStatusValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, order_controller_1.updateOrderStatus)(req, res).catch(next);
});
router.post('/order/razorpay', (0, bodyValidate_middleware_1.validateBody)(order_validate_1.addRazorpayOrderValidation), (req, res, next) => {
    (0, order_controller_1.createRazorpayOrder)(req, res).catch(next);
});
router.get('/order/razorpay/verify', (0, bodyValidate_middleware_1.validateBody)(order_validate_1.checkRazorpayOrderValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, order_controller_1.getOrderPaymentStatus)(req, res).catch(next);
});
// Tracking Order
router.post('/tracking', (0, bodyValidate_middleware_1.validateBody)(order_validate_1.addTrackingDetailsValidation), (req, res, next) => {
    (0, order_controller_1.addTracking)(req, res).catch(next);
});
router.put('/tracking', (0, bodyValidate_middleware_1.validateBody)(order_validate_1.updateTrackingDetailsValidation), (req, res, next) => {
    (0, order_controller_1.updateTracking)(req, res).catch(next);
});
// Dashboard
router.get('/dashboard', (req, res, next) => {
    (0, dashboard_controller_1.getDashboard)(req, res).catch(next);
});
// Product Insert Document Get Api
router.get('/product/baseMetal', (req, res, next) => {
    (0, product_controller_1.getProductBaseMetal)(req, res).catch(next);
});
router.get('/product/brand', (req, res, next) => {
    (0, product_controller_1.getProductBrand)(req, res).catch(next);
});
router.get('/product/color', (req, res, next) => {
    (0, product_controller_1.getProductColor)(req, res).catch(next);
});
router.get('/product/occasion', (req, res, next) => {
    (0, product_controller_1.getProductOccasion)(req, res).catch(next);
});
router.get('/product/plating', (req, res, next) => {
    (0, product_controller_1.getProductPlating)(req, res).catch(next);
});
router.get('/product/stoneType', (req, res, next) => {
    (0, product_controller_1.getProductStoneType)(req, res).catch(next);
});
router.get('/product/trend', (req, res, next) => {
    (0, product_controller_1.getProductTrend)(req, res).catch(next);
});
router.get('/product/type', (req, res, next) => {
    (0, product_controller_1.getProductType)(req, res).catch(next);
});
// Sending Push Notification
router.post('/push/notification', (0, bodyValidate_middleware_1.validateBody)(order_validate_1.sendPushNotificationValidation), (req, res, next) => {
    (0, notification_controller_1.pushNotification)(req, res).catch(next);
});
// Get Notification Data
router.get('/notification', (0, bodyValidate_middleware_1.validateBody)(order_validate_1.getNotificationValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, notification_controller_1.getNotification)(req, res).catch(next);
});
router.get('/notification/count', (0, bodyValidate_middleware_1.validateBody)(order_validate_1.getNotificationCountValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, notification_controller_1.getNotificationCount)(req, res).catch(next);
});
router.put('', (0, bodyValidate_middleware_1.validateBody)(order_validate_1.updateNotificationStatusValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, notification_controller_1.updateNotificationStatus)(req, res).catch(next);
});
router.put('/notification/device/token', (0, bodyValidate_middleware_1.validateBody)(order_validate_1.insertDeviceTokenValidation), (req, res, next) => {
    (0, notification_controller_1.insertDeviceToken)(req, res).catch(next);
});
// Unloading
router.post('/unloading/upload/image', upload.single('image'), (req, res, next) => {
    (0, order_controller_1.insertUnloadingImage)(req, res).catch(next);
});
router.post('/unloading/upload/video', uploadVideo.single('video'), (req, res, next) => {
    (0, order_controller_1.insertUnloadingVideo)(req, res).catch(next);
});
router.post('/unloading', (0, bodyValidate_middleware_1.validateBody)(order_validate_1.addUnloadingDetailsValidation), (req, res, next) => {
    (0, order_controller_1.insertUnloading)(req, res).catch(next);
});
// Search Api
router.get('/search/product', (0, bodyValidate_middleware_1.validateBody)(product_validates_1.getSearchProductValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, product_controller_1.getSearchProduct)(req, res).catch(next);
});
// Reward Api
router.get('/reward', (0, bodyValidate_middleware_1.validateBody)(user_validate_1.getRewardDataValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, reward_controller_1.getReward)(req, res).catch(next);
});
// Payment And Refund
router.post('/capture/payment', (0, bodyValidate_middleware_1.validateBody)(user_validate_1.addCapturePaymentValidation), (req, res, next) => {
    (0, order_controller_1.capturePayment)(req, res).catch(next);
});
router.post('/refund/payment', (0, bodyValidate_middleware_1.validateBody)(user_validate_1.addCapturePaymentValidation), (req, res, next) => {
    (0, order_controller_1.refundPayment)(req, res).catch(next);
});
router.get('/payment', (0, bodyValidate_middleware_1.validateBody)(user_validate_1.getPaymentValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, order_controller_1.getPayment)(req, res).catch(next);
});
// Update Payment Method Setting//
router.put('/payment/method', (0, bodyValidate_middleware_1.validateBody)(user_validate_1.updatePaymentMethodValidation, RouteSource === null || RouteSource === void 0 ? void 0 : RouteSource.Query), (req, res, next) => {
    (0, user_controller_1.updatePaymentMethod)(req, res).catch(next);
});
router.get('/payment/method', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, user_controller_1.getPaymentMethod)(req, res).catch(next);
}));
// Upload API
router.post("/upload", vpsUpload.single("file"), (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: "File not uploaded" });
        return;
    }
    const folder = req.file.mimetype.startsWith("image")
        ? "images"
        : "videos";
    res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        url: `${process.env.APP_URL}/uploads/${folder}/${req.file.filename}`,
    });
});
// Webhook
// Place this webhook route BEFORE any express.json() or body-parser.json() middleware!
router.post("/razorpay/webhook", express_1.default.raw({ type: 'application/json' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    const body = req.body; // This is a Buffer because of express.raw
    console.log('full console', JSON.stringify(req.body, null, 2));
    console.log("🔔 Webhook received (raw body):", body);
    // Calculate expected signature using the raw body
    const expectedSignature = crypto_1.default
        .createHmac("sha256", webhookSecret)
        .update(body) // body is Buffer
        .digest("hex");
    console.log('expectedSignature:', expectedSignature);
    if (signature !== expectedSignature) {
        res.status(400).send("Invalid signature");
        return;
    }
    // Parse the raw body to JSON
    const data = JSON.parse(body.toString());
    console.log("🔔 Webhook Data:", data);
    // Handle payment.captured event
    if (data.event === "payment.captured") {
        const payment = data.payload.payment.entity;
        console.log("🔔 Payment Captured Event:", payment);
        // Update your database here
        try {
            yield razorpayOrder_model_1.RazorpayOrder.findOneAndUpdate({ razorpayOrderId: payment === null || payment === void 0 ? void 0 : payment.order_id }, {
                status: payment === null || payment === void 0 ? void 0 : payment.status, // e.g., "captured"
                paymentId: payment === null || payment === void 0 ? void 0 : payment.id // store the payment id
            });
            console.log("✅ Payment Captured and DB updated:", payment);
        }
        catch (err) {
            console.error("❌ Error updating RazorpayOrder:", err);
        }
    }
    // You can handle other events like payment.failed, etc., here if needed
    res.status(200).send("Webhook received");
}));
exports.default = router;
