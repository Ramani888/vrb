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
exports.deleteCategoryData = exports.getAllCategoryData = exports.updateCategoryData = exports.getCategoryDataById = exports.addCategoryData = void 0;
const category_model_1 = require("../models/category.model");
const mongoose_1 = __importDefault(require("mongoose"));
const addCategoryData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newData = new category_model_1.Category(data);
        yield newData.save();
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.addCategoryData = addCategoryData;
const getCategoryDataById = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const objectId = new mongoose_1.default.Types.ObjectId(categoryId);
        const result = yield category_model_1.Category.find({ _id: objectId });
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getCategoryDataById = getCategoryDataById;
const updateCategoryData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const documentId = new mongoose_1.default.Types.ObjectId((_a = data === null || data === void 0 ? void 0 : data._id) === null || _a === void 0 ? void 0 : _a.toString());
        const result = yield category_model_1.Category.findByIdAndUpdate(documentId, data, {
            new: true,
            runValidators: true
        });
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.updateCategoryData = updateCategoryData;
const getAllCategoryData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield category_model_1.Category.find();
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getAllCategoryData = getAllCategoryData;
const deleteCategoryData = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documentId = new mongoose_1.default.Types.ObjectId(categoryId);
        yield category_model_1.Category.findByIdAndDelete({ _id: documentId });
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.deleteCategoryData = deleteCategoryData;
