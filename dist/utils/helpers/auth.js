"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.encryptPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env = process.env;
const encryptPassword = (password) => {
    return new Promise((resolve) => {
        bcryptjs_1.default.genSalt(5, function (err, salt) {
            bcryptjs_1.default.hash(password, salt, function (err, hash) {
                return resolve(hash);
            });
        });
    });
};
exports.encryptPassword = encryptPassword;
const comparePassword = (storedPassword, validatePassword) => {
    if (storedPassword === validatePassword) {
        return Promise.resolve(true);
    }
    return new Promise((resolve, reject) => {
        bcryptjs_1.default.compare(storedPassword, validatePassword, (err, res) => {
            if (err)
                return reject(err);
            return res === true ? resolve(res) : reject(new Error('Passwords do not match.'));
        });
    });
};
exports.comparePassword = comparePassword;
