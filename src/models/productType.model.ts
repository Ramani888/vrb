import mongoose, { Schema } from "mongoose";

const env = process.env;

const ProductTypeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
})

// Indexes for faster queries
ProductTypeSchema.index({ name: 1 }); // Index for name lookups

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const ProductType = dbConnection.model('ProductType', ProductTypeSchema, 'ProductType');