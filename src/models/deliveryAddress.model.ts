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

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const DeliveryAddress = dbConnection.model('DeliveryAddress', DeliveryAddressSchema, 'DeliveryAddress');