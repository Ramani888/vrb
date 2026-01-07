import { AuthorizedRequest } from "../types/user";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { addProductData, deleteProductData, deleteProductDetailsData, getAllProductData, getPramotionProductData, getProductBaseMetalData, getProductBrandData, getProductColorData, getProductDataByCategoryId, getProductDataById, getProductDetailsByUserId, getProductOccasionData, getProductPlatingData, getProductStoneTypeData, getProductTrendData, getProductTypeData, getProductUnderFiveData, getProductUnderTenData, getProductUnderThreeData, getProductUnderTwoData, getSearchProductData, updateProductActionData, updateProductData, updateProductDiscountData, updateProductPramotionFlagData, updateProductRewardData } from "../services/product.service";
import { getCategoryDataById } from "../services/category.service";
import { DeviceToken } from "../models/deviceToken.model";
import { insertNotificationData } from "../services/notification.service";
import { sendBulkPushNotification } from "./notification.controller";
import { checkUserGujratState, checkUserLocationAndGetDeliveryCharge, deleteImageS3, deleteVpsUpload } from "../utils/helpers/global";
import { getUserDataById } from "../services/user.service";
import { removeWishlistData, removeWishlistDataAllUser } from "../services/wishlist.service";
import { removeToCartDataAllUser } from "../services/cart.service";

export const addProduct = async (req: AuthorizedRequest, res: Response) => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const bodyData = req.body;

        // Validate minimum 2 images
        if (!files?.image || files.image.length < 2) {
            return res.status(StatusCodes.BAD_REQUEST).send({ 
                success: false, 
                message: "Please select minimum two images." 
            });
        }

        // Prepare image data with VPS paths
        const imageData = files.image.map((file) => ({
            path: `${process.env.APP_URL}/uploads/images/${file.filename}`
        }));

        // Prepare video data
        const videoPath = files?.video && files.video.length > 0 
            ? `${process.env.APP_URL}/uploads/videos/${files.video[0].filename}` 
            : undefined;

        // Prepare product data
        const productData: any = {
            categoryId: bodyData.categoryId,
            name: bodyData.name,
            code: bodyData.code,
            price: Number(bodyData.price),
            mrp: Number(bodyData.mrp),
            qty: Number(bodyData.qty),
            gst: bodyData.gst,
            inSuratCityCharge: Number(bodyData.inSuratCityCharge),
            inGujratStateCharge: Number(bodyData.inGujratStateCharge),
            inOutStateCharge: Number(bodyData.inOutStateCharge),
            image: imageData,
            videoPath: videoPath,
            isPause: bodyData.isPause === 'true' || bodyData.isPause === true ? true : false,
        };

        // Add optional fields if provided
        if (bodyData.productBaseMetalId) productData.productBaseMetalId = bodyData.productBaseMetalId;
        if (bodyData.productPlatingId) productData.productPlatingId = bodyData.productPlatingId;
        if (bodyData.productStoneTypeId) productData.productStoneTypeId = bodyData.productStoneTypeId;
        if (bodyData.productTrendId) productData.productTrendId = bodyData.productTrendId;
        if (bodyData.productBrandId) productData.productBrandId = bodyData.productBrandId;
        if (bodyData.productColorId) productData.productColorId = bodyData.productColorId;
        if (bodyData.productOccasionId) productData.productOccasionId = bodyData.productOccasionId;
        if (bodyData.productTypeId) productData.productTypeId = bodyData.productTypeId;
        if (bodyData.size) productData.size = bodyData.size;
        if (bodyData.weight) productData.weight = Number(bodyData.weight);
        if (bodyData.description) productData.description = bodyData.description;
        if (bodyData.discount) productData.discount = Number(bodyData.discount);
        if (bodyData.reward) productData.reward = Number(bodyData.reward);
        
        productData.isPramotion = bodyData.isPramotion === 'true' || bodyData.isPramotion === true ? true : false;

        const productId = await addProductData(productData);

        // Send notification to all users
        const categoryData = await getCategoryDataById(bodyData.categoryId);
        const tokens = await DeviceToken.find();

        const tokenData = tokens?.map((data) => data?.token);
        const userIds = tokens?.map((data) => data?.userId);

        userIds?.forEach(async (userId) => {
            const notificationData = {
                title: categoryData[0]?.name,
                subTitle: bodyData.name,
                imageUrl: imageData[0]?.path,
                userId: userId,
                productId: productId,
                productName: bodyData.name
            };
            await insertNotificationData(notificationData);
        });

        const pushNotificationData = {
            title: categoryData[0]?.name,
            body: bodyData.name,
        };

        await sendBulkPushNotification(tokenData, pushNotificationData);
        
        res.status(StatusCodes.OK).send({ 
            success: true, 
            message: "Product added successfully.",
            productId: productId 
        });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ 
            success: false,
            message: "Failed to add product.",
            error: err 
        });
    }
}

export const updateProduct = async (req: AuthorizedRequest, res: Response) => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const bodyData = req.body;

        if (!bodyData._id) {
            return res.status(StatusCodes.BAD_REQUEST).send({ 
                success: false, 
                message: "Product ID is required." 
            });
        }

        // Parse existing images if provided
        let existingImages: Array<{ _id?: string, path: string }> = [];
        if (bodyData.existingImages) {
            try {
                existingImages = JSON.parse(bodyData.existingImages);
            } catch (e) {
                console.error("Error parsing existingImages:", e);
            }
        }

        // Parse deleted images if provided
        let deleteImages: Array<{ _id?: string, path: string }> = [];
        if (bodyData.deleteImages) {
            try {
                deleteImages = JSON.parse(bodyData.deleteImages);
            } catch (e) {
                console.error("Error parsing deleteImages:", e);
            }
        }

        // Delete images from VPS if specified
        if (deleteImages && deleteImages.length > 0) {
            for (const deleteImageData of deleteImages) {
                if (deleteImageData?.path) {
                    await deleteVpsUpload(deleteImageData.path);
                }
            }
        }

        // Handle video deletion
        if (bodyData.deleteVideo) {
            await deleteVpsUpload(bodyData.deleteVideo);
        }

        // Prepare new images with VPS paths
        const newImages = files?.image ? files.image.map((file) => ({
            path: `${process.env.APP_URL}/uploads/images/${file.filename}`
        })) : [];

        // Combine existing and new images
        const allImages = [...existingImages, ...newImages];

        // Validate minimum 2 images
        if (allImages.length < 2) {
            return res.status(StatusCodes.BAD_REQUEST).send({ 
                success: false, 
                message: "Please select minimum two images." 
            });
        }

        // Prepare video path
        let videoPath = bodyData.existingVideo || null;
        if (files?.video && files.video.length > 0) {
            videoPath = `${process.env.APP_URL}/uploads/videos/${files.video[0].filename}`;
        } else if (bodyData.deleteVideo) {
            videoPath = null;
        }

        // Prepare update data
        const updateData: any = {
            _id: bodyData._id,
            image: allImages,
            videoPath: videoPath
        };
        
        // Update fields if provided
        if (bodyData.categoryId) updateData.categoryId = bodyData.categoryId;
        if (bodyData.name) updateData.name = bodyData.name;
        if (bodyData.code) updateData.code = bodyData.code;
        if (bodyData.price) updateData.price = Number(bodyData.price);
        if (bodyData.mrp) updateData.mrp = Number(bodyData.mrp);
        if (bodyData.qty) updateData.qty = Number(bodyData.qty);
        if (bodyData.gst) updateData.gst = bodyData.gst;
        if (bodyData.inSuratCityCharge !== undefined) updateData.inSuratCityCharge = Number(bodyData.inSuratCityCharge);
        if (bodyData.inGujratStateCharge !== undefined) updateData.inGujratStateCharge = Number(bodyData.inGujratStateCharge);
        if (bodyData.inOutStateCharge !== undefined) updateData.inOutStateCharge = Number(bodyData.inOutStateCharge);
        
        // Update optional fields
        if (bodyData.productBaseMetalId !== undefined) updateData.productBaseMetalId = bodyData.productBaseMetalId;
        if (bodyData.productPlatingId !== undefined) updateData.productPlatingId = bodyData.productPlatingId;
        if (bodyData.productStoneTypeId !== undefined) updateData.productStoneTypeId = bodyData.productStoneTypeId;
        if (bodyData.productTrendId !== undefined) updateData.productTrendId = bodyData.productTrendId;
        if (bodyData.productBrandId !== undefined) updateData.productBrandId = bodyData.productBrandId;
        if (bodyData.productColorId !== undefined) updateData.productColorId = bodyData.productColorId;
        if (bodyData.productOccasionId !== undefined) updateData.productOccasionId = bodyData.productOccasionId;
        if (bodyData.productTypeId !== undefined) updateData.productTypeId = bodyData.productTypeId;
        if (bodyData.size !== undefined) updateData.size = bodyData.size;
        if (bodyData.weight !== undefined) updateData.weight = Number(bodyData.weight);
        if (bodyData.description !== undefined) updateData.description = bodyData.description;
        if (bodyData.discount !== undefined) updateData.discount = Number(bodyData.discount);
        if (bodyData.reward !== undefined) updateData.reward = Number(bodyData.reward);
        if (bodyData.isPramotion !== undefined) updateData.isPramotion = bodyData.isPramotion === 'true' || bodyData.isPramotion === true ? true : false;
        if (bodyData.isPause !== undefined) updateData.isPause = bodyData.isPause === 'true' || bodyData.isPause === true ? true : false;

        await updateProductData(updateData);
        
        res.status(StatusCodes.OK).send({ 
            success: true, 
            message: "Product updated successfully." 
        });

    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ 
            success: false,
            message: "Failed to update product.",
            error: err 
        });
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
                    await deleteVpsUpload(imagePath);
                }
            }
        }

        const videoPath = productData[0]?.videoPath ?? ''; // Ensure it's a string
        if (videoPath) {
            await deleteVpsUpload(videoPath);
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

export const getSearchProduct = async (req: AuthorizedRequest, res: Response) => {
    const { userId, search } = req.query;

    try {
        const result = await getSearchProductData(search);

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
            return {
                ...item?._doc,
                isWishlist: productDetails[0]?.isWishlist ? true : false,
                isCart: productDetails[0]?.isCart ? true : false,
                deliveryCharge: checkUserLocationAndGetDeliveryCharge(userData, item) ?? 0
            }
        })

        const data = await Promise.all(finalResult);

        res.status(StatusCodes.OK).send({ data });

    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}