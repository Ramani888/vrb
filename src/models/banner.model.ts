import mongoose, { Schema } from "mongoose";

const env = process.env;

const BannerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    }
}, {timestamps: true})

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const Banner = dbConnection.model('Banner', BannerSchema, 'Banner');