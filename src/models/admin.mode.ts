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

// Indexes for faster queries
AdminSchema.index({ email: 1 }, { unique: true }); // Unique index for admin email

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const Admin = dbConnection.model('Admin', AdminSchema, 'Admin');