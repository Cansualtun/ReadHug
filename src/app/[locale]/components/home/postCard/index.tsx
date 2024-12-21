'use client';
import { useCommentPostMutation } from '@/store/CommentStore';
import { useLikeCommentMutation } from '@/store/LikeStore';
import { useMorePostsMutation } from '@/store/PostStore';
import { selectUser } from '@/store/UserStore/slice';
import formatBaseUrl from '@/utils/formatBaseUrl';
import { formatDate } from '@/utils/formatDate';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import axios from 'axios';
import {
  ChevronDown,
  ChevronUp,
  EllipsisVertical,
  Heart,
  MessageCircle,
  Send,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

export default function Post({
  post,
  isOpenComment,
  isProfileCard = true,
  profileData,
  mount,
}: any) {
  const router = useRouter();
  const { locale } = useParams();
  const [showComments, setShowComments] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [likeComment] = useLikeCommentMutation();
  const [commentPost] = useCommentPostMutation();
  const [profile, setProfile] = useState<any>(profileData);
  const [posts] = useMorePostsMutation();

  const userData = useSelector(selectUser);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleLike = async () => {
    if (!userData) {
      toast.error('Beğenebilmeniz için giriş yapmalısınız.');
      return;
    }
    setIsLiked(!isLiked);
    if (isLiked) {
      setLikeCount((prev: number) => prev - 1);
    } else {
      setLikeCount((prev: number) => prev + 1);
    }
    try {
      await likeComment(post.id);
    } catch (error) {
      setIsLiked(post.isLiked);
      setLikeCount(post.likeCount);
      console.error('Like işlemi başarısız:', error);
    }
  };
  const handleComment = async () => {
    if (!userData) {
      toast.error('Beğenebilmeniz için giriş yapmalısınız.');
      return;
    }
    try {
      await commentPost({
        content: newComment,
        postId: post._id,
      });
      setNewComment('');
      await handleGetComment();
    } catch (error) {}
  };
  const handleGetComment = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
      let BASE_URL = '';
      if (process.env.NODE_ENV === 'development') {
        BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
      }
      if (process.env.NODE_ENV === 'production') {
        BASE_URL = 'https://bookarchive-production.up.railway.app';
      }

      const { data } = await axios.get(
        `${BASE_URL}/comment/posts/${post._id}?page=${page}&limit=${limit}&sort=desc`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setComments(data.data);
    } catch (error) {
      console.log('error', error);
    }
  };
  const handleDeletePost = async () => {
    try {
      const { token, BASE_URL } = formatBaseUrl();

      await axios.delete(`${BASE_URL}/posts/user/delete/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success('Post silindi.');
      posts({ page, limit });
      await mount();
    } catch (error) {
      console.error('Post silinemedi:', error);
    }
  };
  const handleEnterKeyDown = (e: any) => {
    e.key == 'Enter' && handleComment();
  };
  useEffect(() => {
    setLikeCount(post.likeCount);
    setIsLiked(post.isLiked);
    if (showComments || !isProfileCard) {
      handleGetComment();
    }
  }, [showComments]);

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    }
  }, [profileData]);

  return (
    <div className="relative w-full mt-10 p-2">
      <div className="absolute -top-8 left-4 sm:left-10 z-20">
        <Card
          isHoverable
          className="w-16 h-24 sm:w-20 sm:h-28 border-0 hover:ring-1 hover:ring-primary/20"
        >
          <Link href={`/userBook/${post?.book?.slug}`} className="h-full">
            <Image
              src={
                post?.book?.bookId?.images?.thumbnail ||
                post?.book?.bookId?.images?.smallThumbnail ||
                '/assets/book-placeholder.png'
              }
              alt="Book cover"
              width={120}
              height={144}
              className="object-cover rounded-lg object-center h-full"
            />
          </Link>
        </Card>
      </div>

      <Card
        shadow="sm"
        className="w-full rounded-lg bg-gradient-to-r bg-default-100 relative"
      >
        {profile && profile?.isSelf && profile?.isLoggedIn && (
          <div className="absolute right-1 top-1 bg-default-50 rounded-full p-1 group z-40">
            <Popover
              classNames={{
                content: 'p-1',
              }}
              placement="bottom-end"
              showArrow
              offset={5}
            >
              <PopoverTrigger>
                <div role="button">
                  <EllipsisVertical
                    size={16}
                    className="group-hover:text-primary"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col  w-40">
                  <Button
                    variant="light"
                    onClick={handleDeletePost}
                    className="flex items-center justify-start hover:bg-default-500"
                  >
                    <Trash2 /> Sil
                  </Button>
                  <Button
                    variant="light"
                    onClick={() => setOpenReport(true)}
                    className="flex items-center justify-start hover:bg-default-500"
                  >
                    <ShieldAlert /> Bildir
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-8 pb-4 sm:pb-6">
          <div className="flex flex-col ml-16 sm:ml-24 space-y-1">
            <Link
              href={`/userBook/${post?.book?.slug}`}
              className="text-sm sm:text-md font-bold hover:text-primary line-clamp-1"
            >
              {post?.book?.bookId?.name}
            </Link>
            <p className="text-xs text-default-900 line-clamp-1">
              {post?.book?.bookId?.authors[0]?.name}
            </p>
          </div>
          {isProfileCard && (
            <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
              <div className="flex flex-col items-end text-right">
                <Link
                  href={`/${locale}/profile/${post.user.userName}`}
                  className="text-sm sm:text-md font-semibold hover:text-primary cursor-pointer"
                >
                  @{post?.user?.userName}
                </Link>
                <p className="text-xs text-default-900 hidden sm:block">
                  {post?.user?.firstName} {post?.user?.lastName}
                </p>
              </div>
              <Link href={`/${locale}/profile/${post.user.userName}`}>
                <Avatar
                  src={post?.user?.image ?? '/assets/avatar.png'}
                  size="sm"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-primary border-2 border-default-100 shadow-md cursor-pointer hover:ring-1 hover:ring-primary"
                />
              </Link>
            </div>
          )}
        </CardHeader>
        <Divider />
        <CardBody className="px-4 sm:px-8 py-4 sm:py-6">
          <p
            className="font-light text-sm leading-relaxed text-default-900"
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {post?.content}
          </p>
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-start sm:items-center px-4 sm:px-8 py-3 sm:py-4 bg-default-100 rounded-none">
          <div className="flex gap-3 sm:gap-5">
            <Button
              variant="flat"
              size="sm"
              startContent={
                <Heart
                  className={`w-4 h-4 text-red-500 ${isLiked && 'fill-red-500'}`}
                />
              }
              onClick={handleLike}
              className="min-w-0 px-2 sm:px-3"
            >
              <span className="text-xs">{likeCount}</span>
            </Button>
            <Button
              variant="flat"
              size="sm"
              startContent={<MessageCircle className="w-4 h-4 text-blue-500" />}
              endContent={
                showComments || isOpenComment ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )
              }
              onClick={toggleComments}
              className="min-w-0 px-2 sm:px-3"
            >
              <span className="text-xs">{post?.commentCount}</span>
            </Button>
          </div>
          <button
            onClick={() => router.push(`/${locale}/post/${post._id}`)}
            className="text-xs text-default-900 hover:text-primary"
          >
            {formatDate(post.createdAt, 'dateTime')}
          </button>
        </CardFooter>
        {(showComments || isOpenComment) && (
          <div className="px-4 sm:px-8 py-4 bg-default-100 rounded-b-lg">
            {userData && (
              <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6">
                <Avatar
                  src={userData?.image ?? '/assets/avatar.png'}
                  size="sm"
                  className="w-8 h-8 bg-primary"
                />
                <div className="flex-1 flex gap-2">
                  <Input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={handleEnterKeyDown}
                    placeholder="Write a comment..."
                    variant="bordered"
                    radius="full"
                    className="flex-1"
                    size="sm"
                    endContent={
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        onClick={handleComment}
                        className="text-default-900"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    }
                  />
                </div>
              </div>
            )}
            <div className="space-y-3 sm:space-y-4">
              {comments.map((comment: any) => (
                <Card key={comment.id} className="w-full bg-content1">
                  <CardBody className="p-3 sm:p-4">
                    <div className="flex gap-2 items-start sm:items-center">
                      <Link
                        href={`/${locale}/profile/${comment.user.userName}`}
                      >
                        <Avatar
                          src={comment?.user?.image ?? '/assets/avatar.png'}
                          size="sm"
                          className="w-7 h-7 hover:ring-1 hover:ring-primary"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                          <Link
                            href={`/${locale}/profile/${comment.user.userName}`}
                            className="text-sm font-semibold hover:text-primary truncate"
                          >
                            {comment.user.userName}
                          </Link>
                          <p className="text-xs text-default-900">
                            {formatDate(comment?.createdAt, 'dateTime')}
                          </p>
                        </div>
                        <p className="text-sm text-default-800 mt-2">
                          {comment?.content}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
