import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const env = process.env;

const UserSchema = new Schema({
    businessType: {
        type: String,
        default: 'Other'
    },
    name: {
        type: String,
        default: 'Hello'
    },
    companyName: String,
    mobileNumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
    },
    phoneNumber: Number,
    addressFirst: String,
    addressSecond: String,
    area: String,
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pinCode: {
        type: Number,
        required: true
    },
    panNo: String,
    gstNo: String,
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, {timestamps: true})

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const User = dbConnection.model('User', UserSchema, 'Users');