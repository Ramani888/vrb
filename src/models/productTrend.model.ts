import mongoose, { Schema } from "mongoose";

const env = process.env;

const ProductTrendSchema = new Schema({
    name: {
        type: String,
        required: true
    },
})

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const ProductTrend = dbConnection.model('ProductTrend', ProductTrendSchema, 'ProductTrend');