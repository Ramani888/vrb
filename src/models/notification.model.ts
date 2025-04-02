import mongoose, { Schema } from "mongoose";

const env = process.env;

const NotificationSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subTitle: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true})

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const Notification = dbConnection.model('Notification', NotificationSchema, 'Notification');