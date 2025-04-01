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

export default router;