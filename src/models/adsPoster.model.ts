import mongoose, { Schema } from "mongoose";

const env = process.env;

const AdsPosterSchema = new Schema({
    imagePath: String
}, {timestamps: true})

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const AdsPoster = dbConnection.model('AdsPoster', AdsPosterSchema, 'AdsPoster');