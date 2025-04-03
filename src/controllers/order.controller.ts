import { AuthorizedRequest } from "../types/user";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { addDeliveryAddressData, addOrderData, addOrderDetailsData, addTrackingData, deleteDeliveryAddressData, getDeliveryAddressByUserId, getOrderData, getOrderDataByUser, getOrderDetailsData, getOrderDetailsDataByUser, getTrackingData, getUnloadingData, insertUnloadingData, updateDeliveryAddressData, updateOrderStatusData, updateTrackingDetail } from "../services/order.service";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import dotenv from "dotenv"
import { initializeApp } from "firebase/app";
import config from "../config/firbase.config";
import { RAZOR_PAY_KEY_ID, RAZOR_PAY_KEY_SECRET } from "../utils/helpers/global";
import axios from 'axios';
import Razorpay from 'razorpay';
import { addRewardData } from "../services/reward.service";
import { removeToCartData } from "../services/cart.service";
import { updateProductCartFlag } from "../services/product.service";
dotenv.config();

const firebaseApp = initializeApp(config.firebaseConfig);
const storage = getStorage();

export const addDeliveryAddress = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;

    try {
        const isAddressExist = await getDeliveryAddressByUserId(bodyData?.userId);
        if (isAddressExist.length > 0) {
            await deleteDeliveryAddressData(isAddressExist[0]?._id?.toString());
        }
        await addDeliveryAddressData({...bodyData})
        res.status(StatusCodes.OK).send({ success: true, message: "Delivery address added successfully." });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const deleteDeliveryAddress = async (req: AuthorizedRequest, res: Response) => {
    const { id } = req.query;

    try {
        await deleteDeliveryAddressData(id);
        return res.status(StatusCodes.OK).send({ success: true, message: "Delivery address data deleted." });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const updateDeliveryAddress = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;

    try {
        await updateDeliveryAddressData(bodyData)
        res.status(StatusCodes.OK).send({ success: true, message: "Delivery address data updated."});
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const getDeliveryAddress = async (req: AuthorizedRequest, res: Response) => {
    const { userId } = req.query;

    try {
        const deliveryAddressData = await getDeliveryAddressByUserId(userId);
        return res.status(StatusCodes.OK).send({ deliveryAddressData });
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ e });
    }
}

export const addTracking = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;
    try {
        await addTrackingData({...bodyData});
        await updateOrderStatusData(bodyData?.orderId, 'Shipped');
        res.status(StatusCodes.OK).send({ success: true, message: "Tracking detail inserted." });
    } catch (error) {
        console.error('Error:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
}

export const updateTracking = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;

    try {
        if (bodyData?.deleteVideo) {
            const fileRef = ref(storage, bodyData?.deleteVideo);
            await deleteObject(fileRef);
        }

        await updateTrackingDetail({...bodyData});
        res.status(StatusCodes.OK).send({ success: true, message: "Tracking data updated." });
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ e });
    }
}

export const insertUnloadingImage = async (req: AuthorizedRequest, res: Response) => {
    const file = req.file;
    try {

        if (!file) {
            res.status(StatusCodes.BAD_REQUEST).send({ error: 'Image file is missing.' });
            return;
        }

        const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.key}`;
        res.status(StatusCodes.OK).send({ imageUrl });
        
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const insertUnloadingVideo = async (req: AuthorizedRequest, res: Response) => {
    try {
        const file = req.file;
        if (!file) {
            res.status(StatusCodes.BAD_REQUEST).send({ error: 'Image file is missing.' });
            return;
        }
        const videoUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.key}`;
        res.status(StatusCodes.OK).send({ videoUrl });

    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const insertUnloading = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;

    try {
        await insertUnloadingData(bodyData);
        await updateOrderStatusData(bodyData?.orderId, 'Delivered')
        res.status(StatusCodes.OK).send({ success: true, message: "Order unloadin details upload successfully." });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const capturePayment = async (req: AuthorizedRequest, res: Response): Promise<void> => {
    try {
        const { paymentId, payment } = req.body;
        const url = `https://${RAZOR_PAY_KEY_ID}:${RAZOR_PAY_KEY_SECRET}@api.razorpay.com/v1/payments/${paymentId}/capture`;
        const data = {
            amount: payment * 100,
            currency: 'INR',
        };
    
        const response = await axios.post(url, data, {
            auth: {
            username: RAZOR_PAY_KEY_ID,
            password: RAZOR_PAY_KEY_SECRET,
            },
        });

        res.status(StatusCodes.OK).send({ success: true, message: "Payment capture successfully." });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
};

export const refundPayment = async (req: AuthorizedRequest, res: Response): Promise<void> => {
    try {
        const { paymentId, payment } = req.body;

        //Before capture payment
        const url = `https://${RAZOR_PAY_KEY_ID}:${RAZOR_PAY_KEY_SECRET}@api.razorpay.com/v1/payments/${paymentId}/capture`;
        const data = {
            amount: payment * 100,
            currency: 'INR',
        };
    
        const resCapture = await axios.post(url, data, {
            auth: {
            username: RAZOR_PAY_KEY_ID,
            password: RAZOR_PAY_KEY_SECRET,
            },
        });
      
        // Calculate the refund amount as 80% of the payment amount
        const amount = Math.round((payment * 80) / 100);
        // console.log('amount:', amount);
    
        const refundData = {
            amount: amount * 100,
            speed: 'normal',
            notes: {
            notes_key_1: "Beam me up Scotty.",
            notes_key_2: "Engage"
            },
            receipt: "Receipt No. 31",
        };
    
        // console.log(`Refund Request Data: ${JSON.stringify(refundData)}`);
    
        const razorpay = new Razorpay({
            key_id: RAZOR_PAY_KEY_ID,
            key_secret: RAZOR_PAY_KEY_SECRET,
        });
    
        const response = await razorpay.payments.refund(paymentId, refundData);
    
        // console.log('Response:', response);
    
        res.status(StatusCodes.OK).send({ success: true, message: "Payment refunded successfully." });
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
};

export const getPayment = async (req: AuthorizedRequest, res: Response) => {
    try {
        const { paymentId } = req.query;

        const razorpay = new Razorpay({
            key_id: RAZOR_PAY_KEY_ID,
            key_secret: RAZOR_PAY_KEY_SECRET,
        });

        const data = await razorpay.payments.fetch(paymentId);

        return res.status(StatusCodes.OK).send({ data });

    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}

export const addOrder = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;

    try {
        const deliveryAddressData = await getDeliveryAddressByUserId(bodyData?.userId);
        const orderId = await addOrderData({...bodyData, deliveryAddressId: deliveryAddressData[0]?._id?.toString()});

        await addOrderDetailsData({...bodyData, orderId: orderId});

        const totalReward = bodyData?.product?.reduce((accumulator: any, item: any) => {
            return accumulator + item?.reward;
        }, 0);

        const rewardData = {
            userId: bodyData?.userId,
            orderId: orderId?.toString(),
            reward: totalReward,
            isEarned: true
        }

        await addRewardData(rewardData)

        if (bodyData?.isWallet) {
            const totalRedeemReward = bodyData?.wallet;

            const rewardData = {
                userId: bodyData?.userId,
                orderId: orderId?.toString(),
                reward: totalRedeemReward,
                isRedeemed: true
            }
    
            await addRewardData(rewardData)
        }

        bodyData?.product?.map(async (item: any) => {
            await removeToCartData(item?.id, bodyData?.userId);
            await updateProductCartFlag(item?.id, bodyData?.userId, false);
        })
        return res.status(StatusCodes.OK).send({ success: true, message: "Order completed successfully." });
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ e });
    }
}

export const getOrder = async (req: AuthorizedRequest, res: Response) => {
    try {
        const orderData = await getOrderData(); // Assuming getOrderData() retrieves order data
        const orderDetailsData = await getOrderDetailsData(); // Assuming getOrderDetailsData() retrieves order details data
        const trackingData = await getTrackingData();
        const unloadingData = await getUnloadingData();

        // Map through order data and find associated product details
        const data = orderData?.map((order: any) => {
            const findProductDetails = orderDetailsData?.filter((detailsData) =>
                String(detailsData.orderId) === String(order._id)
            );
            const findTrackingDetails = trackingData?.find((detailsData) =>
                String(detailsData.orderId) === String(order._id)
            );
            const findUnloadingData = unloadingData?.find((detailsData) => 
                String(detailsData.orderId) === String(order._id)
            )
            return {
                ...order,
                productDetails: findProductDetails,
                trackingDetails: findTrackingDetails,
                unloadingDetails: findUnloadingData
            };
        });

        return res.status(StatusCodes.OK).send({ data });
    } catch (error) {
        console.error('Error:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
};

export const getOrderByUser = async (req: AuthorizedRequest, res: Response) => {
    const { userId } = req.query;

    try {
        const orderData = await getOrderDataByUser(userId); // Assuming getOrderData() retrieves order data
        const orderDetailsData = await getOrderDetailsDataByUser(userId); // Assuming getOrderDetailsData() retrieves order details data
        const trackingData = await getTrackingData();
        const unloadingData = await getUnloadingData();

        // Map through order data and find associated product details
        const data = orderData?.map((order: any) => {
            const findProductDetails = orderDetailsData?.filter((detailsData) =>
                String(detailsData.orderId) === String(order._id)
            );
            const findTrackingDetails = trackingData?.find((detailsData) =>
                String(detailsData.orderId) === String(order._id)
            );
            const findUnloadingData = unloadingData?.find((detailsData) => 
                String(detailsData.orderId) === String(order._id)
            )
            return {
                ...order,
                productDetails: findProductDetails,
                trackingDetails: findTrackingDetails,
                unloadingDetails: findUnloadingData
            };
        });

        return res.status(StatusCodes.OK).send({ data });
    } catch (error) {
        console.error('Error:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }

}

export const updateOrderStatus = async (req: AuthorizedRequest, res: Response) => {
    const { orderId, status } = req.query;

    try {
        await updateOrderStatusData(orderId, status);
        res.status(StatusCodes.OK).send({ success: true, message: "Order status updated." });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err });
    }
}