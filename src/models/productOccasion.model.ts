import mongoose, { Schema } from "mongoose";

const env = process.env;

const ProductOccasionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
})

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const ProductOccasion = dbConnection.model('ProductOccasion', ProductOccasionSchema, 'ProductOccasion');