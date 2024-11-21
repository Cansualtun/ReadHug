export interface UserBook {
  status: boolean;
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  sort: string;
  data: Books[];
}

export interface Books {
  _id: string;
  type: string;
  gId: string;
  userId: string;
  bookId: BookId;
  process: Process;
  slug: string;
  bookName: string;
  isFavorite: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BookId {
  _id: string;
  name: string;
  gId: string;
  authors: Author[];
  publishers: Publisher[];
  publishedDate: number;
  categories: Category[];
  pageCount: number;
  description: string;
  ISBNS: Isbns[];
  images: Images;
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Author {
  _id: string;
  name: string;
  slug: string;
}

export interface Publisher {
  _id: string;
  name: string;
  slug: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Isbns {
  type: string;
  identifier: string;
  _id: string;
}

export interface Images {
  smallThumbnail: string;
  thumbnail: string;
}

export interface Process {
  pageCount: number;
  readCount: number;
  percent: string;
}
