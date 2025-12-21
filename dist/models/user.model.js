"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const env = process.env;
const UserSchema = new mongoose_2.Schema({
    businessType: {
        type: String,
        default: 'Other'
    },
    name: {
        type: String,
        default: 'Hello'
    },
    companyName: String,
    mobileNumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
    },
    phoneNumber: Number,
    addressFirst: String,
    addressSecond: String,
    area: String,
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pinCode: {
        type: Number,
        required: true
    },
    panNo: String,
    gstNo: String,
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });
// Indexes for faster queries
UserSchema.index({ mobileNumber: 1 }, { unique: true }); // Unique index for mobile number
UserSchema.index({ email: 1 }); // Index for email lookups
UserSchema.index({ isActive: 1 }); // Index for active user queries
UserSchema.index({ city: 1, state: 1 }); // Compound index for location-based queries
UserSchema.index({ createdAt: -1 }); // Index for sorting by creation date
const dbConnection = mongoose_1.default.connection.useDb((_a = env.MONGODB_DATABASE) !== null && _a !== void 0 ? _a : '');
exports.User = dbConnection.model('User', UserSchema, 'Users');
