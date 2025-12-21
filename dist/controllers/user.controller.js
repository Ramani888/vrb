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
exports.getPaymentMethod = exports.updatePaymentMethod = exports.updateUserStatus = exports.deleteUser = exports.getAllUser = exports.getUserById = exports.updateUser = exports.userRegisterLogin = exports.adminLogin = exports.userLogin = exports.insertRegisterUser = void 0;
const user_service_1 = require("../services/user.service");
const http_status_codes_1 = require("http-status-codes");
const auth_1 = require("../utils/helpers/auth");
const errors_1 = __importDefault(require("../utils/helpers/errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const global_1 = require("../utils/helpers/global");
const reward_service_1 = require("../services/reward.service");
const env = process.env;
const insertRegisterUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyData = req.body;
    try {
        const isUserExist = yield (0, user_service_1.getUserByNumber)(bodyData === null || bodyData === void 0 ? void 0 : bodyData.mobileNumber);
        if (isUserExist.length > 0) {
            return res.status(http_status_codes_1.StatusCodes.CONFLICT).send({ error: errors_1.default.NUMBER_ALREADY_REGISTER });
        }
        const newPassword = yield (0, auth_1.encryptPassword)(bodyData === null || bodyData === void 0 ? void 0 : bodyData.password);
        const userId = yield (0, user_service_1.insertRegisterUserData)(Object.assign(Object.assign({}, bodyData), { password: newPassword }));
        const deviceTokenData = {
            userId: userId === null || userId === void 0 ? void 0 : userId.toString(),
            token: bodyData === null || bodyData === void 0 ? void 0 : bodyData.fcm_token
        };
        yield (0, user_service_1.insertDeviceTokenData)(deviceTokenData);
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "User register successful." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.insertRegisterUser = insertRegisterUser;
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const bodyData = req.body;
    try {
        const isUserExist = yield (0, user_service_1.getUserByNumber)(bodyData === null || bodyData === void 0 ? void 0 : bodyData.mobileNumber);
        if (isUserExist.length === 0) {
            return res.status(http_status_codes_1.StatusCodes.CONFLICT).send({ error: errors_1.default.USER_NOT_FOUND });
        }
        const isPasswordValid = yield new Promise((resolve) => {
            var _a;
            return (0, auth_1.comparePassword)(bodyData === null || bodyData === void 0 ? void 0 : bodyData.password, String((_a = isUserExist[0]) === null || _a === void 0 ? void 0 : _a.password))
                .then((result) => resolve(result))
                .catch((error) => resolve(false));
        });
        if (!((_a = isUserExist[0]) === null || _a === void 0 ? void 0 : _a.isActive)) {
            return res.status(http_status_codes_1.StatusCodes.CONFLICT).send({ error: errors_1.default.INSUFFICIENT_PERMISSIONS });
        }
        if (isPasswordValid) {
            const SECRET_KEY = env.SECRET_KEY;
            const token = jsonwebtoken_1.default.sign({ userId: (_b = isUserExist[0]) === null || _b === void 0 ? void 0 : _b._id.toString(), username: (_c = isUserExist[0]) === null || _c === void 0 ? void 0 : _c.name }, SECRET_KEY, { expiresIn: '30d' });
            const userDataAndToken = {
                _id: (_d = isUserExist[0]) === null || _d === void 0 ? void 0 : _d._id,
                businessType: (_e = isUserExist[0]) === null || _e === void 0 ? void 0 : _e.businessType,
                name: (_f = isUserExist[0]) === null || _f === void 0 ? void 0 : _f.name,
                mobileNumber: (_g = isUserExist[0]) === null || _g === void 0 ? void 0 : _g.mobileNumber,
                email: (_h = isUserExist[0]) === null || _h === void 0 ? void 0 : _h.email,
                country: (_j = isUserExist[0]) === null || _j === void 0 ? void 0 : _j.country,
                state: (_k = isUserExist[0]) === null || _k === void 0 ? void 0 : _k.state,
                city: (_l = isUserExist[0]) === null || _l === void 0 ? void 0 : _l.city,
                pinCode: (_m = isUserExist[0]) === null || _m === void 0 ? void 0 : _m.pinCode,
                isActive: (_o = isUserExist[0]) === null || _o === void 0 ? void 0 : _o.isActive,
                token: token,
            };
            res.json({ userDataAndToken, message: 'User login successful.' });
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send({ error: errors_1.default.PASSWORDS_NOT_MATCH });
        }
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.userLogin = userLogin;
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const bodyData = req.body;
    try {
        const isAdminExist = yield (0, user_service_1.getAdminByEmail)(bodyData === null || bodyData === void 0 ? void 0 : bodyData.email);
        if (isAdminExist.length === 0) {
            return res.status(http_status_codes_1.StatusCodes.CONFLICT).send({ error: errors_1.default.EMAIL_NOT_FOUND });
        }
        if (((_a = isAdminExist[0]) === null || _a === void 0 ? void 0 : _a.password) === (bodyData === null || bodyData === void 0 ? void 0 : bodyData.password)) {
            return res.status(http_status_codes_1.StatusCodes.OK).send({ admin: isAdminExist[0], success: true, message: 'Login successfully' });
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send({ error: errors_1.default.PASSWORDS_NOT_MATCH });
        }
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.adminLogin = adminLogin;
const userRegisterLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    const bodyData = req.body;
    try {
        const isUserExist = yield (0, user_service_1.getUserByNumber)(bodyData === null || bodyData === void 0 ? void 0 : bodyData.mobileNumber);
        if ((isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.length) > 0) {
            const SECRET_KEY = env.SECRET_KEY;
            const token = jsonwebtoken_1.default.sign({ userId: (_a = isUserExist[0]) === null || _a === void 0 ? void 0 : _a._id.toString(), username: (_b = isUserExist[0]) === null || _b === void 0 ? void 0 : _b.name }, SECRET_KEY, { expiresIn: '30d' });
            const userDataAndToken = {
                _id: (_c = isUserExist[0]) === null || _c === void 0 ? void 0 : _c._id,
                businessType: (_d = isUserExist[0]) === null || _d === void 0 ? void 0 : _d.businessType,
                name: (_e = isUserExist[0]) === null || _e === void 0 ? void 0 : _e.name,
                mobileNumber: (_f = isUserExist[0]) === null || _f === void 0 ? void 0 : _f.mobileNumber,
                email: (_g = isUserExist[0]) === null || _g === void 0 ? void 0 : _g.email,
                country: (_h = isUserExist[0]) === null || _h === void 0 ? void 0 : _h.country,
                state: (_j = isUserExist[0]) === null || _j === void 0 ? void 0 : _j.state,
                city: (_k = isUserExist[0]) === null || _k === void 0 ? void 0 : _k.city,
                pinCode: (_l = isUserExist[0]) === null || _l === void 0 ? void 0 : _l.pinCode,
                isActive: (_m = isUserExist[0]) === null || _m === void 0 ? void 0 : _m.isActive,
                token: token,
            };
            res.json({ userDataAndToken, message: 'User login successful.' });
        }
        else {
            const password = (0, global_1.generatePassword)();
            const newPassword = yield (0, auth_1.encryptPassword)(password);
            const userId = yield (0, user_service_1.insertRegisterUserData)(Object.assign(Object.assign({}, bodyData), { password: newPassword }));
            const deviceTokenData = {
                userId: userId === null || userId === void 0 ? void 0 : userId.toString(),
                token: bodyData === null || bodyData === void 0 ? void 0 : bodyData.fcm_token
            };
            yield (0, user_service_1.insertDeviceTokenData)(deviceTokenData);
            const newUser = yield (0, user_service_1.getUserByNumber)(bodyData === null || bodyData === void 0 ? void 0 : bodyData.mobileNumber);
            const SECRET_KEY = env.SECRET_KEY;
            const token = jsonwebtoken_1.default.sign({ userId: (_o = newUser[0]) === null || _o === void 0 ? void 0 : _o._id.toString(), username: (_p = newUser[0]) === null || _p === void 0 ? void 0 : _p.name }, SECRET_KEY, { expiresIn: '30d' });
            const userDataAndToken = {
                _id: (_q = newUser[0]) === null || _q === void 0 ? void 0 : _q._id,
                businessType: (_r = newUser[0]) === null || _r === void 0 ? void 0 : _r.businessType,
                name: (_s = newUser[0]) === null || _s === void 0 ? void 0 : _s.name,
                mobileNumber: (_t = newUser[0]) === null || _t === void 0 ? void 0 : _t.mobileNumber,
                email: (_u = newUser[0]) === null || _u === void 0 ? void 0 : _u.email,
                country: (_v = newUser[0]) === null || _v === void 0 ? void 0 : _v.country,
                state: (_w = newUser[0]) === null || _w === void 0 ? void 0 : _w.state,
                city: (_x = newUser[0]) === null || _x === void 0 ? void 0 : _x.city,
                pinCode: (_y = newUser[0]) === null || _y === void 0 ? void 0 : _y.pinCode,
                isActive: (_z = newUser[0]) === null || _z === void 0 ? void 0 : _z.isActive,
                token: token,
            };
            res.json({ userDataAndToken, message: 'User login successful.' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.userRegisterLogin = userRegisterLogin;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyData = req.body;
    try {
        yield (0, user_service_1.updateUserData)(bodyData);
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "User data updated." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.updateUser = updateUser;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        const data = yield (0, user_service_1.getUserDataById)(userId);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getUserById = getUserById;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield (0, user_service_1.getAllUserData)();
        const finalData = userData === null || userData === void 0 ? void 0 : userData.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const rewardData = yield (0, reward_service_1.getRewardData)((_a = item === null || item === void 0 ? void 0 : item._id) === null || _a === void 0 ? void 0 : _a.toString());
            return Object.assign(Object.assign({}, item === null || item === void 0 ? void 0 : item._doc), { rewardData });
        }));
        const data = yield Promise.all(finalData);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getAllUser = getAllUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        yield (0, user_service_1.deleteUserData)(userId);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "User data deleted." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.deleteUser = deleteUser;
const updateUserStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyData = req.body;
    try {
        yield (0, user_service_1.updateUserDataStatus)(bodyData);
        return res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "User status updated." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.updateUserStatus = updateUserStatus;
const updatePaymentMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isCashOnDelivery } = req === null || req === void 0 ? void 0 : req.query;
    try {
        yield (0, user_service_1.updatePaymentMethodData)(isCashOnDelivery);
        res.status(http_status_codes_1.StatusCodes.OK).send({ success: true, message: "Payment method updated successfully." });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.updatePaymentMethod = updatePaymentMethod;
const getPaymentMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, user_service_1.getPaymentMethodData)();
        res.status(http_status_codes_1.StatusCodes.OK).send({ data });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
});
exports.getPaymentMethod = getPaymentMethod;
