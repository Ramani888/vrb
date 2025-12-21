import mongoose, { Schema } from "mongoose";

const env = process.env;

const ProductPlatingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
})

// Indexes for faster queries
ProductPlatingSchema.index({ name: 1 }); // Index for name lookups

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const ProductPlating = dbConnection.model('ProductPlating', ProductPlatingSchema, 'ProductPlating');