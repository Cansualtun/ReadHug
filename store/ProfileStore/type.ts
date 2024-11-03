export interface IUpdateProfileRequest {
  firstName: string;
  lastName: string;
  userName: string;
  birthDate: string;
  gender: string;
}
export interface IUpdateProfileResponse {
  status: boolean;
  message: string;
}
