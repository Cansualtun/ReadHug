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
