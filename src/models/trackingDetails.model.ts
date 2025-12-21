import mongoose, { Schema } from "mongoose";

const env = process.env;

const TrackingDetailsSchema = new Schema({
    trackingId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    packingId: {
        type: String,
        required: true
    },
    video: {
        type: String,
    }
}, {timestamps: true})

// Indexes for faster queries
TrackingDetailsSchema.index({ trackingId: 1 }, { unique: true }); // Unique index for tracking ID
TrackingDetailsSchema.index({ orderId: 1 }); // Index for order lookups
TrackingDetailsSchema.index({ packingId: 1 }); // Index for packing lookups
TrackingDetailsSchema.index({ createdAt: -1 }); // Index for sorting by date

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const TrackingDetails = dbConnection.model('TrackingDetails', TrackingDetailsSchema, 'TrackingDetails');