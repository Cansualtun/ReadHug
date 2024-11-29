import { IGlobalResponse } from '@/types';

export interface IPostCommentResponse {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  sort: string;
  data: Data[];
}

export interface Data {
  _id: string;
  content: string;
  user: User;
  post: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
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
}

export interface IPostShareRequest {
  bookId: string;
  content: string;
}
export interface IPostShareResult {
  status: boolean;
  message: string;
}
export interface IPostRequest {
  page: number;
  limit: number;
}
export interface IPostResult extends IGlobalResponse {
  data: any[];
}
export interface IPostMoreRequest {
  page: number;
  limit: number;
}
export interface IPostMoreResult extends IGlobalResponse {
  data: any[];
}
