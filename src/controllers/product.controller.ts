import { AuthorizedRequest } from "../types/user";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { addProductData, deleteProductData, deleteProductDetailsData, getAllProductData, getPramotionProductData, getProductBaseMetalData, getProductBrandData, getProductColorData, getProductDataByCategoryId, getProductDataById, getProductDetailsByUserId, getProductOccasionData, getProductPlatingData, getProductStoneTypeData, getProductTrendData, getProductTypeData, getProductUnderFiveData, getProductUnderTenData, getProductUnderThreeData, getProductUnderTwoData, updateProductActionData, updateProductData, updateProductDiscountData, updateProductPramotionFlagData, updateProductRewardData } from "../services/product.service";
import { getCategoryDataById } from "../services/category.service";
import { DeviceToken } from "../models/deviceToken.model";
import { insertNotificationData } from "../services/notification.service";
import { sendBulkPushNotification } from "./notification.controller";
import { checkUserGujratState, checkUserLocationAndGetDeliveryCharge, deleteImageS3 } from "../utils/helpers/global";
import { getUserDataById } from "../services/user.service";
import { removeWishlistData, removeWishlistDataAllUser } from "../services/wishlist.service";
import { removeToCartDataAllUser } from "../services/cart.service";

export const addProduct = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;
    try {
        const productId = await addProductData(bodyData);

        const categoryData = await getCategoryDataById(bodyData?.categoryId)
        const tokens = await DeviceToken.find();

        const tokenData = tokens?.map((data) => data?.token);

        const userIds = tokens?.map((data) => data?.userId);

        userIds?.map(async (userId) => {
            const notificationData = {
                title: categoryData[0]?.name,
                subTitle: bodyData?.name,
                imageUrl: bodyData?.image[0]?.path,
                userId: userId,
                productId: productId,
                productName: bodyData?.name
            }
            await insertNotificationData(notificationData);
        })

        const pushNotificationData = {
            title: categoryData[0]?.name,
            body: bodyData?.name,
        }

        await sendBulkPushNotification(tokenData, pushNotificationData);
        res.status(StatusCodes.OK).send({ success: true, message: "Product data inserted." });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const updateProduct = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;
    try {

        if (bodyData?.deleteImages) {
            for (const deleteImageData of bodyData?.deleteImages) {
                if (deleteImageData?.path) {
                    await deleteImageS3(deleteImageData?.path);
                }
            }
        }

        if (bodyData?.deleteVideo?.length > 0) {
            await deleteImageS3(bodyData?.deleteVideo);
        }

        await updateProductData({...bodyData})
        res.status(StatusCodes.OK).send({ success: true, message: "Product data updated." });

    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getAllProduct = async (req: AuthorizedRequest, res: Response) => {
    const { userId } = req.query;
    try {
        const result = await getAllProductData();

        if (!userId) {
            const data = result?.map((item: any) => {
                return {
                    ...item?._doc,
                    isWishlist: false,
                    isCart: false,
                    deliveryCharge: 0
                }
            })
            return res.status(StatusCodes.OK).send({ data });
        }

        const userData = await getUserDataById(userId);

        if (!userData) {
            res.status(StatusCodes.BAD_REQUEST).send({ error: 'user data not found.' });
            return;
        }

        const finalResult = result?.map(async (item: any) => {

            const productDetails = await getProductDetailsByUserId(item?._id?.toString(), userId);
            const { gst, ...rest } = item?._doc;

            return {
                ...rest,
                isWishlist: productDetails[0]?.isWishlist ? true : false,
                isCart: productDetails[0]?.isCart ? true : false,
                deliveryCharge: checkUserLocationAndGetDeliveryCharge(userData, item) ?? 0,
                ...((item?.gst) ? checkUserGujratState(userData, item) ?  {gst: Number(item?.gst)} : {sgst: Number(item?.gst)/2, igst: Number(item?.gst)/2} : {})
            }
        })

        const data = await Promise.all(finalResult);

        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getProductByCategoryId = async (req: AuthorizedRequest, res: Response) => {
    const { categoryId, userId } = req.query;

    if (!categoryId) {
        res.status(StatusCodes.BAD_REQUEST).send({ error: 'Params categoryId data is empty.' });
        return;
    }

    try {
        const result = await getProductDataByCategoryId(categoryId);

        if (!userId) {
            const data = result?.map((item: any) => {
                return {
                    ...item?._doc,
                    isWishlist: false,
                    isCart: false,
                    deliveryCharge: 0
                }
            })
            return res.status(StatusCodes.OK).send({ data });
        }

        const userData = await getUserDataById(userId);

        if (!userData) {
            res.status(StatusCodes.BAD_REQUEST).send({ error: 'user data not found.' });
            return;
        }

        const finalResult = result?.map(async (item: any) => {
            const productDetails = await getProductDetailsByUserId(item?._id?.toString(), userId);
            const { gst, ...rest } = item?._doc;

            return {
                ...rest,
                isWishlist: productDetails[0]?.isWishlist ? true : false,
                isCart: productDetails[0]?.isCart ? true : false,
                deliveryCharge: checkUserLocationAndGetDeliveryCharge(userData, item) ?? 0,
                ...((item?.gst) ? checkUserGujratState(userData, item) ?  {gst: Number(item?.gst)} : {sgst: Number(item?.gst)/2, igst: Number(item?.gst)/2} : {})
            }
        })

        const data = await Promise.all(finalResult);

        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getProductById = async (req: AuthorizedRequest, res: Response) => {
    const { productId, userId } = req.query;
    
    if (!productId) {
        res.status(StatusCodes.BAD_REQUEST).send({ error: 'Params productId data is empty.' });
        return;
    }

    try {
        const result = await getProductDataById(productId);

        if (!userId) {
            const data = result?.map((item: any) => {
                return {
                    ...item,
                    isWishlist: false,
                    isCart: false,
                    deliveryCharge: 0
                }
            })
            return res.status(StatusCodes.OK).send({ data });
        }

        const userData = await getUserDataById(userId);

        if (!userData) {
            res.status(StatusCodes.BAD_REQUEST).send({ error: 'user data not found.' });
            return;
        }

        const finalResult = result?.map(async (item: any) => {
            const productDetails = await getProductDetailsByUserId(item?._id?.toString(), userId);
            const { gst, ...rest } = item;

            return {
                ...rest,
                isWishlist: productDetails[0]?.isWishlist ? true : false,
                isCart: productDetails[0]?.isCart ? true : false,
                deliveryCharge: checkUserLocationAndGetDeliveryCharge(userData, item) ?? 0,
                ...((item?.gst) ? checkUserGujratState(userData, item) ?  {gst: Number(item?.gst)} : {sgst: Number(item?.gst)/2, igst: Number(item?.gst)/2} : {})
            }
        })

        const data = await Promise.all(finalResult);

        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const deleteProduct = async (req: AuthorizedRequest, res: Response) => {
    const { productId } = req.query;

    if (!productId) {
        res.status(StatusCodes.BAD_REQUEST).send({ error: 'Params productId data is empty.' });
        return;
    }
    try {
        const productData = await getProductDataById(productId);
        if (!productData) {
            res.status(StatusCodes.NOT_FOUND).send({ error: 'Product not found.' });
            return;
        }

        if (productData[0]?.image) {
            for (const image of productData[0]?.image) {
                const imagePath = image?.path ?? '';
                if (imagePath) {
                    await deleteImageS3(imagePath);
                }
            }
        }

        const videoPath = productData[0]?.videoPath ?? ''; // Ensure it's a string
        if (videoPath) {
            await deleteImageS3(videoPath);
        }

        await deleteProductData(productId);

        //Product remove from wishlist if available in wishlist.
        await removeWishlistDataAllUser(productId);

        //Product remove from cart if available in cart
        await removeToCartDataAllUser(productId);

        // Delete product detail data
        await deleteProductDetailsData(productId)

        res.status(StatusCodes.OK).send({ success: true, message: "Product data deleted." });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const updateProductPramotionFlag = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;

    try {
        await updateProductPramotionFlagData({...bodyData})
        res.status(StatusCodes.OK).send({ success: true, message: "Product data updated." });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const updateProductDiscount = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;

    try {
        await updateProductDiscountData({...bodyData})
        res.status(StatusCodes.OK).send({ success: true, message: "Product data updated." });
    } catch(err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const updateProductReward = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;

    try {
        await updateProductRewardData({...bodyData})
        res.status(StatusCodes.OK).send({ success: true, message: "Product data updated." });
    } catch(err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getPramotionProduct = async (req: AuthorizedRequest, res: Response) => {
    const { userId } = req.query;

    try {
        const result = await getPramotionProductData();

        if (!userId) {
            const data = result?.map((item: any) => {
                return {
                    ...item?._doc,
                    isWishlist: false,
                    isCart: false,
                    deliveryCharge: 0
                }
            })
            return res.status(StatusCodes.OK).send({ data });
        }

        const userData = await getUserDataById(userId);

        if (!userData) {
            res.status(StatusCodes.BAD_REQUEST).send({ error: 'user data not found.' });
            return;
        }

        if (userData) {
            const finalResult = result?.map(async (item: any) => {
    
                const productDetails = await getProductDetailsByUserId(item?._id?.toString(), userId);
                const { gst, ...rest } = item?._doc;
    
                return {
                    ...rest,
                    isWishlist: productDetails[0]?.isWishlist ? true : false,
                    isCart: productDetails[0]?.isCart ? true : false,
                    deliveryCharge: checkUserLocationAndGetDeliveryCharge(userData, item) ?? 0,
                    ...((item?.gst) ? checkUserGujratState(userData, item) ?  {gst: Number(item?.gst)} : {sgst: Number(item?.gst)/2, igst: Number(item?.gst)/2} : {})
                }
            })
            const data = await Promise.all(finalResult);
            res.status(StatusCodes.OK).send({ data });
        }

    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getProductUnderTwo = async (req: AuthorizedRequest, res: Response) => {
    const { userId } = req.query;

    try {
        const result = await getProductUnderTwoData();

        if (!userId) {
            const data = result?.map((item: any) => {
                return {
                    ...item?._doc,
                    isWishlist: false,
                    isCart: false,
                    deliveryCharge: 0
                }
            })
            return res.status(StatusCodes.OK).send({ data });
        }

        const userData = await getUserDataById(userId);

        if (!userData) {
            res.status(StatusCodes.BAD_REQUEST).send({ error: 'user data not found.' });
            return;
        }

        const finalResult = result?.map(async (item: any) => {

            const productDetails = await getProductDetailsByUserId(item?._id?.toString(), userId);
            const { gst, ...rest } = item?._doc;

            return {
                ...rest,
                isWishlist: productDetails[0]?.isWishlist ? true : false,
                isCart: productDetails[0]?.isCart ? true : false,
                deliveryCharge: checkUserLocationAndGetDeliveryCharge(userData, item) ?? 0,
                ...((item?.gst) ? checkUserGujratState(userData, item) ?  {gst: Number(item?.gst)} : {sgst: Number(item?.gst)/2, igst: Number(item?.gst)/2} : {})
            }
        })

        const data = await Promise.all(finalResult);

        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getProductUnderThree = async (req: AuthorizedRequest, res: Response) => {
    const { userId } = req.query;

    try {
        const result = await getProductUnderThreeData();

        if (!userId) {
            const data = result?.map((item: any) => {
                return {
                    ...item?._doc,
                    isWishlist: false,
                    isCart: false,
                    deliveryCharge: 0
                }
            })
            return res.status(StatusCodes.OK).send({ data });
        }

        const userData = await getUserDataById(userId);

        if (!userData) {
            res.status(StatusCodes.BAD_REQUEST).send({ error: 'user data not found.' });
            return;
        }

        const finalResult = result?.map(async (item: any) => {
            const productDetails = await getProductDetailsByUserId(item?._id?.toString(), userId);
            const { gst, ...rest } = item?._doc;

            return {
                ...rest,
                isWishlist: productDetails[0]?.isWishlist ? true : false,
                isCart: productDetails[0]?.isCart ? true : false,
                deliveryCharge: checkUserLocationAndGetDeliveryCharge(userData, item) ?? 0,
                ...((item?.gst) ? checkUserGujratState(userData, item) ?  {gst: Number(item?.gst)} : {sgst: Number(item?.gst)/2, igst: Number(item?.gst)/2} : {})
            }
        })

        const data = await Promise.all(finalResult);

        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getProductUnderFive = async (req: AuthorizedRequest, res: Response) => {
    const { userId } = req.query;

    try {
        const result = await getProductUnderFiveData();

        if (!userId) {
            const data = result?.map((item: any) => {
                return {
                    ...item?._doc,
                    isWishlist: false,
                    isCart: false,
                    deliveryCharge: 0
                }
            })
            return res.status(StatusCodes.OK).send({ data });
        }

        const userData = await getUserDataById(userId);

        if (!userData) {
            res.status(StatusCodes.BAD_REQUEST).send({ error: 'user data not found.' });
            return;
        }

        const finalResult = result?.map(async (item: any) => {
            const productDetails = await getProductDetailsByUserId(item?._id?.toString(), userId);
            const { gst, ...rest } = item?._doc;

            return {
                ...rest,
                isWishlist: productDetails[0]?.isWishlist ? true : false,
                isCart: productDetails[0]?.isCart ? true : false,
                deliveryCharge: checkUserLocationAndGetDeliveryCharge(userData, item) ?? 0,
                ...((item?.gst) ? checkUserGujratState(userData, item) ?  {gst: Number(item?.gst)} : {sgst: Number(item?.gst)/2, igst: Number(item?.gst)/2} : {})
            }
        })

        const data = await Promise.all(finalResult);

        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getProductUnderten = async (req: AuthorizedRequest, res: Response) => {
    const { userId } = req.query;

    try {
        const result = await getProductUnderTenData();

        if (!userId) {
            const data = result?.map((item: any) => {
                return {
                    ...item?._doc,
                    isWishlist: false,
                    isCart: false,
                    deliveryCharge: 0
                }
            })
            return res.status(StatusCodes.OK).send({ data });
        }

        const userData = await getUserDataById(userId);

        if (!userData) {
            res.status(StatusCodes.BAD_REQUEST).send({ error: 'user data not found.' });
            return;
        }

        const finalResult = result?.map(async (item: any) => {
            const productDetails = await getProductDetailsByUserId(item?._id?.toString(), userId);
            const { gst, ...rest } = item?._doc;

            return {
                ...rest,
                isWishlist: productDetails[0]?.isWishlist ? true : false,
                isCart: productDetails[0]?.isCart ? true : false,
                deliveryCharge: checkUserLocationAndGetDeliveryCharge(userData, item) ?? 0,
                ...((item?.gst) ? checkUserGujratState(userData, item) ?  {gst: Number(item?.gst)} : {sgst: Number(item?.gst)/2, igst: Number(item?.gst)/2} : {})
            }
        })

        const data = await Promise.all(finalResult);

        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const updateProductAction = async (req: AuthorizedRequest, res: Response) => {
    const { productId } = req.query;

    try {
        await updateProductActionData(productId);
        res.status(StatusCodes.OK).send({ success: true });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getProductBaseMetal = async (req: AuthorizedRequest, res: Response) => {
    try {
        const data = await getProductBaseMetalData();
        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getProductBrand = async (req: AuthorizedRequest, res: Response) => {
    try {
        const data = await getProductBrandData();
        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getProductColor = async (req: AuthorizedRequest, res: Response) => {
    try {
        const data = await getProductColorData();
        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getProductOccasion = async (req: AuthorizedRequest, res: Response) => {
    try {
        const data = await getProductOccasionData();
        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getProductPlating = async (req: AuthorizedRequest, res: Response) => {
    try {
        const data = await getProductPlatingData();
        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getProductStoneType = async (req: AuthorizedRequest, res: Response) => {
    try {
        const data = await getProductStoneTypeData();
        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getProductTrend = async (req: AuthorizedRequest, res: Response) => {
    try {
        const data = await getProductTrendData();
        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getProductType = async (req: AuthorizedRequest, res: Response) => {
    try {
        const data = await getProductTypeData();
        res.status(StatusCodes.OK).send({ data });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}