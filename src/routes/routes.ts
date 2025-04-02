import express from "express";
import { validateBody } from "../middleware/bodyValidate.middleware";
import { adminLoginValidation, deleteUserValidation, getUserByIdValidation, loginValidation, registerValidation, updateUserStatusValidation, updateUserValidation } from "../utils/validates/user.validate";
import { adminLogin, deleteUser, getAllUser, getUserById, insertRegisterUser, updateUser, updateUserStatus, userLogin, userRegisterLogin } from "../controllers/user.controller";
import multerS3 from "multer-s3";
import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv"
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
import { addProductValidation, deleteProductValidation, getAllProductValidation, getPramotionProductValidation, getProductByCategoryIdValidation, getProductByIdValidation, updateProductActionValidation, updateProductDiscountValidation, updateProductPramotionFlagValidation, updateProductRewardValidation, updateProductValidation } from "../utils/validates/product.validates";
import { addProduct, deleteProduct, getAllProduct, getPramotionProduct, getProductByCategoryId, getProductById, getProductUnderFive, getProductUnderten, getProductUnderThree, getProductUnderTwo, updateProduct, updateProductAction, updateProductDiscount, updateProductPramotionFlag, updateProductReward } from "../controllers/product.controller";
import { addDeliveryAddressValidation, deleteDeliveryAddressValidation, getDeliveryAddressValidation, updateDeliveryAddressValidation } from "../utils/validates/deliveryAddress.validate";
import { addDeliveryAddress, addTracking, deleteDeliveryAddress, getDeliveryAddress, updateDeliveryAddress, updateTracking } from "../controllers/order.controller";
import { addTrackingDetailsValidation, updateTrackingDetailsValidation } from "../utils/validates/order.validate";
import { getDashboard } from "../controllers/dashboard.controller";
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


// Auth
router.post('/registerUser', validateBody(registerValidation), (req, res, next) => {
	insertRegisterUser(req, res).catch(next);
});

router.post('/login', validateBody(loginValidation), (req, res, next) => {
	userLogin(req, res).catch(next);
})

router.post('/register/login', validateBody(loginValidation), (req, res, next) => {
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

router.delete('/user', validateBody(deleteUserValidation), (req, res, next) => {
	deleteUser(req, res).catch(next);
})

router.put('/user/status', validateBody(updateUserStatusValidation), (req, res, next) => {
	updateUserStatus(req, res).catch(next);
})


// Banner
router.post('/banner', upload.single('image'), validateBody(addBannerValidation),  (req, res, next) => {
	addBanner(req, res).catch(next);
})

router.put('/banner', upload.single('image'), validateBody(updateBannerValidation), (req, res, next) => {
	updateBanner(req, res).catch(next);
})

router.get('/banner', (req, res, next) => {
	getAllBanner(req, res).catch(next);
})

router.delete('/banner', validateBody(deleteBannerValidation, RouteSource?.Query), (req, res, next) => {
	deleteBanner(req, res).catch(next);
})


// Ads Poster
router.post('/ads/poster', upload.single('image'), (req, res, next) => {
	addAdsPoster(req, res).catch(next);
})

router.put('/ads/poster', upload.single('image'), validateBody(updateAdsPosterValidation), (req, res, next) => {
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

export default router;