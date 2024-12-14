import { DateValue } from '@nextui-org/react';

export interface IUpdateProfileRequest {
  firstName: string;
  lastName: string;
  userName: string;
  birthDate: any;
  gender: number;
}
export interface IUpdateProfileResponse {
  status: boolean;
  message: string;
}
export interface IProfileRequest {
  userName: string;
  type: string;
  limit: number;
  page: number;
  token?: string;
}
export interface IProfileResponse {
  status: boolean;
  data: any;
}
