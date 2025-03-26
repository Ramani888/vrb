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

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const DeviceToken = dbConnection.model('DeviceToken', DeviceTokenSchema, 'DeviceToken');