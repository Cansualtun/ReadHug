import { IGlobalResponse, IUser } from '@/types';

export interface INotificationResponse extends IGlobalResponse {
  data: NotificationData[];
  totalMessageCount: number;
}

export interface NotificationData {
  _id: string;
  content: string;
  connection: string;
  type: string;
  connectionId: string;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: IUser;
}
