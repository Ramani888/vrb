export interface IDeliveryAddress {
    _id?: ObjectId;
    userId: string;
    addressFirst: string;
    addressSecond: string;
    area: string;
    landmark: string;
    country: string;
    state: string;
    city: string;
    pinCode: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ITrackingDetails {
    _id?: ObjectId;
    orderId?: string;
    trackingId?: string;
    packingId?: string;
    video?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUnloadingDetails {
    _id?: ObjectId;
    orderId?: string;
    imageUrl?: string;
    videoUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IOrder {
    _id?: ObjectId;
    userId?: string;
    totalAmount?: number;
    deliveryAddressId?: string;
    paymentId?: string;
}

export interface IOrderDetails {
    _id?: ObjectId;
    productId?: string;
    userId?: string;
    orderId?: string;
    product?: any[];
    qty?: number;
    totalPrice?: number;
}

export interface IReward {
    _id?: ObjectId;
    userId?: string;
    orderId?: string;
    reward?: number;
    isEarned?: boolean;
    isRedeemed?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}