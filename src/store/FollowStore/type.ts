interface IFollowUserRequest {
  targetUserName: string;
}

interface IFollowUserResponse {
  success: boolean;
  message: string;
  isFollowing: boolean;
}
