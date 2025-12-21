import mongoose, { Schema } from "mongoose";

const env = process.env;

const SettingSchema = new Schema({
    isCashOnDelivery: {
        type: Boolean
    }
}, { timestamps: true });

// Indexes for faster queries
SettingSchema.index({ createdAt: -1 }); // Index for sorting by creation date

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const Setting = dbConnection.model('Setting', SettingSchema, 'Setting');