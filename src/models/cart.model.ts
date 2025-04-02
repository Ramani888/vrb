import mongoose, { Schema } from "mongoose";

const env = process.env;

const CartSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true,
    },
    qty: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
}, {timestamps: true})

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const Cart = dbConnection.model('Cart', CartSchema, 'Cart');