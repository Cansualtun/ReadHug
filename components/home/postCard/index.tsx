'use client'

import { Card, CardHeader, CardBody, CardFooter, Avatar, Button, Divider } from "@nextui-org/react"
import { Heart, MessageCircle } from "lucide-react"
import Image from "next/image"

export default function Post() {
    return (
        <div className="relative w-full max-w-2xl mx-auto mt-4 p-2">
            <div className="absolute -top-8 left-10 z-10">
                <Card isHoverable className="w-28 h-36 border-0">
                    <Image
                        src="https://i.dr.com.tr/cache/600x600-0/originals/0001946721001-1.jpg"
                        alt="Book cover"
                        width={120}
                        height={144}
                        className="object-cover rounded-lg"
                    />
                </Card>
            </div>
            <Card className="w-full shadow-md rounded-lg bg-gradient-to-r bg-gray-50">
                <CardHeader className="flex justify-between items-center px-8 pt-10 pb-4">
                    <div className="flex flex-col ml-32 space-y-1">
                        <p className="text-lg font-bold">Kitap İsmi</p>
                        <p className="text-xs text-gray-600">Yazar Adı</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end text-right">
                            <p className="text-md font-semibold">UserName</p>
                            <p className="text-xs text-gray-500">firstName lastName</p>
                        </div>
                        <Avatar
                            src="/placeholder.svg?height=50&width=50"
                            size="lg"
                            className="bg-primary border-2 border-white shadow-md"
                        />
                    </div>
                </CardHeader>

                <Divider />

                <CardBody className="px-8 py-6">
                    <p className="font-light text-sm leading-relaxed text-gray-700">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
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
                            Comment: 9
                        </Button>
                    </div>
                    <p className="text-xs text-gray-400">24.11.2024 12:25</p>
                </CardFooter>
            </Card>
        </div>
    )
}
