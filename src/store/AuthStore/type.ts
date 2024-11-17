export interface ILoginRequest {
  email: string;
  password: string;
}
export interface ILoginResponse {
  status: boolean;
  message: string;
  userId: string;
  access_token: string;
}
export interface IRegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  userName: string;
}
export interface IRegisterResult {
  status: boolean;
  message: string;
  token: string;
  userId: string;
}
export interface IChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
export interface IChangePasswordResult {
  status: boolean;
  message: string;
}
