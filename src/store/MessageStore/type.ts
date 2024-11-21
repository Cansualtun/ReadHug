import { IGlobalResponse, IUser } from '@/types';

export interface MessageState {
  isOpenMessage: boolean | null;
  messageRow: any;
  user: any;
  notifications: NotificationState;
}

export interface NotificationState extends IGlobalResponse {
  data: INotificationData[];
  totalMessageCount: number;
}

export interface INotificationData {
  connection: string;
  connectionId: string;
  content: string;
  type: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  isRead: boolean;
  user: IUser;
}
