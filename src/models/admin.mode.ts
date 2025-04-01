import mongoose, { Schema } from "mongoose";

const env = process.env;

const AdminSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
}, {timestamps: true})

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const Admin = dbConnection.model('Admin', AdminSchema, 'Admin');