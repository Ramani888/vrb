import mongoose, { Schema } from "mongoose";

const env = process.env;

const ProductBrandSchema = new Schema({
    name: {
        type: String,
        required: true
    },
})

// Indexes for faster queries
ProductBrandSchema.index({ name: 1 }); // Index for name lookups

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const ProductBrand = dbConnection.model('ProductBrand', ProductBrandSchema, 'ProductBrand');