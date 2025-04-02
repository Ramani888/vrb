import mongoose, { Schema } from "mongoose";

const env = process.env;

const OrderSchema = new Schema({
    paymentId: {
        type: String,
        required: true
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

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const Order = dbConnection.model('Order', OrderSchema, 'Order');