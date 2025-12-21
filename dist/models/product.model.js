"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const env = process.env;
// Define a schema for each image object within imagePath array
const ImageSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    }
});
const ProductSchema = new mongoose_1.Schema({
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
const dbConnection = mongoose_1.default.connection.useDb((_a = env.MONGODB_DATABASE) !== null && _a !== void 0 ? _a : '');
exports.Product = dbConnection.model('Product', ProductSchema, 'Product');
