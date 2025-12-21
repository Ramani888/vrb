"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayOrder = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env = process.env;
const RazorpayOrderSchema = new mongoose_1.default.Schema({
    razorpayOrderId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    receipt: { type: String },
    status: { type: String },
    paymentId: { type: String }
}, { timestamps: true });
const dbConnection = mongoose_1.default.connection.useDb((_a = env.MONGODB_DATABASE) !== null && _a !== void 0 ? _a : '');
exports.RazorpayOrder = dbConnection.model('RazorpayOrder', RazorpayOrderSchema, 'RazorpayOrder');
