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

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const Wishlist = dbConnection.model('Wishlist', WishlistSchema, 'Wishlist');