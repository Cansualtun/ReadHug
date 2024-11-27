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
