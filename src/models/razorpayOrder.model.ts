import mongoose, { Schema } from "mongoose";
const env = process.env;

const RazorpayOrderSchema = new mongoose.Schema({
  razorpayOrderId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  receipt: { type: String },
  status: { type: String },
  paymentId: { type: String }
}, {timestamps: true});

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const RazorpayOrder = dbConnection.model('RazorpayOrder', RazorpayOrderSchema, 'RazorpayOrder');