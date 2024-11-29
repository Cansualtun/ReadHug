'use client';
import { ProfilInfo } from '@/app/[locale]/server/profile';
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetFollowListQuery,
} from '@/store/FollowStore';
import { setMessageOpened } from '@/store/MessageStore';
import { useUserProfileQuery } from '@/store/UserStore';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  Spinner,
  button,
} from '@nextui-org/react';
import axios from 'axios';
import {
  BookMarked,
  BookOpen,
  BookPlus,
  Edit2Icon,
  ImagePlus,
  Save,
  Send,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const ProfileCard = ({ profileData }: any) => {
  console.log("profileData", profileData);

  const dispatch = useDispatch();
  const t = useTranslations('ProfileCard');
  const params = useParams();

  const [profile, setProfile] = useState(profileData);
  const { user, isSelf, isFollow: initialIsFollow } = profile;
  const [isFollow, setIsFollow] = useState(initialIsFollow);
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [upgradeImage, setUpgradeImage] = useState<null | FileList>(null);
  const { data: userProfileData, refetch: refetchUserProfile } =
    useUserProfileQuery(user.userName);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following'>(
    'followers',
  );
  const { data: followListData, isLoading: isFollowListLoading } =
    useGetFollowListQuery(user.userName, {
      skip: !isModalOpen,
    });

  const handleModalOpen = (type: 'followers' | 'following') => {
    setModalType(type);
    setIsModalOpen(true);
  };

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

  const handleMessageAction = async () => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];
    try {
      const { data } = await axios.post(
        `http://localhost:4000/message/create/row`,
        {
          receiver: profileData.user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      dispatch(
        setMessageOpened({
          status: true,
          messageRow: data.data,
          user: data.user,
        }),
      );
    } catch (error) { }
  };

  const renderFollowList = () => {
    if (isFollowListLoading) {
      return (
        <div className="flex justify-center p-4">
          <Spinner />
        </div>
      );
    }

    const list =
      modalType === 'followers'
        ? followListData?.followers || []
        : followListData?.following || [];

    return (
      <div className="space-y-4">
        {list.map((item: any) => {
          const userData =
            modalType === 'followers' ? item.follower : item.following;

          return (
            <Link href={`/profile/${userData.userName}`}>
              <span
                key={item._id}
                className="flex items-center justify-between p-2 hover:bg-default-100 rounded-lg"
              >
                <span className="flex items-center gap-3">
                  <Avatar
                    src={userData.image || 'https://picsum.photos/200/300'}
                    size="sm"
                    name={`${userData.firstName} ${userData.lastName}`}
                  />
                  <div>
                    <p className="font-medium">
                      {userData.firstName} {userData.lastName}
                    </p>
                    <p className="text-small text-default-500">
                      @{userData.userName}
                    </p>
                  </div>
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    );
  };
  const avatarUpgrade = async () => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];
    try {
      if (!upgradeImage) {
        console.error('No image selected for upload');
        return;
      }
      const formData = new FormData();
      formData.append('image', upgradeImage[0] as any);
      const { data } = await axios.patch(
        `http://localhost:4000/user/uploadProfileImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      //   await ProfilInfo(params.slug as string);
    } catch (error) { }
  };

  useEffect(() => {
    setProfile(profileData);
  }, [profileData]);

  return (
    <Card shadow="sm" className="bg-default-50">
      <CardHeader className="flex flex-col items-center pt-6 pb-2">
        <div className="relative group">
          {!upgradeImage ? (
            <Avatar
              src={userProfileData?.user?.image || '/assets/avatar.png'}
              size="lg"
              name={`${userProfileData?.user?.firstName} ${userProfileData?.user?.lastName}`}
              className="w-24 h-24 text-large ring-white dark:ring-primary"
            />
          ) : (
            <Avatar
              src={URL.createObjectURL(upgradeImage[0])}
              size="lg"
              name={`${userProfileData?.user?.firstName} ${userProfileData?.user?.lastName}`}
              className="w-24 h-24 text-large ring-white dark:ring-primary"
            />
          )}
          {isSelf && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden group-hover:flex w-24 h-24 bg-white/50 justify-center items-center">
              <label
                htmlFor="upgradeImage"
                className="bg-white/80 rounded-full w-10 h-10 flex justify-center items-center cursor-pointer transition-all"
              >
                <ImagePlus />
              </label>
              <input
                type="file"
                name=""
                id="upgradeImage"
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const files = e.target.files;
                  if (files) {
                    setUpgradeImage(files as FileList);
                  }
                }}
              />
            </div>
          )}
        </div>

        {upgradeImage && (
          <div className="mt-2">
            <button
              onClick={avatarUpgrade}
              className="flex items-center bg-primary text-white px-2 py-0.5 rounded-md text-sm"
            >
              <Save size={16} className="mr-1" /> Kaydet
            </button>
          </div>
        )}

        <div className="mt-3 text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
            {userProfileData?.user?.firstName} {userProfileData?.user?.lastName}
          </h2>
          <p className="text-default-500 text-sm">
            @{userProfileData?.user?.userName}
          </p>
        </div>
      </CardHeader>
      <CardBody className="px-4 py-2">
        <div className="flex justify-center space-x-8 mb-4">
          <div
            onClick={() => handleModalOpen('followers')}
            className="text-center group cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-semibold">
                {userProfileData?.counts?.followersCount}
              </span>
            </div>
            <p className="text-xs text-default-500">{t('stats.followers')}</p>
          </div>
          <Divider orientation="vertical" className="h-8" />
          <div
            onClick={() => handleModalOpen('following')}
            className="text-center group cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="flex items-center space-x-1">
              <UserPlus className="w-4 h-4 text-primary" />
              <span className="font-semibold">
                {userProfileData?.counts?.followsCount}
              </span>
            </div>
            <p className="text-xs text-default-500">{t('stats.following')}</p>
          </div>
        </div>
        {!isSelf && (
          <div className="flex justify-center mb-4">
            <Button
              color={isFollow ? 'default' : 'primary'}
              variant={isFollow ? 'bordered' : 'solid'}
              onPress={handleFollowAction}
              startContent={
                isFollow ? <UserCheck size={18} /> : <UserPlus size={18} />
              }
              className="font-medium"
            >
              {isFollow
                ? t('followButton.following')
                : t('followButton.follow')}
            </Button>
            <Button
              color={isFollow ? 'default' : 'primary'}
              variant={isFollow ? 'bordered' : 'solid'}
              onPress={handleMessageAction}
              startContent={<Send size={18} />}
              className="font-medium ml-1"
            >
              {t('messageButton.sendMessage')}
            </Button>
          </div>
        )}

        <div className="bg-default-200 rounded-lg p-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-md bg-default-50 transition-colors cursor-pointer">
              <div className="flex items-center justify-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-success" />
                <span className="font-semibold text-sm">
                  {userProfileData?.counts?.readingBooksCount}
                </span>
              </div>
              <p className="text-xs text-default-500">
                {t('stats.books.reading')}
              </p>
            </div>
            <div className="text-center p-2 rounded-md bg-default-50 transition-colors cursor-pointer">
              <div className="flex items-center justify-center gap-2 mb-1">
                <BookMarked className="w-4 h-4 text-warning" />
                <span className="font-semibold text-sm">
                  {userProfileData?.counts?.readBooksCount}
                </span>
              </div>
              <p className="text-xs text-default-500">
                {t('stats.books.read')}
              </p>
            </div>
            <div className="text-center p-2 rounded-md bg-default-50 transition-colors cursor-pointer">
              <div className="flex items-center justify-center gap-2 mb-1">
                <BookPlus className="w-4 h-4 text-secondary" />
                <span className="font-semibold text-sm">
                  {userProfileData?.counts?.wishlistBooksCount}
                </span>
              </div>
              <p className="text-xs text-default-500">
                {t('stats.books.wishlist')}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-3 text-center">
          <p className="text-xs text-default-500">
            {t('stats.books.total', {
              count: userProfileData?.counts?.totalBookCount,
            })}
          </p>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          size="md"
        >
          <ModalContent>
            <ModalHeader>
              {modalType === 'followers'
                ? t('modal.followers')
                : t('modal.following')}
            </ModalHeader>
            <ModalBody>{renderFollowList()}</ModalBody>
          </ModalContent>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default ProfileCard;
