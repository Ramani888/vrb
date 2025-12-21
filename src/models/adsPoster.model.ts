import mongoose, { Schema } from "mongoose";

const env = process.env;

const AdsPosterSchema = new Schema({
    imagePath: String
}, {timestamps: true})

// Indexes for faster queries
AdsPosterSchema.index({ createdAt: -1 }); // Index for sorting by creation date

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const AdsPoster = dbConnection.model('AdsPoster', AdsPosterSchema, 'AdsPoster');