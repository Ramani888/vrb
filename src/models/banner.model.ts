import mongoose, { Schema } from "mongoose";

const env = process.env;

const BannerSchema = new Schema({
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
BannerSchema.index({ name: 1 }); // Index for banner name lookups
BannerSchema.index({ createdAt: -1 }); // Index for sorting by creation date

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const Banner = dbConnection.model('Banner', BannerSchema, 'Banner');