import mongoose, { Schema } from "mongoose";

const env = process.env;

// Define a schema for each image object within imagePath array
const ImageSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    }
});

const ProductSchema = new Schema({
    categoryId: {
        type: String,
        required: true
    },
    productBaseMetalId: {
        type: String,
        required: true
    },
    productPlatingId: {
        type: String,
        required: true
    },
    productStoneTypeId: {
        type: String,
        required: true
    },
    productTrendId: {
        type: String,
        required: true
    },
    productBrandId: String,
    productColorId: String,
    productOccasionId: String,
    productTypeId: String,
    name: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: [ImageSchema], // Use the ImageSchema for imagePath
    },
    videoPath: {
        type: String // Add the videoPath field
    },
    code: {
        type: String,
        required: true
    },
    gst: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    mrp: {
        type: Number,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    size: [String],
    weight: Number,
    discount: Number,
    reward: Number,
    inSuratCityCharge: {
        type: Number,
        required: true
    },
    inGujratStateCharge: {
        type: Number,
        required: true
    },
    inOutStateCharge: {
        type: Number,
        required: true
    },
    isPramotion: {
        type: Boolean,
        default: false
    },
    isPause: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const Product = dbConnection.model('Product', ProductSchema, 'Product');
