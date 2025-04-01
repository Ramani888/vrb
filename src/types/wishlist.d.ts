export interface IWishlist {
    _id: ObjectId;
    userId: string;
    productId: string;
    createdAt?: Date;
    updatedAt?: Date;
}