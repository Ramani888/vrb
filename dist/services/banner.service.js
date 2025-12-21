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
exports.deleteBannerData = exports.getAllBannerData = exports.updateBannerData = exports.getBannerDataById = exports.addBannerData = void 0;
const banner_model_1 = require("../models/banner.model");
const mongoose_1 = __importDefault(require("mongoose"));
const addBannerData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newData = new banner_model_1.Banner(data);
        yield newData.save();
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.addBannerData = addBannerData;
const getBannerDataById = (bannerId) => __awaiter(void 0, void 0, void 0, function* () {
    const objectId = new mongoose_1.default.Types.ObjectId(bannerId);
    try {
        const result = yield banner_model_1.Banner.find({ _id: objectId });
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getBannerDataById = getBannerDataById;
const updateBannerData = (bodyData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const documentId = new mongoose_1.default.Types.ObjectId((_a = bodyData === null || bodyData === void 0 ? void 0 : bodyData._id) === null || _a === void 0 ? void 0 : _a.toString());
        const result = yield banner_model_1.Banner.findByIdAndUpdate(documentId, bodyData, {
            new: true,
            runValidators: true
        });
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.updateBannerData = updateBannerData;
const getAllBannerData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield banner_model_1.Banner.find();
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getAllBannerData = getAllBannerData;
const deleteBannerData = (bannerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documentId = new mongoose_1.default.Types.ObjectId(bannerId);
        yield banner_model_1.Banner.findByIdAndDelete({ _id: documentId });
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.deleteBannerData = deleteBannerData;
