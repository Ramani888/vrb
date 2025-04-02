
import { AuthorizedRequest, IUsers } from "../types/user";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { getProductDataById, updateProductCartFlag } from "../services/product.service";
import { getProductDetailsByUserId } from "../services/wishlist.service";
import { addToCartData, getCartCountData, getCartData, removeToCartData, updateCartData } from "../services/cart.service";
import { getUserDataById } from "../services/user.service";
import { checkUserGujratState, checkUserLocationAndGetDeliveryCharge } from "../utils/helpers/global";

export const addToCart = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;
    try {
        const ProductData = await getProductDataById(bodyData?.productId);
        const ProductDetailsData = await getProductDetailsByUserId(bodyData?.productId, bodyData?.userId);
        if (ProductDetailsData[0]?.isCart) {
            res.status(StatusCodes.OK).send({ success: true, message: "The product has already added in your cart list" });
            return;
        }
        await addToCartData({...bodyData, total: bodyData?.qty * ProductData[0].price})
        await updateProductCartFlag(bodyData?.productId, bodyData?.userId, true)
        res.status(StatusCodes.OK).send({ success: true, message: "The product has added successfully in your cart list." });
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}

export const removeToCart = async (req: AuthorizedRequest, res: Response) => {
    const { productId, userId } = req.query;
    try {
        await removeToCartData(productId, userId);
        await updateProductCartFlag(productId, userId, false)
        res.status(StatusCodes.OK).send({ success: true, message: "Product remove from cart." });
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}

export const getCart = async (req: AuthorizedRequest, res: Response) => {
    const { userId } = req.query;
    try {
        const result = await getCartData(userId);
        let userData = await getUserDataById(userId);

        if (!userData) {
            res.status(StatusCodes.NOT_FOUND).send({ error: 'User data not found.' });
            return;
        }

        const finalResult = await Promise.all(
            result?.data?.map(async (item: any) => {
                const productDetails = await getProductDetailsByUserId(item?.product?._id, userId);
                const { gst, ...rest } = item?.product;

                return {
                    ...item,
                    product: {
                        ...rest,
                        isWishlist: productDetails[0]?.isWishlist || false,
                        isCart: productDetails[0]?.isCart || false,
                        deliveryCharge: checkUserLocationAndGetDeliveryCharge(userData, item?.product) ?? 0,
                        ...(gst
                            ? checkUserGujratState(userData, item?.product)
                                ? { gst: Number(gst) }
                                : { sgst: Number(gst) / 2, igst: Number(gst) / 2 }
                            : {}),
                    },
                };
            })
        );

        let totalDeliveryCharge = 0;

        if (result?.totalWeight <= 499) {
            totalDeliveryCharge = 70;
        } else if (result?.totalWeight > 499 && result?.totalWeight <= 999) {
            totalDeliveryCharge = 140;
        } else if (result?.totalWeight > 999) {
            totalDeliveryCharge = 210;
        }

        res.status(StatusCodes.OK).send({
            data: {
                data: finalResult,
                totalAmount: result?.totalAmount,
                totalQty: result?.totalQty,
                totalDeliveryCharge: totalDeliveryCharge
            },
        });

    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}

export const updateCart = async (req: AuthorizedRequest, res: Response) => {
    const { productId, userId, qty } = req?.body
    try {
        const data = await getProductDataById(productId);
        await updateCartData(productId, userId, qty, data[0].price);
        res.status(StatusCodes.OK).send({ success: true, message: "Product qty updated." });
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}

export const getCartCount = async (req: AuthorizedRequest, res: Response) => {
    const { userId } = req.query;
    try {
        const data = await getCartCountData(userId);
        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}