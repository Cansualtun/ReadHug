interface IFollowUserRequest {
  targetUserName: string;
}

interface IFollowUserResponse {
  success: boolean;
  message: string;
  isFollowing: boolean;
}
interface IFollowRequest {
  userName: string;
}
interface IFollowListResponse {
  status: boolean;
  following: Following[];
  followers: Follower[];
}
interface Following {
  _id: string;
  follower: string;
  following: Following2;
  isDeleted: boolean;
  __v: number;
}
interface Following2 {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  birthDate: any;
  gender: any;
  image: any;
  isActive: boolean;
}
interface Follower {
  _id: string;
  follower: Follower2;
  following: string;
  isDeleted: boolean;
  __v: number;
}
interface Follower2 {
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
