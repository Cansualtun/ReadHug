'use client'

import { Card, CardHeader, CardBody, CardFooter, Avatar, Button, Divider } from "@nextui-org/react"
import { Heart, MessageCircle } from "lucide-react"
import Image from "next/image"

export default function Post({ post }: any) {
    return (
        <div className="relative w-full max-w-2xl  mt-4 p-2">
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
                            <p className="text-xs text-gray-500">{post?.user?.firstName + " " + post?.user?.lastName}</p>
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
                            startContent={<Heart className="w-4 h-4 text-red-500" />}
                        >
                            Like: 11
                        </Button>
                        <Button
                            variant="flat"
                            size="sm"
                            startContent={<MessageCircle className="w-4 h-4 text-blue-500" />}
                        >
                            Comment: {post?.commentCount}
                        </Button>
                    </div>
                    <p className="text-xs text-gray-400">24.11.2024 12:25</p>
                </CardFooter>
            </Card>
        </div>
    )
}
