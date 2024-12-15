export interface IMeRequest {}

export interface IMeResponse {
  status: boolean;
  data: Data;
}
export interface Data {
  image: any;
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  birthDate: any;
  gender: any;
  isActive: boolean;
  __v: number;
  bio?: string;
}
export interface IUserProfileRequest {
  userName: string;
}
export interface IUserProfileResponse {
  status: boolean;
  isFollow: boolean;
  user: User;
  counts: Counts;
  isLoggedIn: boolean;
  isSelf: boolean;
  isEditable: boolean;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  birthDate: string;
  gender: number;
  isActive: boolean;
  image: string;
  bio: string;
}

export interface Counts {
  followsCount: number;
  followersCount: number;
  readBooksCount: number;
  readingBooksCount: number;
  wishlistBooksCount: number;
  totalBookCount: number;
}
