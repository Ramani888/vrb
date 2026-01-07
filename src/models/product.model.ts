import mongoose, { Schema } from "mongoose";

const env = process.env;

// Define a schema for each image object within imagePath array
const ImageSchema = new Schema({
    path: {
        type: String,
        required: true
    }
}, { _id: true });

const ProductSchema = new Schema({
    categoryId: {
        type: String,
        required: true
    },
    productBaseMetalId: {
        type: String,
        required: false
    },
    productPlatingId: {
        type: String,
        required: false
    },
    productStoneTypeId: {
        type: String,
        required: false
    },
    productTrendId: {
        type: String,
        required: false
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

// Indexes for faster queries
ProductSchema.index({ categoryId: 1 }); // Index for category filtering
ProductSchema.index({ code: 1 }, { unique: true }); // Unique index for product code
ProductSchema.index({ name: 1 }); // Index for name search
ProductSchema.index({ price: 1 }); // Index for price sorting/filtering
ProductSchema.index({ isPramotion: 1 }); // Index for promotion filtering
ProductSchema.index({ isPause: 1 }); // Index for pause status filtering
ProductSchema.index({ productBrandId: 1 }); // Index for brand filtering
ProductSchema.index({ productTypeId: 1 }); // Index for type filtering
ProductSchema.index({ createdAt: -1 }); // Index for sorting by creation date
// Compound indexes for common query combinations
ProductSchema.index({ categoryId: 1, isPause: 1, isPramotion: 1 }); // Combined filter queries
ProductSchema.index({ categoryId: 1, price: 1 }); // Category with price sorting

const dbConnection = mongoose.connection.useDb(env.MONGODB_DATABASE ?? '');
export const Product = dbConnection.model('Product', ProductSchema, 'Product');
