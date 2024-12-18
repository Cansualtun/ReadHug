'use client';
import { Card, CardHeader } from '@nextui-org/card';
import PostCard from '../home/postCard';
import ProfileCard from '../profile/ProfileCard';
import Skeleton from '../profile/ProfileCard/Skeleton';
import { AlertCircle } from 'lucide-react';
import { Button } from '@nextui-org/button';
import Link from 'next/link';

type Props = {
  post: any;
  profile: any;
  locale: string;
};

const SinglePost = ({ post, profile, locale }: Props) => {
  console.log('post', post);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="order-1 lg:order-1 lg:col-span-4">
        <div className="sticky top-[55px]">
          {profile ? <ProfileCard profileData={profile} /> : <Skeleton />}
        </div>
      </div>
      {!post.data.isDeleted ? (
        <div className="order-2 lg:order-2 lg:col-span-8 -mt-3">
          <PostCard
            post={post.data}
            isOpenComment={true}
            isProfileCard={false}
          />
        </div>
      ) : (
        <div className="order-2 lg:order-2 lg:col-span-8">
          <Card shadow="sm">
            <CardHeader className="flex flex-col items-center justify-center space-x-2">
              <AlertCircle size={100} className="text-danger" />
              <p className="text-xl mt-4">Bu gönderiye erişilemiyor.</p>
              <div className="mt-4 flex items-center gap-2">
                <Link
                  className="p-2 rounded-lg bg-default-100 hover:bg-primary hover:text-white"
                  href={`/${locale}/profile/${post?.data?.user?.userName}`}
                >
                  Kullanıcı Sayfası
                </Link>
                <Link className="p-2 rounded-lg bg-default-100 hover:bg-primary hover:text-white" href={`/${locale}`}>
                  Anasayfa
                </Link>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SinglePost;
