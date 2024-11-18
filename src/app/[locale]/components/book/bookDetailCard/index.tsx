"use client";
import { Card, CardBody, Progress, Button } from "@nextui-org/react";
import { BookOpen, Heart, Share2 } from "lucide-react";
import Image from "next/image";

interface BookDetailCardProps {
    book: any;
}

export default function BookDetailCard({ book }: BookDetailCardProps) {
    return (
        <Card className="bg-gradient-to-r from-default-100 to-default-200 shadow-xl">
            <CardBody className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="relative">
                            <Image
                                src={book.bookId.book_img}
                                alt={book.bookId.name}
                                width={300}
                                height={450}
                                className="rounded-xl shadow-lg"
                                objectFit="cover"
                            />
                            <div className="absolute top-3 right-10 flex gap-2">
                                <Button isIconOnly variant="flat" className="bg-default-50/70 backdrop-blur-md">
                                    <Heart className={`w-5 h-5 ${book.isFavorite ? 'fill-red-500 text-red-500' : 'text-primary'}`} />
                                </Button>
                                <Button isIconOnly variant="flat" className="bg-default-50/70 backdrop-blur-md">
                                    <Share2 className="w-5 h-5 text-primary" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{book.bookId.name}</h1>
                            <div className="flex items-center gap-4 mb-6">
                                <p className="text-xl text-default-700">{book.bookId.author?.name}</p>
                                <span className="text-default-700">•</span>
                                <p className="text-default-700">{book.bookId.publisher.name}</p>
                            </div>
                        </div>

                        <Card className="bg-gradient-to-r from-default-100 to-default-200 border-none">
                            <CardBody className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="w-6 h-6 text-orange-600" />
                                        <h3 className="text-lg font-semibold">Okuma İlerlemen</h3>
                                    </div>
                                    <p className="text-2xl font-bold text-orange-600">{book.process.percent}%</p>
                                </div>
                                <Progress
                                    value={parseFloat(book.process.percent)}
                                    className="mb-3"
                                    classNames={{
                                        indicator: "bg-gradient-to-r from-primary to-amber-500"
                                    }}
                                />
                                <div className="flex justify-between text-sm text-default-700">
                                    <span>{book.process.readCount} sayfa okundu</span>
                                    <span>{book.process.pageCount} toplam sayfa</span>
                                </div>
                            </CardBody>
                        </Card>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="space-y-2">
                                <p className="text-default-700">
                                    <span className="font-semibold">Yayın Yılı:</span> {book.bookId.publication_year}
                                </p>
                                <p className="text-default-700">
                                    <span className="font-semibold">ISBN:</span> {book.bookId.ISBN}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-default-700">
                                    <span className="font-semibold">Sayfa Sayısı:</span> {book.bookId.pages_count}
                                </p>
                                <p className="text-default-700">
                                    <span className="font-semibold">Ekleme Tarihi:</span> {new Date(book.createdAt).toLocaleDateString('tr-TR')}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-3">Kitap Hakkında</h3>
                            <p className="text-default-900 leading-relaxed">
                                {book.bookId.explanation}
                            </p>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}