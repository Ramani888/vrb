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
exports.Reward = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const env = process.env;
const RewardSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true,
    },
    reward: {
        type: Number,
        required: true,
    },
    isEarned: {
        type: Boolean,
    },
    isRedeemed: {
        type: Boolean,
    }
}, { timestamps: true });
// Indexes for faster queries
RewardSchema.index({ userId: 1 }); // Index for user's rewards
RewardSchema.index({ orderId: 1 }); // Index for order rewards
RewardSchema.index({ isEarned: 1 }); // Index for earned status filtering
RewardSchema.index({ isRedeemed: 1 }); // Index for redeemed status filtering
// Compound indexes for common query combinations
RewardSchema.index({ userId: 1, isEarned: 1 }); // User's earned rewards
RewardSchema.index({ userId: 1, isRedeemed: 1 }); // User's redeemed/unredeemed rewards
RewardSchema.index({ userId: 1, createdAt: -1 }); // User's rewards sorted by date
const dbConnection = mongoose_1.default.connection.useDb((_a = env.MONGODB_DATABASE) !== null && _a !== void 0 ? _a : '');
exports.Reward = dbConnection.model('Reward', RewardSchema, 'Reward');
