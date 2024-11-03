export interface IUpdateProfileRequest {
  firstName: string;
  lastName: string;
  userName: string;
  birthDate: string;
  gender: number;
}
export interface IUpdateProfileResponse {
  status: boolean;
  message: string;
}
