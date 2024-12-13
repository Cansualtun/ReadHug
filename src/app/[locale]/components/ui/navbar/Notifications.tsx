'use client';
import { getClientCookie } from '@/utils/getClientCookie';
import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from '../loading';
import {
  Bell,
  Megaphone,
  MessageCircleMore,
  MessageSquareText,
  ThumbsUp,
  UserCheck,
} from 'lucide-react';
import { useNotificationMutation } from '@/store/NotificationStore';
import { useSelector } from 'react-redux';
import { NotificationState } from '@/store/MessageStore/type';
import { selectNotification } from '@/store/NotificationStore/slice';
import { useParams, useRouter } from 'next/navigation';
import { formatDate } from '@/utils/formatDate';

type Props = { open: boolean; setOpen: any };
let BASE_URL = '';
if (process.env.NODE_ENV === 'development') {
  BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
}
if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://bookarchive-production.up.railway.app';
}

const Notifications = ({ open, setOpen }: Props) => {
  const router = useRouter();
  const params = useParams();
  const { locale } = params;
  const [notificationData, setNotificationData] = useState<any>({
    data: [],
  });
  const [notificationCount, setNotificationCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [notification] = useNotificationMutation();
  const selectNotifications: NotificationState =
    useSelector(selectNotification);
  const loadMore = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const token = getClientCookie();

      const response = await fetch(
        `${BASE_URL}/notification/all?page=${page}&limit=10&onlyCount=false`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const newData = await response.json();
      const combineData = {
        ...notificationData,
        data: [...notificationData?.data, ...newData.data],
      };

      setNotificationData(combineData);
      setPage((prev) => prev + 1);
      if (newData.data.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more books:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };
  const getNotifications = async () => {
    try {
      await notification({
        page: 1,
        onlyCount: false,
      } as any);
      setLoading(false);
    } catch (error) { }
  };
  const getNotificationCount = async () => {
    try {
      const { data } = await notification({
        page: 1,
        onlyCount: true,
      } as any);
      setNotificationCount(data?.totalNotificationCount ?? 0);
    } catch (error) { }
  };

  const routeNotification = (item: any) => {
    switch (item.connection) {
      case 'post':
        router.push(`/${locale}/post/${item.connectionId}`);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (open) {
      getNotifications();
    }
    if (open == false) {
      getNotificationCount();
    }
  }, [open]);
  useEffect(() => {
    setNotificationData(selectNotifications);
  }, [selectNotifications]);

  return (
    <>
      <div
        className="relative cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <Bell />
        {notificationCount > 0 && (
          <span className="absolute border-1 border-default-50 -top-1 -right-1 min-w-[16px] min-h-[16px] rounded-full bg-primary text-[8px] text-white flex justify-center items-center p-0 m-0">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </div>
      <div
        className={`absolute z-50 top-10 -left-12 md:left-1/2 md:-translate-x-1/2 ${open ? 'block  animate-fadeindown' : 'hidden'}`}
      >
        <div className="max-h-[300px] md:max-h-[600px] w-[300px] overflow-y-auto scroll-container p-1 bg-default-50 rounded-lg shadow">
          <InfiniteScroll
            dataLength={notificationData?.data?.length}
            next={loadMore}
            hasMore={hasMore}
            className="mb-2"
            loader={
              <div className="w-full flex justify-center items-center h-12">
                <Loading className="py-2" width={120} height={40} />
              </div>
            }
            endMessage={
              <p className="text-center py-4">Tüm Bildirimler Yüklendi.</p>
            }
          >
            {notificationData?.data?.map((item: any) => (
              <div
                onClick={() => routeNotification(item)}
                key={item._id}
                className={`flex items-start space-x-4 p-4 py-2 mb-2 rounded-lg transition-colors cursor-pointer ${!item.isRead ? 'bg-green-600/20 hover:bg-green-600/50' : ' hover:bg-default-100'}`}
              >
                <div className="flex justify-center items-center self-stretch">
                  {item.type === 'like' && <ThumbsUp />}
                  {item.type === 'comment' && <MessageSquareText />}
                  {item.type === 'follow' && <UserCheck />}
                  {item.type === 'announcement' && <Megaphone />}
                  {item.type === 'message' && <MessageCircleMore />}
                </div>
                <div className="flex flex-col flex-1">
                  <p className="ml-2 text-sm">{item.content}</p>
                  <p className="text-[10px] italic self-end">
                    {formatDate(item.createdAt, 'dateTime')}
                  </p>
                </div>
              </div>
            ))}
          </InfiniteScroll>

          <div className="w-full flex flex-col justify-center items-center mb-2">
            {loading && (
              <div className="w-full flex justify-center items-center h-12">
                <Loading className="py-2" width={120} height={40} />
              </div>
            )}
            {hasMore && notificationData?.data?.length > 0 && (
              <button
                className=" bg-default-100 hover:bg-default-300 shadow py-2 px-10 rounded-lg"
                onClick={loadMore}
              >
                Daha Fazla
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;
