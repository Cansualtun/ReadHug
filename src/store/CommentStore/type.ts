export interface ICommentPostRequest {
  content: string;
  postId: string;
}
export interface ICommentPostResponse {
  status: boolean;
  message: string;
}
