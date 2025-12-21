import mongoose, { Schema } from "mongoose";

const env = process.env;

const DeliveryAddressSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    addressFirst: {
        type: String,
        required: true
    },
    addressSecond: {
        type: String,
        required: false
    },
    area: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        required: false
    },
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
    }
}, {timestamps: true})

// Indexes for faster queries
DeliveryAddressSchema.index({ userId: 1 }); // Index for user's delivery addresses
DeliveryAddressSchema.index({ pinCode: 1 }); // Index for pincode lookups
DeliveryAddressSchema.index({ city: 1, state: 1 }); // Compound index for location-based queries
DeliveryAddressSchema.index({ createdAt: -1 }); // Index for sorting by creation date

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const DeliveryAddress = dbConnection.model('DeliveryAddress', DeliveryAddressSchema, 'DeliveryAddress');