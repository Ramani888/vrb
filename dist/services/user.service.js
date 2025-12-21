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
exports.getPaymentMethodData = exports.updatePaymentMethodData = exports.deleteDeviceTokenData = exports.updateUserDataStatus = exports.deleteUserData = exports.getAllUserData = exports.getUserDataById = exports.updateUserData = exports.getAdminByEmail = exports.insertDeviceTokenData = exports.insertRegisterUserData = exports.getUserByNumber = void 0;
const admin_mode_1 = require("../models/admin.mode");
const deviceToken_model_1 = require("../models/deviceToken.model");
const setting_model_1 = require("../models/setting.model");
const user_model_1 = require("../models/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const getUserByNumber = (number) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_model_1.User.find({ mobileNumber: number });
        return result;
    }
    catch (e) {
        throw e;
    }
});
exports.getUserByNumber = getUserByNumber;
const insertRegisterUserData = (bodyData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new user_model_1.User(bodyData);
        yield newUser.save();
        return newUser._id;
    }
    catch (e) {
        throw e;
    }
});
exports.insertRegisterUserData = insertRegisterUserData;
const insertDeviceTokenData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newDeviceToken = new deviceToken_model_1.DeviceToken(data);
        yield newDeviceToken.save();
        return;
    }
    catch (e) {
        throw e;
    }
});
exports.insertDeviceTokenData = insertDeviceTokenData;
const getAdminByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield admin_mode_1.Admin.find({ email: email });
        return result;
    }
    catch (e) {
        throw e;
    }
});
exports.getAdminByEmail = getAdminByEmail;
const updateUserData = (bodyData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const documentId = new mongoose_1.default.Types.ObjectId((_a = bodyData === null || bodyData === void 0 ? void 0 : bodyData._id) === null || _a === void 0 ? void 0 : _a.toString());
        const result = yield user_model_1.User.findByIdAndUpdate(documentId, bodyData, {
            new: true,
            runValidators: true
        });
        return result;
    }
    catch (e) {
        throw e;
    }
});
exports.updateUserData = updateUserData;
const getUserDataById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documentId = new mongoose_1.default.Types.ObjectId(userId);
        const result = yield user_model_1.User.findOne({ _id: documentId });
        return result === null || result === void 0 ? void 0 : result.toObject();
    }
    catch (e) {
        throw e;
    }
});
exports.getUserDataById = getUserDataById;
const getAllUserData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_model_1.User.find();
        return result;
    }
    catch (e) {
        throw e;
    }
});
exports.getAllUserData = getAllUserData;
const deleteUserData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documentId = new mongoose_1.default.Types.ObjectId(userId);
        yield user_model_1.User.findByIdAndDelete({ _id: documentId });
        return;
    }
    catch (e) {
        throw e;
    }
});
exports.deleteUserData = deleteUserData;
const updateUserDataStatus = (bodyData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const documentId = new mongoose_1.default.Types.ObjectId((_a = bodyData === null || bodyData === void 0 ? void 0 : bodyData._id) === null || _a === void 0 ? void 0 : _a.toString());
        yield user_model_1.User.findByIdAndUpdate({ _id: documentId }, { $set: {
                isActive: bodyData === null || bodyData === void 0 ? void 0 : bodyData.isActive
            } }, { upsert: true });
        return;
    }
    catch (e) {
        throw e;
    }
});
exports.updateUserDataStatus = updateUserDataStatus;
const deleteDeviceTokenData = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield deviceToken_model_1.DeviceToken.deleteOne({ token: token });
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.deleteDeviceTokenData = deleteDeviceTokenData;
const updatePaymentMethodData = (isCashOnDelivery) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield setting_model_1.Setting.updateMany({}, { $set: { isCashOnDelivery } }, { upsert: false });
        return;
    }
    catch (e) {
        throw e;
    }
});
exports.updatePaymentMethodData = updatePaymentMethodData;
const getPaymentMethodData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield setting_model_1.Setting.findOne();
        return result === null || result === void 0 ? void 0 : result.toObject();
    }
    catch (e) {
        throw e;
    }
});
exports.getPaymentMethodData = getPaymentMethodData;
