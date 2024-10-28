export interface IMeRequest {}

export interface IMeResponse {
  status: boolean;
  data: Data;
}
export interface Data {
  image: any;
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  birthDate: any;
  gender: any;
  isActive: boolean;
  __v: number;
}
