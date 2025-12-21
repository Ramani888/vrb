import mongoose, { Schema } from "mongoose";

const env = process.env;

const DeviceTokenSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true,
    }
}, {timestamps: true})

// Indexes for faster queries
DeviceTokenSchema.index({ userId: 1 }); // Index for user's device tokens
DeviceTokenSchema.index({ token: 1 }); // Index for token lookups
DeviceTokenSchema.index({ userId: 1, token: 1 }, { unique: true }); // Unique combination

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const DeviceToken = dbConnection.model('DeviceToken', DeviceTokenSchema, 'DeviceToken');