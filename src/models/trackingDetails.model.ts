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

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const TrackingDetails = dbConnection.model('TrackingDetails', TrackingDetailsSchema, 'TrackingDetails');