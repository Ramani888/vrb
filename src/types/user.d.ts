type AuthorizedRequest = Express.Request & ?({ headers: { authorization: string } } & ?{ userData: JwtSign });

declare namespace Express {
  type Request = AuthorizedRequest;
}

export type UserJwt = {
  firstName?: string;
  lastName?: string;
  id?: number;
  roleId: number;
  customerId: number;
  dataModelId: number;
  exp?: number;
};

interface IRealProfile {
  _id: ObjectId;
  name: String;
  userName: String;
  age: Number;
  gender: String;
  profilePictureUrl: String;
  location: String;
}

interface IPseudonymousProfile {
  userName: String,
  profilePictureUrl: String,
}

interface IAnonymousProfile {
  _id: ObjectId;
}

interface IUser {
  _id: ObjectId;
  email: string;
  password: string;
  timestamps: Date;
  realProfile: IRealProfile;
  pseudonymousProfile: IPseudonymousProfile;
  anonymousProfile: IAnonymousProfile;
  identityMode: String;
  isDeleted: Boolean;
}

export interface IUsers {
  _id?: ObjectId;
  businessType: string;
  name: string;
  companyName?: string | null;
  mobileNumber?: number;
  email?: string | null;
  phoneNumber?: number | null;
  addressFirst?: string | null;
  addressSecond?: string | null;
  area?: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  pinCode: number | null;
  panNo?: string | null;
  gstNo?: string | null;
  password: string | null;
  isActive: boolean | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface IDeviceToken {
  _id?: ObjectId;
  userId?: string;
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;
}