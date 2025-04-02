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