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

// Indexes for faster queries
RazorpayOrderSchema.index({ razorpayOrderId: 1 }, { unique: true }); // Unique index for razorpay order ID
RazorpayOrderSchema.index({ paymentId: 1 }); // Index for payment lookups
RazorpayOrderSchema.index({ status: 1 }); // Index for status filtering
RazorpayOrderSchema.index({ createdAt: -1 }); // Index for sorting by creation date

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const RazorpayOrder = dbConnection.model('RazorpayOrder', RazorpayOrderSchema, 'RazorpayOrder');