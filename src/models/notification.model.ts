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

// Indexes for faster queries
NotificationSchema.index({ userId: 1 }); // Index for user's notifications
NotificationSchema.index({ isRead: 1 }); // Index for read/unread filtering
NotificationSchema.index({ productId: 1 }); // Index for product lookups
NotificationSchema.index({ createdAt: -1 }); // Index for sorting by date
// Compound indexes for common query combinations
NotificationSchema.index({ userId: 1, isRead: 1 }); // User's read/unread notifications
NotificationSchema.index({ userId: 1, createdAt: -1 }); // User's notifications sorted by date

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const Notification = dbConnection.model('Notification', NotificationSchema, 'Notification');