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

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const UnloadingDetails = dbConnection.model('UnloadingDetails', UnloadingDetailsSchema, 'UnloadingDetails');