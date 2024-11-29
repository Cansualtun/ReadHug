'use client';
import { useCommentPostMutation } from '@/store/CommentStore';
import { useLikeCommentMutation } from '@/store/LikeStore';
import { selectUser } from '@/store/UserStore/slice';
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
} from '@nextui-org/react';
import axios from 'axios';
import {
  ChevronDown,
  ChevronUp,
  Heart,
  MessageCircle,
  Send,
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
}: any) {
  const router = useRouter();
  const { locale } = useParams();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [likeComment] = useLikeCommentMutation();
  const [commentPost] = useCommentPostMutation();
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
      const BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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
  const handleEnterKeyDown = (e: any) => {
    e.key == 'Enter' && handleComment();
  };
  useEffect(() => {
    setLikeCount(post.likeCount);
    setIsLiked(post.isLiked);
    if (showComments) {
      handleGetComment();
    }
  }, [showComments]);

  return (
    <div className="relative w-full mt-10 p-2">
      <div className="absolute -top-8 left-10 z-20">
        <Card
          isHoverable
          className="w-28 h-36 border-0  hover:ring-1 hover:ring-primary/20"
        >
          <Link href={`/personalBooks/${post?.book?.slug}`} className="h-full">
            <Image
              src={
                post?.book?.bookId?.images?.thumbnail ??
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
        className="w-full rounded-lg bg-gradient-to-r bg-default-100"
      >
        <CardHeader className="flex justify-between items-center px-8 pt-10 pb-6">
          <div className="flex flex-col ml-32 space-y-1">
            <Link
              href={`/personalBooks/${post?.book?.slug}`}
              className="text-md font-bold hover:text-primary"
            >
              {post?.book?.bookId?.name}
            </Link>
            <p className="text-xs text-default-900">
              {post?.book?.bookId?.authors[0]?.name}
            </p>
          </div>
          {isProfileCard && (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end text-right">
                <Link
                  href={`/${locale}/profile/${post.user.userName}`}
                  className="text-md font-semibold hover:text-primary cursor-pointer"
                >
                  @{post?.user?.userName}
                </Link>
                <p className="text-xs text-default-900">
                  {post?.user?.firstName + ' ' + post?.user?.lastName}
                </p>
              </div>
              <Link href={`/${locale}/profile/${post.user.userName}`}>
                <Avatar
                  src={post?.user?.image ?? '/assets/avatar.png'}
                  size="lg"
                  className="bg-primary border-2 border-default-100 shadow-md cursor-pointer hover:ring-1 hover:ring-primary"
                />
              </Link>
            </div>
          )}
        </CardHeader>
        <Divider />
        <CardBody className="px-8 py-6">
          <p className="font-light text-sm leading-relaxed text-default-900">
            {post?.content}
          </p>
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-between items-center px-8 py-4 bg-default-100">
          <div className="flex gap-5">
            <Button
              variant="flat"
              size="sm"
              startContent={
                <Heart
                  className={`w-4 h-4 text-red-500 ${isLiked && 'fill-red-500'}`}
                />
              }
              onClick={handleLike}
            >
              Like: {likeCount}
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
            >
              Comment: {post?.commentCount}
            </Button>
          </div>
          <button
            onClick={() => router.push(`/${locale}/post/${post._id}`)}
            className="text-xs text-default-900 hover:text-primary"
          >
            {formatDate(post.createdAt, 'dateTime')}
          </button>
        </CardFooter>

        {showComments || isOpenComment ? (
          <div className="px-8 py-4 bg-default-100 rounded-b-lg">
            {userData && (
              <div className="flex gap-4 mb-6">
                <div className="flex justify-center items-center">
                  <Avatar
                    src={userData?.image ?? '/assets/avatar.png'}
                    size="sm"
                    className="bg-primary"
                  />
                </div>
                <div className="flex-1 flex gap-2">
                  <Input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={handleEnterKeyDown}
                    placeholder="Yorumunuzu yazın..."
                    variant="bordered"
                    radius="full"
                    className="flex-1"
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

            <div className="space-y-4">
              {comments.map((comment: any) => (
                <Card key={comment.id} className="w-full bg-content1">
                  <CardBody className="p-4">
                    <div className="flex gap-2 items-center">
                      <Link
                        href={`/${locale}/profile/${post.user.userName}`}
                        className="text-sm font-semibold hover:text-primary cursor-pointer"
                      >
                        <Avatar
                          src={comment?.user?.image ?? '/assets/avatar.png'}
                          size="sm"
                          className="hover:ring-1 hover:ring-offset-1 hover:ring-primary"
                        />
                      </Link>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <Link
                            href={`/${locale}/profile/${post.user.userName}`}
                            className="text-sm font-semibold hover:text-primary cursor-pointer"
                          >
                            {post?.user?.userName}
                          </Link>
                          <p className="text-xs text-default-900">
                            {formatDate(comment?.createdAt, 'dateTime')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 w-full py-4">
                      <p className="text-sm text-default-800">
                        {comment?.content}
                      </p>
                    </div>
                    <div className="mt-2 border-t pt-4">
                      <Button
                        variant="flat"
                        size="sm"
                        startContent={
                          <Heart
                            className={`w-2 h-2 text-red-500 ${isLiked && 'fill-red-500'}`}
                          />
                        }
                        onClick={handleLike}
                      >
                        Like: {likeCount}
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          ''
        )}
      </Card>
    </div>
  );
}
