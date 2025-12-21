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

// Indexes for faster queries
CartSchema.index({ userId: 1 }); // Index for user's cart items
CartSchema.index({ productId: 1 }); // Index for product lookups
// Compound index to ensure user can't add same product twice
CartSchema.index({ userId: 1, productId: 1 }, { unique: true }); // Unique combination

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const Cart = dbConnection.model('Cart', CartSchema, 'Cart');