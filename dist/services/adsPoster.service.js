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
exports.deleteAdsPosterData = exports.getAllAdsPosterData = exports.updateAdsPosterData = exports.getAdsPosterDataById = exports.addAdsPosterData = void 0;
const adsPoster_model_1 = require("../models/adsPoster.model");
const mongoose_1 = __importDefault(require("mongoose"));
const addAdsPosterData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newData = new adsPoster_model_1.AdsPoster(data);
        yield newData.save();
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.addAdsPosterData = addAdsPosterData;
const getAdsPosterDataById = (adsPosterId) => __awaiter(void 0, void 0, void 0, function* () {
    const objectId = new mongoose_1.default.Types.ObjectId(adsPosterId);
    try {
        const result = yield adsPoster_model_1.AdsPoster.find({ _id: objectId });
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getAdsPosterDataById = getAdsPosterDataById;
const updateAdsPosterData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const documentId = new mongoose_1.default.Types.ObjectId((_a = data === null || data === void 0 ? void 0 : data._id) === null || _a === void 0 ? void 0 : _a.toString());
        const result = yield adsPoster_model_1.AdsPoster.findByIdAndUpdate(documentId, data, {
            new: true,
            runValidators: true
        });
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.updateAdsPosterData = updateAdsPosterData;
const getAllAdsPosterData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield adsPoster_model_1.AdsPoster.find();
        return result;
    }
    catch (err) {
        throw err;
    }
});
exports.getAllAdsPosterData = getAllAdsPosterData;
const deleteAdsPosterData = (adsPosterId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documentId = new mongoose_1.default.Types.ObjectId(adsPosterId);
        yield adsPoster_model_1.AdsPoster.findByIdAndDelete({ _id: documentId });
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.deleteAdsPosterData = deleteAdsPosterData;
