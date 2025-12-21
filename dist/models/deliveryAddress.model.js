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
exports.DeliveryAddress = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const env = process.env;
const DeliveryAddressSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
// Indexes for faster queries
DeliveryAddressSchema.index({ userId: 1 }); // Index for user's delivery addresses
DeliveryAddressSchema.index({ pinCode: 1 }); // Index for pincode lookups
DeliveryAddressSchema.index({ city: 1, state: 1 }); // Compound index for location-based queries
DeliveryAddressSchema.index({ createdAt: -1 }); // Index for sorting by creation date
const dbConnection = mongoose_1.default.connection.useDb((_a = env.MONGODB_DATABASE) !== null && _a !== void 0 ? _a : '');
exports.DeliveryAddress = dbConnection.model('DeliveryAddress', DeliveryAddressSchema, 'DeliveryAddress');
