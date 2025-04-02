export interface INotification {
    _id?: ObjectId;
    userId: string;
    title: string;
    subTitle: string;
    imageUrl: string;
    isRead?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}