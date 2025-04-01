import { ProductDetails } from "../models/productDetails.model";

export const updateProductWishlistFlag = async (productId: string, userId: string, isWishlist: boolean) => {
    try {
        await ProductDetails.findOneAndUpdate(
            { userId: userId, productId: productId },
            { $set: {
                isWishlist: isWishlist,
            }},
            {
                upsert: true,
            }
        );
        return;
    } catch (err) {
        throw err;
    }
};