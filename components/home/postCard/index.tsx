"use client"
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button, Divider, Input } from "@nextui-org/react";
import { Heart, MessageCircle, ChevronDown, ChevronUp, Send } from "lucide-react";
import Image from "next/image";
import { useLikeCommentMutation } from '@/store/LikeStore';

export default function Post({ post }: any) {
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [likeCount, setLikeCount] = useState(post.likeCount)
    const [likeComment] = useLikeCommentMutation();

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const handleLike = async () => {
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
        <div className="relative w-full max-w-2xl mt-4 p-2">
            <div className="absolute -top-8 left-10 z-10">
                <Card isHoverable className="w-28 h-36 border-0">
                    <Image
                        src={post?.book?.bookId?.book_img ?? "/assets/authh.jpg"}
                        alt="Book cover"
                        width={120}
                        height={144}
                        className="object-cover rounded-lg"
                    />
                </Card>
            </div>

            <Card className="w-full rounded-lg bg-gradient-to-r bg-gray-50">
                <CardHeader className="flex justify-between items-center px-8 pt-10 pb-4">
                    <div className="flex flex-col ml-32 space-y-1">
                        <p className="text-lg font-bold">{post?.book?.bookId?.name}</p>
                        <p className="text-xs text-gray-600">{post?.book.bookId.author.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end text-right">
                            <p className="text-md font-semibold">{post?.user?.userName}</p>
                            <p className="text-xs text-gray-500">
                                {post?.user?.firstName + " " + post?.user?.lastName}
                            </p>
                        </div>
                        <Avatar
                            src={post?.user?.image ?? "/assets/avatar.png"}
                            size="lg"
                            className="bg-primary border-2 border-white shadow-md"
                        />
                    </div>
                </CardHeader>

                <Divider />

                <CardBody className="px-8 py-6">
                    <p className="font-light text-sm leading-relaxed text-gray-700">
                        {post?.content}
                    </p>
                </CardBody>
                <Divider />
                <CardFooter className="flex justify-between items-center px-8 py-4 bg-gray-50">
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
                    <p className="text-xs text-gray-400">24.11.2024 12:25</p>
                </CardFooter>

                {showComments && (
                    <div className="px-8 py-4 bg-default-100 rounded-b-lg">
                        <div className="flex gap-4 mb-6">
                            <Avatar
                                src="/assets/avatar.png"
                                size="sm"
                                className="bg-primary"
                            />
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
                        <div className="space-y-4">
                            {post.comments.map((comment: any) => (
                                <Card key={comment.id} className="w-full bg-content1">
                                    <CardBody className="p-4">
                                        <div className="flex gap-4">
                                            <Avatar
                                                src={comment.user.image}
                                                size="sm"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="font-semibold text-sm">
                                                        {comment.user.userName}
                                                    </p>
                                                    <p className="text-xs text-default-400">
                                                        {comment.timestamp}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-default-700">
                                                    {comment.content}
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