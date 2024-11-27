"use client"
import { getClientCookie } from "@/utils/getClientCookie";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../loading";
import { Megaphone, MessageCircleMore, MessageSquareText, ThumbsUp, UserCheck } from "lucide-react";
import { useNotificationMutation } from "@/store/NotificationStore";
import { useSelector } from "react-redux";
import { NotificationState } from "@/store/MessageStore/type";
import { selectNotification } from "@/store/NotificationStore/slice";
import { useParams, useRouter } from "next/navigation";

type Props = {};

const Notifications = (props: Props) => {
    const router = useRouter()
    const params = useParams()
    const { locale } = params

    const [notificationData, setNotificationData] = useState<any>({
        data: [],
    });

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
            const BASE_URL =
                process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

            const response = await fetch(
                `${BASE_URL}/notification/all?page=${page}&limit=10`,
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
            setHasMore(false);
        } catch (error) {
            console.error('Error loading more books:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };
    const getNotifications = async () => {
        try {
            await notification(1 as any);
        } catch (error) { }
    };

    const routeNotification = (item: any) => {

        switch (item.connection) {
            case "post":
                router.push(`/${locale}/post/${item.connectionId}`)
                break;

            default:
                break;
        }
        console.log("item", item);


    }

    useEffect(() => {
        getNotifications()
    }, []);
    useEffect(() => {
        setNotificationData(selectNotifications);
    }, [selectNotifications]);
    return <InfiniteScroll
        dataLength={notificationData?.data?.length}
        next={loadMore}
        hasMore={hasMore}
        className='mb-10'
        loader={
            <div className="w-full flex justify-center items-center">
                <Loading className="pb-2" width={120} height={40} />
            </div>
        }
        endMessage={
            <p className="text-center py-4">
                Tüm Bildirimler Yüklendi.
            </p>
        }
    >
        {notificationData?.data?.map((item: any) => (
            <div
                onClick={() => routeNotification(item)}
                key={item._id}
                className="flex items-start space-x-4 p-4 hover:bg-default-100 rounded-lg transition-colors cursor-pointer"
            >
                {item.type === 'like' && <ThumbsUp />}
                {item.type === 'comment' && <MessageSquareText />}
                {item.type === 'follow' && <UserCheck />}
                {item.type === 'announcement' && <Megaphone />}
                {item.type === 'message' && <MessageCircleMore />}
                <p className="ml-2 text-sm">{item.content}</p>
            </div>
        ))}
    </InfiniteScroll>
};

export default Notifications;
