import mongoose, { Schema } from "mongoose";

const env = process.env;

const ProductTrendSchema = new Schema({
    name: {
        type: String,
        required: true
    },
})

// Indexes for faster queries
ProductTrendSchema.index({ name: 1 }); // Index for name lookups

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const ProductTrend = dbConnection.model('ProductTrend', ProductTrendSchema, 'ProductTrend');