import {
  IAuthor,
  IBook,
  IGlobalResponse,
  IGlobalResponseData,
  IProcess
} from '@/types';

export interface IGetUserBookSearchResponse extends IGlobalResponse {
  data: Data[];
}

export interface Data extends IGlobalResponseData {
  author: IAuthor;
  book: IBook;
  process: IProcess;
  bookName: string;
  slug: string;
  type: string;
  userId: string;
  isFavorite: boolean;
}
