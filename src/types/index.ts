import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface IGlobalResponse {
  page: number | null;
  totalPages: number | null;
  total: number | null;
  limit: number | null;
  sort: 'asc' | 'desc';
  status?: boolean;
}

export interface IGlobalResponseData {
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  _id: string;
  process: IProcess;
}

export interface IAuthor {
  _id: string;
  type: string;
  url: string;
  name: string;
}

export interface IBook extends IGlobalResponseData {
  ISBN: number;
  author: string;
  book_img: string;
  book_type: string;
  explanation: string;
  isActive: boolean;
  name: string;
  publication_year: number;
  publisher: string;
  slug: string;
}

export interface IProcess {
  pageCount: null | number;
  percent: null | string;
  readCount: null | number;
}

export interface IUser {
  birthDate: Date | null;
  email: string;
  firstName: string;
  gender: number | null;
  image: string | null;
  isActive: boolean;
  lastName: string;
  userName: string;
  _id: string;
}
