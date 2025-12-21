import mongoose, { Schema } from "mongoose";

const env = process.env;

const UnloadingDetailsSchema = new Schema({
    orderId: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    videoUrl: {
        type: String
    }
}, {timestamps: true})

// Indexes for faster queries
UnloadingDetailsSchema.index({ orderId: 1 }); // Index for order lookups
UnloadingDetailsSchema.index({ createdAt: -1 }); // Index for sorting by date

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const UnloadingDetails = dbConnection.model('UnloadingDetails', UnloadingDetailsSchema, 'UnloadingDetails');