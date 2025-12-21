import mongoose, { Schema } from "mongoose";

const env = process.env;

const ProductDetailsSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true,
    },
    isWishlist: {
        type: Boolean,
        default: false
    },
    isCart: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Indexes for faster queries
ProductDetailsSchema.index({ userId: 1 }); // Index for user's product details
ProductDetailsSchema.index({ productId: 1 }); // Index for product lookups
ProductDetailsSchema.index({ isWishlist: 1 }); // Index for wishlist filtering
ProductDetailsSchema.index({ isCart: 1 }); // Index for cart filtering
// Compound indexes for common query combinations
ProductDetailsSchema.index({ userId: 1, productId: 1 }, { unique: true }); // Unique combination
ProductDetailsSchema.index({ userId: 1, isWishlist: 1 }); // User's wishlist items
ProductDetailsSchema.index({ userId: 1, isCart: 1 }); // User's cart items

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const ProductDetails = dbConnection.model('ProductDetails', ProductDetailsSchema, 'ProductDetails');