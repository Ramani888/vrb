import { Reward } from "../models/reward.model";

export const getRewardData = async (userId: string) => {
    try {
        const rewards = await Reward.find({ userId }).exec();

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
    } catch (e) {
        console.error(`Failed to get reward data for user ${userId}:`, e);
        throw e;
    }
}