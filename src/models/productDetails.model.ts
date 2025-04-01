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

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const ProductDetails = dbConnection.model('ProductDetails', ProductDetailsSchema, 'ProductDetails');