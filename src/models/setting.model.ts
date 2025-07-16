import mongoose, { Schema } from "mongoose";

const env = process.env;

const SettingSchema = new Schema({
    isCashOnDelivery: {
        type: Boolean
    }
}, { timestamps: true });

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const Setting = dbConnection.model('Setting', SettingSchema, 'Setting');