import mongoose, { Schema } from "mongoose";

const env = process.env;

const ProductBaseMetalSchema = new Schema({
    name: {
        type: String,
        required: true
    },
})

// Indexes for faster queries
ProductBaseMetalSchema.index({ name: 1 }); // Index for name lookups

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const ProductBaseMetal = dbConnection.model('ProductBaseMetal', ProductBaseMetalSchema, 'ProductBaseMetal');