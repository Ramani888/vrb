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
exports.deleteBanner = exports.getAllBanner = exports.updateBanner = exports.addBanner = void 0;
const http_status_codes_1 = require("http-status-codes");
const dotenv_1 = __importDefault(require("dotenv"));
const banner_service_1 = require("../services/banner.service");
const global_1 = require("../utils/helpers/global");
dotenv_1.default.config();
const addBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const file = req.file;
    if (!file) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: 'Image file is missing.' });
        return;
    }
    const bannerUrl = `https://vrfashionjewelleary.in/uploads/images/${req.file.filename}`;
    try {
        const bannerData = {
            name: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.name,
            imagePath: bannerUrl
        };
        yield (0, banner_service_1.addBannerData)(bannerData);
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: 'Banner data inserted.' });
    }
    catch (error) {
        console.error('Error adding banner:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'Failed to insert banner data.' });
    }
});
exports.addBanner = addBanner;
const updateBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const bodyData = req.body;
    const file = req.file;
    try {
        const bannerData = yield (0, banner_service_1.getBannerDataById)(bodyData === null || bodyData === void 0 ? void 0 : bodyData._id);
        if (!bannerData || bannerData.length === 0) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({ error: 'Banner data not found.' });
            return;
        }
        let imagePath = (_b = (_a = bannerData[0]) === null || _a === void 0 ? void 0 : _a.imagePath) !== null && _b !== void 0 ? _b : '';
        if (file) {
            const bannerUrl = `https://vrfashionjewelleary.in/uploads/images/${req.file.filename}`;
            yield (0, global_1.deleteVpsUpload)(imagePath);
            imagePath = bannerUrl;
        }
        yield (0, banner_service_1.updateBannerData)(Object.assign(Object.assign({}, bodyData), { imagePath }));
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Banner data updated." });
    }
    catch (error) {
        console.error('Error updating banner:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'Failed to update banner data.' });
    }
});
exports.updateBanner = updateBanner;
const getAllBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, banner_service_1.getAllBannerData)();
        return res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (error) {
        console.error('Error fetching all banners:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'Failed to fetch all banners.' });
    }
});
exports.getAllBanner = getAllBanner;
const deleteBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { bannerId } = req.query;
    try {
        const bannerData = yield (0, banner_service_1.getBannerDataById)(bannerId);
        if (!bannerData || bannerData.length === 0) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({ error: 'Banner not found.' });
            return;
        }
        const imagePath = (_a = bannerData[0]) === null || _a === void 0 ? void 0 : _a.imagePath;
        // Delete Image if it exists
        if (imagePath) {
            yield (0, global_1.deleteVpsUpload)(imagePath);
        }
        // Delete Banner Data from Database
        yield (0, banner_service_1.deleteBannerData)(bannerId);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: 'Banner deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting banner:', error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'Failed to delete banner data.' });
    }
});
exports.deleteBanner = deleteBanner;
