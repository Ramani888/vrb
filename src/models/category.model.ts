import mongoose, { Schema } from "mongoose";

const env = process.env;

const CategorySchema = new Schema({
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
export const Category = dbConnection.model('Category', CategorySchema, 'Category');