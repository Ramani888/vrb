export interface ICart {
    _id?: ObjectId;
    userId: string;
    productId: string;
    qty: number;
    total: number;
    createdAt?: Date;
    updatedAt?: Date;
}