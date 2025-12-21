"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRewardData = exports.getRewardData = void 0;
const reward_model_1 = require("../models/reward.model");
const getRewardData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rewards = yield reward_model_1.Reward.find({ userId }).exec();
        const totalEarnedReward = rewards
            .filter(reward => reward.isEarned)
            .reduce((total, reward) => total + reward.reward, 0);
        const totalRedeemedReward = rewards
            .filter(reward => reward.isRedeemed)
            .reduce((total, reward) => total + reward.reward, 0);
        const remainingReward = totalEarnedReward - totalRedeemedReward;
        return {
            userId,
            rewards,
            remainingReward,
            totalEarnedReward,
            totalRedeemedReward
        };
    }
    catch (e) {
        console.error(`Failed to get reward data for user ${userId}:`, e);
        throw e;
    }
});
exports.getRewardData = getRewardData;
const addRewardData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newData = new reward_model_1.Reward(data);
        yield newData.save();
        return newData._id;
    }
    catch (e) {
        throw e;
    }
});
exports.addRewardData = addRewardData;
