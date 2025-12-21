import mongoose, { Schema } from "mongoose";

const env = process.env;

const ProductOccasionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
})

// Indexes for faster queries
ProductOccasionSchema.index({ name: 1 }); // Index for name lookups

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const ProductOccasion = dbConnection.model('ProductOccasion', ProductOccasionSchema, 'ProductOccasion');