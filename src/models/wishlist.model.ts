import mongoose, { Schema } from "mongoose";

const env = process.env;

const WishlistSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true,
    }
}, {timestamps: true})

// Indexes for faster queries
WishlistSchema.index({ userId: 1 }); // Index for user's wishlist items
WishlistSchema.index({ productId: 1 }); // Index for product lookups
// Compound index to ensure user can't add same product twice
WishlistSchema.index({ userId: 1, productId: 1 }, { unique: true }); // Unique combination

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const Wishlist = dbConnection.model('Wishlist', WishlistSchema, 'Wishlist');