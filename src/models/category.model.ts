import mongoose, { Schema } from "mongoose";

const env = process.env;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    }
}, {timestamps: true})

// Indexes for faster queries
CategorySchema.index({ name: 1 }); // Index for category name lookups
CategorySchema.index({ createdAt: -1 }); // Index for sorting by creation date

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const Category = dbConnection.model('Category', CategorySchema, 'Category');