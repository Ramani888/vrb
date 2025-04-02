import mongoose, { Schema } from "mongoose";

const env = process.env;

const ProductBaseMetalSchema = new Schema({
    name: {
        type: String,
        required: true
    },
})

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const ProductBaseMetal = dbConnection.model('ProductBaseMetal', ProductBaseMetalSchema, 'ProductBaseMetal');