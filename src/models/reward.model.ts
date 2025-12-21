import mongoose, { Schema } from "mongoose";

const env = process.env;

const RewardSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true,
    },
    reward: {
        type: Number,
        required: true,
    },
    isEarned: {
        type: Boolean,
    },
    isRedeemed: {
        type: Boolean,
    }
}, {timestamps: true})

// Indexes for faster queries
RewardSchema.index({ userId: 1 }); // Index for user's rewards
RewardSchema.index({ orderId: 1 }); // Index for order rewards
RewardSchema.index({ isEarned: 1 }); // Index for earned status filtering
RewardSchema.index({ isRedeemed: 1 }); // Index for redeemed status filtering
// Compound indexes for common query combinations
RewardSchema.index({ userId: 1, isEarned: 1 }); // User's earned rewards
RewardSchema.index({ userId: 1, isRedeemed: 1 }); // User's redeemed/unredeemed rewards
RewardSchema.index({ userId: 1, createdAt: -1 }); // User's rewards sorted by date

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const Reward = dbConnection.model('Reward', RewardSchema, 'Reward');