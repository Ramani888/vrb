import mongoose, { Schema } from "mongoose";

const env = process.env;

const ProductColorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
})

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const ProductColor = dbConnection.model('ProductColor', ProductColorSchema, 'ProductColor');