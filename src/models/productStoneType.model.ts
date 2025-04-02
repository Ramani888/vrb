import mongoose, { Schema } from "mongoose";

const env = process.env;

const ProductStoneTypeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
})

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const ProductStoneType = dbConnection.model('ProductStoneType', ProductStoneTypeSchema, 'ProductStoneType');