"use client"
import { useLikeCommentMutation } from '@/store/LikeStore';
import { selectUser } from '@/store/UserStore/slice';
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, Divider, Input } from "@nextui-org/react";
import { ChevronDown, ChevronUp, Heart, MessageCircle, Send } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

export default function Post({ post }: any) {
    console.log("post", post);

    const { locale } = useParams()

    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [likeCount, setLikeCount] = useState(post.likeCount)
    const [likeComment] = useLikeCommentMutation();
    const userData = useSelector(selectUser);

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const handleLike = async () => {
        if (!userData) {
            toast.error("Beğenebilmeniz için giriş yapmalısınız.")
            return
        }
        setIsLiked(!isLiked)
        if (isLiked) {
            setLikeCount((prev: number) => prev - 1)
        }
        else {
            setLikeCount((prev: number) => prev + 1)
        }
        try {
            await likeComment(post.id);
        } catch (error) {
            setIsLiked(post.isLiked)
            setLikeCount(post.likeCount)
            console.error('Like işlemi başarısız:', error);
        }
    };
    useEffect(() => {
        setLikeCount(post.likeCount),
            setIsLiked(post.isLiked)
    }, [])


    return (
        <div className="relative w-full mt-10 p-2">
            <div className="absolute -top-8 left-10 z-20">

                <Card isHoverable className="w-28 h-36 border-0  hover:ring-1 hover:ring-primary/20">
                    <Link href={`/personalBooks/${post?.book?.slug}`}>
                        <Image
                            src={post?.book?.bookId?.images?.thumbnail ?? "/assets/book-placeholder.png"}
                            alt="Book cover"
                            width={120}
                            height={144}
                            className="object-cover rounded-lg"
                        />
                    </Link>
                </Card>

            </div>
            <Card shadow='sm' className="w-full rounded-lg bg-gradient-to-r bg-default-100">
                <CardHeader className="flex justify-between items-center px-8 pt-10 pb-4">
                    <div className="flex flex-col ml-32 space-y-1">
                        <Link href={`/personalBooks/${post?.book?.slug}`} className="text-lg font-bold hover:text-primary">{post?.book?.bookId?.name}</Link>
                        <p className="text-xs text-default-900">{post?.book?.bookId?.authors[0]?.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end text-right">
                            <Link href={`/${locale}/profile/${post.user.userName}`} className="text-md font-semibold hover:text-primary cursor-pointer">@{post?.user?.userName}</Link>
                            <p className="text-xs text-default-900">
                                {post?.user?.firstName + " " + post?.user?.lastName}
                            </p>
                        </div>
                        <Link href={`/${locale}/profile/${post.user.userName}`}>
                            <Avatar
                                src={post?.user?.image ?? "/assets/avatar.png"}
                                size="lg"
                                className="bg-primary border-2 border-default-100 shadow-md cursor-pointer hover:ring-1 hover:ring-primary"
                            />
                        </Link>
                    </div>
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
                            startContent={<Heart className={`w-4 h-4 text-red-500 ${isLiked && "fill-red-500"}`} />}
                            onClick={handleLike}
                        >
                            Like: {likeCount}
                        </Button>
                        <Button
                            variant="flat"
                            size="sm"
                            startContent={<MessageCircle className="w-4 h-4 text-blue-500" />}
                            endContent={showComments ?
                                <ChevronUp className="w-4 h-4" /> :
                                <ChevronDown className="w-4 h-4" />
                            }
                            onClick={toggleComments}
                        >
                            Comment: {post?.commentCount}
                        </Button>
                    </div>
                    <p className="text-xs text-default-900">24.11.2024 12:25</p>
                </CardFooter>

                {showComments && (
                    <div className="px-8 py-4 bg-default-100 rounded-b-lg">
                        {
                            userData && <div className="flex gap-4 mb-6">
                                <div className='flex justify-center items-center'>
                                    <Avatar
                                        src={userData?.image ?? "/assets/avatar.png"}
                                        size="sm"
                                        className="bg-primary"
                                    />
                                </div>
                                <div className="flex-1 flex gap-2">
                                    <Input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Yorumunuzu yazın..."
                                        variant="bordered"
                                        radius="full"
                                        className="flex-1"
                                        endContent={
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                size="sm"
                                                className="text-default-900"
                                            >
                                                <Send className="w-4 h-4" />
                                            </Button>
                                        }
                                    />
                                </div>
                            </div>
                        }

                        <div className="space-y-4">
                            {post.comments.map((comment: any) => (
                                <Card key={comment.id} className="w-full bg-content1">
                                    <CardBody className="p-4">
                                        <div className="flex gap-4">
                                            <Avatar
                                                src={comment?.user?.image ?? "/assets/avatar.png"}
                                                size="sm"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="font-semibold text-sm">
                                                        {comment?.user?.userName}
                                                    </p>
                                                    <p className="text-xs text-default-900">
                                                        {comment?.timestamp}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-default-800">
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