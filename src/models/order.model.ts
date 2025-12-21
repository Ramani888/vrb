import mongoose, { Schema } from "mongoose";

const env = process.env;

const OrderSchema = new Schema({
    paymentId: {
        type: String,
        required: false
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true
    },
    deliveryAddressId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Ready To Ship', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, { timestamps: true });

// Indexes for faster queries
OrderSchema.index({ userId: 1 }); // Index for user's orders
OrderSchema.index({ status: 1 }); // Index for status filtering
OrderSchema.index({ paymentId: 1 }); // Index for payment lookup
OrderSchema.index({ createdAt: -1 }); // Index for sorting by date
// Compound indexes for common query combinations
OrderSchema.index({ userId: 1, status: 1 }); // User's orders by status
OrderSchema.index({ userId: 1, createdAt: -1 }); // User's orders sorted by date

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const Order = dbConnection.model('Order', OrderSchema, 'Order');