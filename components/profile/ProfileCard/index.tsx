"use client"
import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Avatar, Divider, Button } from "@nextui-org/react";
import { BookOpen, BookMarked, BookPlus, Users, UserPlus, UserCheck } from "lucide-react";
import { useFollowUserMutation, useUnfollowUserMutation } from '@/store/FollowStore';
import { useUserProfileQuery } from '@/store/UserStore';

const ProfileCard = ({ profileData }: any) => {
    const { user, isSelf, isFollow: initialIsFollow } = profileData;
    const [isFollow, setIsFollow] = useState(initialIsFollow);
    const [followUser] = useFollowUserMutation();
    const [unfollowUser] = useUnfollowUserMutation();
    const { data: userProfileData, refetch: refetchUserProfile } = useUserProfileQuery(user.userName);

    const handleFollowAction = async () => {
        try {
            if (isFollow) {
                await unfollowUser({ targetUserName: user.userName });
                setIsFollow(false);
            } else {
                await followUser({ targetUserName: user.userName });
                setIsFollow(true);
            }
            await refetchUserProfile();
        } catch (error) {
            console.error('Follow/Unfollow error:', error);
            setIsFollow(!isFollow);
        }
    };

    return (
        <Card className="bg-gradient-to-b from-white to-neutral-50 dark:from-gray-900 dark:to-gray-800 shadow-lg">
            <CardHeader className="flex flex-col items-center pt-6 pb-2">
                <Avatar
                    src={userProfileData?.user?.image || "https://picsum.photos/200/300"}
                    size="lg"
                    name={`${userProfileData?.user?.firstName} ${userProfileData?.user?.lastName}`}
                    className="w-24 h-24 text-large ring-white dark:ring-gray-800"
                />
                <div className="mt-3 text-center">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {userProfileData?.user?.firstName} {userProfileData?.user?.lastName}
                    </h2>
                    <p className="text-default-500 text-sm">@{userProfileData?.user?.userName}</p>
                </div>
            </CardHeader>
            <CardBody className="px-4 py-2">
                <div className="flex justify-center space-x-8 mb-4">
                    <div className="text-center group cursor-pointer hover:scale-105 transition-transform">
                        <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="font-semibold">{userProfileData?.counts?.followersCount}</span>
                        </div>
                        <p className="text-xs text-default-500">Takipçi</p>
                    </div>
                    <Divider orientation="vertical" className="h-8" />
                    <div className="text-center group cursor-pointer hover:scale-105 transition-transform">
                        <div className="flex items-center space-x-1">
                            <UserPlus className="w-4 h-4 text-primary" />
                            <span className="font-semibold">{userProfileData?.counts?.followsCount}</span>
                        </div>
                        <p className="text-xs text-default-500">Takip</p>
                    </div>
                </div>
                {!isSelf && (
                    <div className="flex justify-center mb-4">
                        <Button
                            color={isFollow ? "default" : "primary"}
                            variant={isFollow ? "bordered" : "solid"}
                            onPress={handleFollowAction}
                            startContent={isFollow ? <UserCheck size={18} /> : <UserPlus size={18} />}
                            className="font-medium"
                        >
                            {isFollow ? "Takip Ediliyor" : "Takip Et"}
                        </Button>
                    </div>
                )}

                <div className="bg-default-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 rounded-md bg-white/50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 transition-colors cursor-pointer">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <BookOpen className="w-4 h-4 text-success" />
                                <span className="font-semibold text-sm">{userProfileData?.counts?.readBooksCount}</span>
                            </div>
                            <p className="text-xs text-default-500">Okunan</p>
                        </div>
                        <div className="text-center p-2 rounded-md bg-white/50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 transition-colors cursor-pointer">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <BookMarked className="w-4 h-4 text-warning" />
                                <span className="font-semibold text-sm">{userProfileData?.counts?.readingBooksCount}</span>
                            </div>
                            <p className="text-xs text-default-500">Okunuyor</p>
                        </div>
                        <div className="text-center p-2 rounded-md bg-white/50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 transition-colors cursor-pointer">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <BookPlus className="w-4 h-4 text-secondary" />
                                <span className="font-semibold text-sm">{userProfileData?.counts?.wishlistBooksCount}</span>
                            </div>
                            <p className="text-xs text-default-500">İstek</p>
                        </div>
                    </div>
                </div>
                <div className="mt-3 text-center">
                    <p className="text-xs text-default-500">
                        Toplam <span className="font-semibold text-primary">{userProfileData?.counts?.totalBookCount}</span> kitap
                    </p>
                </div>
            </CardBody>
        </Card>
    );
};

export default ProfileCard;
