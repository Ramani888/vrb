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

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const OrderDetails = dbConnection.model('OrderDetails', OrderDetailsSchema, 'OrderDetails');