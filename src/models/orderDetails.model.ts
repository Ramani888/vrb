import mongoose, { Schema } from "mongoose";

const env = process.env;

const OrderDetailsSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Indexes for faster queries
OrderDetailsSchema.index({ userId: 1 }); // Index for user's order details
OrderDetailsSchema.index({ orderId: 1 }); // Index for order's details
OrderDetailsSchema.index({ productId: 1 }); // Index for product lookups
OrderDetailsSchema.index({ createdAt: -1 }); // Index for sorting by date

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const OrderDetails = dbConnection.model('OrderDetails', OrderDetailsSchema, 'OrderDetails');