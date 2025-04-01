import { AuthorizedRequest } from "../types/user";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { addWishlistData, getProductDetailsByUserId, getWishlistData, removeWishlistData } from "../services/wishlist.service";
import { updateProductWishlistFlag } from "../services/product.service";

export const addWishlist = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;

    try {
        const ProductDetailsData = await getProductDetailsByUserId(bodyData?.productId, bodyData?.userId);
        if (ProductDetailsData[0]?.isWishlist) {
            res.status(StatusCodes.OK).send({ success: true, message: "The product has already saved in your favorite list." });
            return;
        }
        await addWishlistData(bodyData)
        await updateProductWishlistFlag(bodyData?.productId, bodyData?.userId, true)
        return res.status(StatusCodes.OK).send({ success: true, message: "The product has saved successfully in your favorite list." });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const removeWishlist = async (req: AuthorizedRequest, res: Response) => {
    const { productId, userId } = req.query;
    try {
        await removeWishlistData(productId, userId);
        await updateProductWishlistFlag(productId, userId, false)
        return res.status(StatusCodes.OK).send({ success: true, message: "Product remove from wishlist." });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getWishlist = async (req: AuthorizedRequest, res: Response) => {
    const { userId } = req.query;
    
    try {
        const result = await getWishlistData(userId);

        const finalResult = result?.map(async (item: any) => {
            const productDetails = await getProductDetailsByUserId(item?.product?._id, userId);
            return {
                ...item,
                product: {
                    ...item?.product,
                    isWishlist: productDetails[0]?.isWishlist ? true : false,
                    isCart: productDetails[0]?.isCart ? true : false
                },
            }
        })

        const data = await Promise.all(finalResult);

        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}