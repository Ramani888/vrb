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
exports.deleteCategory = exports.getCategoryById = exports.getAllCategory = exports.updateCategory = exports.addCategory = void 0;
const http_status_codes_1 = require("http-status-codes");
const dotenv_1 = __importDefault(require("dotenv"));
const global_1 = require("../utils/helpers/global");
const category_service_1 = require("../services/category.service");
dotenv_1.default.config();
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const file = req.file;
    const bodyData = req.body;
    if (!file) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: 'Image file is missing.' });
        return;
    }
    const categoryUrl = `https://vrfashionjewelleary.in/uploads/images/${req.file.filename}`;
    try {
        const categoryData = {
            name: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.name,
            imagePath: categoryUrl
        };
        yield (0, category_service_1.addCategoryData)(categoryData);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Category data inserted." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.addCategory = addCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const bodyData = req.body;
    const file = req.file;
    try {
        const categoryData = yield (0, category_service_1.getCategoryDataById)(bodyData === null || bodyData === void 0 ? void 0 : bodyData._id);
        if (!categoryData || categoryData.length === 0) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({ error: 'Category data not found.' });
            return;
        }
        if (file) {
            const categoryUrl = `https://vrfashionjewelleary.in/uploads/images/${req.file.filename}`;
            // Delete Image
            const imagePath = (_b = (_a = categoryData[0]) === null || _a === void 0 ? void 0 : _a.imagePath) !== null && _b !== void 0 ? _b : undefined; // Ensure it's `undefined` instead of `null`
            if (imagePath) {
                yield (0, global_1.deleteVpsUpload)(imagePath);
            }
            // Insert Data
            yield (0, category_service_1.updateCategoryData)(Object.assign(Object.assign({}, bodyData), { imagePath: categoryUrl }));
        }
        else {
            yield (0, category_service_1.updateCategoryData)(Object.assign(Object.assign({}, bodyData), { imagePath: (_d = (_c = categoryData[0]) === null || _c === void 0 ? void 0 : _c.imagePath) !== null && _d !== void 0 ? _d : undefined }));
        }
        return res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Category data updated." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.updateCategory = updateCategory;
const getAllCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, category_service_1.getAllCategoryData)();
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getAllCategory = getAllCategory;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.query;
    try {
        const data = yield (0, category_service_1.getCategoryDataById)(categoryId);
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getCategoryById = getCategoryById;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { categoryId } = req.query;
    try {
        const categoryData = yield (0, category_service_1.getCategoryDataById)(categoryId);
        if (!categoryData || categoryData.length === 0) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({ error: 'Category not found.' });
            return;
        }
        // Ensure imagePath is valid
        const imagePath = (_b = (_a = categoryData[0]) === null || _a === void 0 ? void 0 : _a.imagePath) !== null && _b !== void 0 ? _b : undefined;
        if (imagePath) {
            yield (0, global_1.deleteVpsUpload)(imagePath);
        }
        yield (0, category_service_1.deleteCategoryData)(categoryId);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Category data deleted." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.deleteCategory = deleteCategory;
