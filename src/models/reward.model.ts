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

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const Reward = dbConnection.model('Reward', RewardSchema, 'Reward');