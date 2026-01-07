import express from "express";
import { validateBody } from "../middleware/bodyValidate.middleware";
import { addCapturePaymentValidation, adminLoginValidation, deleteUserValidation, getPaymentValidation, getRewardDataValidation, getUserByIdValidation, loginValidation, registerLoginValidation, registerValidation, updatePaymentMethodValidation, updateUserStatusValidation, updateUserValidation } from "../utils/validates/user.validate";
import { adminLogin, deleteUser, getAllUser, getPaymentMethod, getUserById, insertRegisterUser, updatePaymentMethod, updateUser, updateUserStatus, userLogin, userRegisterLogin } from "../controllers/user.controller";
import multerS3 from "multer-s3";
import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv"
import crypto from "crypto";
import { addBanner, deleteBanner, getAllBanner, updateBanner } from "../controllers/banner.controller";
import { addBannerValidation, deleteBannerValidation, updateBannerValidation } from "../utils/validates/banner.validate";
import { addAdsPoster, deleteAdsPoster, getAllAdsPoster, updateAdsPoster } from "../controllers/adsPoster.controller";
import { deleteAdsPosterValidation, updateAdsPosterValidation } from "../utils/validates/adsPoster.validate";
import { addCategory, deleteCategory, getAllCategory, getCategoryById, updateCategory } from "../controllers/category.controller";
import { addCategoryValidation, deleteCategoryValidation, getCategoryByIdValidation, updateCategoryValidation } from "../utils/validates/category.validate";
import { addWishlistValidation, getWishlistValidation, removeWishlistValidation } from "../utils/validates/wishlist.validate";
import { addWishlist, getWishlist, removeWishlist } from "../controllers/wishlist.controller";
import { addToCartValidation, getCartCountValidation, getCartValidation, removeCartValidation, updateCartValidation } from "../utils/validates/cart.validate";
import { addToCart, getCart, getCartCount, removeToCart, updateCart } from "../controllers/cart.controller";
import { addProductValidation, deleteProductValidation, getAllProductValidation, getPramotionProductValidation, getProductByCategoryIdValidation, getProductByIdValidation, getSearchProductValidation, updateProductActionValidation, updateProductDiscountValidation, updateProductPramotionFlagValidation, updateProductRewardValidation, updateProductValidation } from "../utils/validates/product.validates";
import { addProduct, deleteProduct, getAllProduct, getPramotionProduct, getProductBaseMetal, getProductBrand, getProductByCategoryId, getProductById, getProductColor, getProductOccasion, getProductPlating, getProductStoneType, getProductTrend, getProductType, getProductUnderFive, getProductUnderten, getProductUnderThree, getProductUnderTwo, getSearchProduct, updateProduct, updateProductAction, updateProductDiscount, updateProductPramotionFlag, updateProductReward } from "../controllers/product.controller";
import { addDeliveryAddressValidation, deleteDeliveryAddressValidation, getDeliveryAddressValidation, updateDeliveryAddressValidation } from "../utils/validates/deliveryAddress.validate";
import { addDeliveryAddress, addOrder, addTracking, capturePayment, createRazorpayOrder, deleteDeliveryAddress, getDeliveryAddress, getOrder, getOrderByUser, getOrderPaymentStatus, getPayment, insertUnloading, insertUnloadingImage, insertUnloadingVideo, refundPayment, updateDeliveryAddress, updateOrderStatus, updateTracking } from "../controllers/order.controller";
import { addOrderValidation, addRazorpayOrderValidation, addTrackingDetailsValidation, addUnloadingDetailsValidation, checkRazorpayOrderValidation, getNotificationCountValidation, getNotificationValidation, getOrderByUserValidation, insertDeviceTokenValidation, sendPushNotificationValidation, updateNotificationStatusValidation, updateOrderStatusValidation, updateTrackingDetailsValidation } from "../utils/validates/order.validate";
import { getDashboard } from "../controllers/dashboard.controller";
import { getNotification, getNotificationCount, insertDeviceToken, pushNotification, updateNotificationStatus } from "../controllers/notification.controller";
import { getReward } from "../controllers/reward.controller";
import { RazorpayOrder } from "../models/razorpayOrder.model";
import path from "path";
dotenv.config();

enum RouteSource {
    Body,
    Query,
    Params
}

const router = express.Router();

const s3 = new S3Client({
	region: process.env.AWS_REGION!,
	credentials: {
	  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
	  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});
  

const upload = multer({
	storage: multerS3({
	  s3: s3,
	  bucket: process.env.AWS_BUCKET_NAME!,
	  acl: "public-read", // 🔹 Makes the image public
	  contentType: multerS3.AUTO_CONTENT_TYPE,
	  key: (req, file, cb) => {
		const filename = `${Date.now()}_${file.originalname}`;
		cb(null, `uploads/${filename}`); // 🔹 Uploads to 'uploads/' folder
	  },
	}),
});

const uploadVideo = multer({
	storage: multerS3({
	  s3: s3,
	  bucket: process.env.AWS_BUCKET_NAME!,
	  acl: "public-read", // 🔹 Makes the image public
	  contentType: multerS3.AUTO_CONTENT_TYPE,
	  key: (req, file, cb) => {
		const filename = `${Date.now()}_${file.originalname}`;
		cb(null, `videos/${filename}`); // 🔹 Uploads to 'uploads/' folder
	  },
	}),
});

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
	  cb(null, "uploads/images");
	} else if (file.mimetype.startsWith("video")) {
	  cb(null, "uploads/videos");
	} else {
	  cb(new Error("Invalid file type"), "");
	}
  },
  filename: (req, file, cb) => {
	const uniqueName =
	  Date.now() + "-" + Math.round(Math.random() * 1e9);
	cb(null, uniqueName + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (
  req: express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {

  // IMAGE field → only images
  if (
    file.fieldname === "image" &&
    file.mimetype.startsWith("image/")
  ) {
    return cb(null, true);
  }

  // VIDEO field → only videos
  if (
    file.fieldname === "video" &&
    file.mimetype.startsWith("video/")
  ) {
    return cb(null, true);
  }

  // FILE field → image OR video
  if (
    file.fieldname === "file" &&
    (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    )
  ) {
    return cb(null, true);
  }

  // Reject everything else
  cb(new Error("Invalid file field or file type"));
};

// Multer instance
const vpsUpload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter,
});


// Auth
router.post('/registerUser', validateBody(registerValidation), (req, res, next) => {
	insertRegisterUser(req, res).catch(next);
});

router.post('/login', validateBody(loginValidation), (req, res, next) => {
	userLogin(req, res).catch(next);
})

router.post('/register/login', validateBody(registerLoginValidation), (req, res, next) => {
	userRegisterLogin(req, res).catch(next);
});


// Admin Login
router.post('/admin/login', validateBody(adminLoginValidation), (req, res, next) => {
	adminLogin(req, res).catch(next);
});


// User
router.put('/user', validateBody(updateUserValidation), (req, res, next) => {
	updateUser(req, res).catch(next);
})

router.get('/user', validateBody(getUserByIdValidation, RouteSource?.Query), (req, res, next) => {
	getUserById(req, res).catch(next);
})

router.get('/user/all', (req, res, next) => {
	getAllUser(req, res).catch(next);
})

router.delete('/user', validateBody(deleteUserValidation, RouteSource?.Query), (req, res, next) => {
	deleteUser(req, res).catch(next);
})

router.put('/user/status', validateBody(updateUserStatusValidation), (req, res, next) => {
	updateUserStatus(req, res).catch(next);
})


// Banner
router.post('/banner', vpsUpload.single('image'), validateBody(addBannerValidation),  (req, res, next) => {
	addBanner(req, res).catch(next);
})

router.put('/banner', vpsUpload.single('image'), validateBody(updateBannerValidation), (req, res, next) => {
	updateBanner(req, res).catch(next);
})

router.get('/banner', (req, res, next) => {
	getAllBanner(req, res).catch(next);
})

router.delete('/banner', validateBody(deleteBannerValidation, RouteSource?.Query), (req, res, next) => {
	deleteBanner(req, res).catch(next);
})


// Ads Poster
router.post('/ads/poster', vpsUpload.single('image'), (req, res, next) => {
	addAdsPoster(req, res).catch(next);
})

router.put('/ads/poster', vpsUpload.single('image'), validateBody(updateAdsPosterValidation), (req, res, next) => {
	updateAdsPoster(req, res).catch(next);
})

router.get('/ads/poster', (req, res, next) => {
	getAllAdsPoster(req, res).catch(next);
})

router.delete('/ads/poster', validateBody(deleteAdsPosterValidation, RouteSource?.Query), (req, res, next) => {
	deleteAdsPoster(req, res).catch(next);
})

// Category
router.post('/category', upload.single('image'), validateBody(addCategoryValidation), (req, res, next) => {
	addCategory(req, res).catch(next);
})

router.put('/category', upload.single('image'), validateBody(updateCategoryValidation), (req, res, next) => {
	updateCategory(req, res).catch(next);
})

router.get('/category', (req, res, next) => {
	getAllCategory(req, res).catch(next);
})

router.get('/category/alone', validateBody(getCategoryByIdValidation, RouteSource?.Query), (req, res, next) => {
	getCategoryById(req, res).catch(next);
})

router.delete('/category', validateBody(deleteCategoryValidation, RouteSource?.Query), (req, res, next) => {
	deleteCategory(req, res).catch(next);
})


// Product
router.post('/product', validateBody(addProductValidation), (req, res, next) => {
	addProduct(req, res).catch(next);
});

router.put('/product', validateBody(updateProductValidation), (req, res, next) => {
	updateProduct(req, res).catch(next);
});

router.get('/product', validateBody(getAllProductValidation, RouteSource?.Query), (req, res, next) => {
	getAllProduct(req, res).catch(next);
})

router.get('/category/product', validateBody(getProductByCategoryIdValidation, RouteSource?.Query), (req, res, next) => {
	getProductByCategoryId(req, res).catch(next);
})

router.get('/product/alone', validateBody(getProductByIdValidation, RouteSource?.Query), (req, res, next) => {
	getProductById(req, res).catch(next);
})

router.delete('/product', validateBody(deleteProductValidation, RouteSource?.Query), (req, res, next) => {
	deleteProduct(req, res).catch(next);
})

router.put('/product/pramotion/flag', validateBody(updateProductPramotionFlagValidation), (req, res, next) => {
	updateProductPramotionFlag(req, res).catch(next);
})

router.put('/product/discount', validateBody(updateProductDiscountValidation), (req, res, next) => {
	updateProductDiscount(req, res).catch(next);
})

router.put('/product/reward', validateBody(updateProductRewardValidation), (req, res, next) => {
	updateProductReward(req, res).catch(next);
})

router.get('/product/pramotion', validateBody(getPramotionProductValidation, RouteSource?.Query), (req, res, next) => {
	getPramotionProduct(req, res).catch(next);
})

router.get('/product/under/two', validateBody(getPramotionProductValidation, RouteSource?.Query), (req, res, next) => {
	getProductUnderTwo(req, res).catch(next);
})

router.get('/product/under/three', validateBody(getPramotionProductValidation, RouteSource?.Query), (req, res, next) => {
	getProductUnderThree(req, res).catch(next);
})

router.get('/product/under/five', validateBody(getPramotionProductValidation, RouteSource?.Query), (req, res, next) => {
	getProductUnderFive(req, res).catch(next);
})

router.get('/product/under/ten', validateBody(getPramotionProductValidation, RouteSource?.Query), (req, res, next) => {
	getProductUnderten(req, res).catch(next);
})

router.put('/product/action', validateBody(updateProductActionValidation, RouteSource?.Query), (req, res, next) => {
	updateProductAction(req, res).catch(next);
})


// Wishlist
router.post('/wishlist', validateBody(addWishlistValidation), (req, res, next) => {
	addWishlist(req, res).catch(next);
})

router.delete('/wishlist', validateBody(removeWishlistValidation, RouteSource?.Query), (req, res, next) => {
	removeWishlist(req, res).catch(next);	
});

router.get('/wishlist', validateBody(getWishlistValidation, RouteSource?.Query), (req, res, next) => {
	getWishlist(req, res).catch(next);
});


// Cart
router.post('/cart', validateBody(addToCartValidation), (req, res, next) => {
	addToCart(req, res).catch(next);
})

router.delete('/cart', validateBody(removeCartValidation, RouteSource?.Query), (req, res, next) => {
	removeToCart(req, res).catch(next);
});

router.get('/cart', validateBody(getCartValidation, RouteSource?.Query), (req, res, next) => {
	getCart(req, res).catch(next);
})

router.put('/cart', validateBody(updateCartValidation), (req, res, next) => {
	updateCart(req, res).catch(next);
})

router.get('/cart/count', validateBody(getCartCountValidation, RouteSource?.Query), (req, res, next) => {
	getCartCount(req, res).catch(next);
})


// Delivery Address
router.post('/delivery/address', validateBody(addDeliveryAddressValidation), (req, res, next) => {
	addDeliveryAddress(req, res).catch(next);
})

router.delete('/delivery/address', validateBody(deleteDeliveryAddressValidation, RouteSource?.Query), (req, res, next) => {
	deleteDeliveryAddress(req, res).catch(next);
})

router.put('/delivery/address', validateBody(updateDeliveryAddressValidation), (req, res, next) => {
	updateDeliveryAddress(req, res).catch(next);
})

router.get('/delivery/address', validateBody(getDeliveryAddressValidation, RouteSource?.Query), (req, res, next) => {
	getDeliveryAddress(req, res).catch(next);
})


// Product Order
router.post('/order', validateBody(addOrderValidation), (req, res, next) => {
	addOrder(req, res).catch(next);
})

router.get('/order', (req, res, next) => {
	getOrder(req, res).catch(next);
})

router.get('/user/order', validateBody(getOrderByUserValidation, RouteSource?.Query), (req, res, next) => {
	getOrderByUser(req, res).catch(next);
})

router.put('/order/status', validateBody(updateOrderStatusValidation, RouteSource?.Query), (req, res, next) => {
	updateOrderStatus(req, res).catch(next);
})

router.post('/order/razorpay', validateBody(addRazorpayOrderValidation), (req, res, next) => {
	createRazorpayOrder(req, res).catch(next);
});

router.get('/order/razorpay/verify', validateBody(checkRazorpayOrderValidation, RouteSource?.Query), (req, res, next) => {
	getOrderPaymentStatus(req, res).catch(next);
});


// Tracking Order
router.post('/tracking', validateBody(addTrackingDetailsValidation), (req, res, next) => {
	addTracking(req, res).catch(next);
});

router.put('/tracking', validateBody(updateTrackingDetailsValidation), (req, res, next) => {
	updateTracking(req, res).catch(next);
});


// Dashboard
router.get('/dashboard', (req, res, next) => {
	getDashboard(req, res).catch(next);
});


// Product Insert Document Get Api
router.get('/product/baseMetal', (req, res, next) => {
	getProductBaseMetal(req, res).catch(next);
})

router.get('/product/brand', (req, res, next) => {
	getProductBrand(req, res).catch(next);
})

router.get('/product/color', (req, res, next) => {
	getProductColor(req, res).catch(next);
})

router.get('/product/occasion', (req, res, next) => {
	getProductOccasion(req, res).catch(next);
})

router.get('/product/plating', (req, res, next) => {
	getProductPlating(req, res).catch(next);
})

router.get('/product/stoneType', (req, res, next) => {
	getProductStoneType(req, res).catch(next);
})

router.get('/product/trend', (req, res, next) => {
	getProductTrend(req, res).catch(next);
})

router.get('/product/type', (req, res, next) => {
	getProductType(req, res).catch(next);
})


// Sending Push Notification
router.post('/push/notification', validateBody(sendPushNotificationValidation), (req, res, next) => {
	pushNotification(req, res).catch(next);
})


// Get Notification Data
router.get('/notification', validateBody(getNotificationValidation, RouteSource?.Query), (req, res, next) => {
	getNotification(req, res).catch(next);
})

router.get('/notification/count', validateBody(getNotificationCountValidation, RouteSource?.Query), (req, res, next) => {
	getNotificationCount(req, res).catch(next);
})

router.put('', validateBody(updateNotificationStatusValidation, RouteSource?.Query), (req, res, next) => {
	updateNotificationStatus(req, res).catch(next);
})

router.put('/notification/device/token', validateBody(insertDeviceTokenValidation), (req, res, next) => {
	insertDeviceToken(req, res).catch(next);
})


// Unloading
router.post('/unloading/upload/image', upload.single('image'), (req, res, next) => {
	insertUnloadingImage(req, res).catch(next);
})

router.post('/unloading/upload/video', uploadVideo.single('video'), (req, res, next) => {
	insertUnloadingVideo(req, res).catch(next);
})

router.post('/unloading', validateBody(addUnloadingDetailsValidation), (req, res, next) => {
	insertUnloading(req, res).catch(next);
})


// Search Api
router.get('/search/product', validateBody(getSearchProductValidation, RouteSource?.Query), (req, res, next) => {
	getSearchProduct(req, res).catch(next);
})


// Reward Api
router.get('/reward', validateBody(getRewardDataValidation, RouteSource?.Query), (req, res, next) => {
	getReward(req, res).catch(next);
})


// Payment And Refund
router.post('/capture/payment', validateBody(addCapturePaymentValidation), (req, res, next) => {
	capturePayment(req, res).catch(next);
})

router.post('/refund/payment', validateBody(addCapturePaymentValidation), (req, res, next) => {
	refundPayment(req, res).catch(next);
})

router.get('/payment', validateBody(getPaymentValidation, RouteSource?.Query), (req, res, next) => {
	getPayment(req, res).catch(next);
})


// Update Payment Method Setting//
router.put('/payment/method', validateBody(updatePaymentMethodValidation, RouteSource?.Query), (req, res, next) => {
	updatePaymentMethod(req, res).catch(next);
})

router.get('/payment/method', async (req, res, next) => {
	getPaymentMethod(req, res).catch(next);
});

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
router.post("/razorpay/webhook", express.raw({ type: 'application/json' }), async (req, res): Promise<void> => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const signature = req.headers["x-razorpay-signature"];
  const body = req.body; // This is a Buffer because of express.raw

  console.log('full console', JSON.stringify(req.body, null, 2));

  console.log("🔔 Webhook received (raw body):", body);

  // Calculate expected signature using the raw body
  const expectedSignature = crypto
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
      await RazorpayOrder.findOneAndUpdate(
        { razorpayOrderId: payment?.order_id },
        {
          status: payment?.status,      // e.g., "captured"
          paymentId: payment?.id        // store the payment id
        }
      );
      console.log("✅ Payment Captured and DB updated:", payment);
    } catch (err) {
      console.error("❌ Error updating RazorpayOrder:", err);
    }
  }

  // You can handle other events like payment.failed, etc., here if needed

  res.status(200).send("Webhook received");
});

export default router;