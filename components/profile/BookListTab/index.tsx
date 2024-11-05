"use client"
import React from 'react';
import { Tabs, Tab, Card, CardBody, Progress } from "@nextui-org/react";
import { BookOpen, BookMarked, BookPlus } from "lucide-react";

const BookListTabs = ({ bookLists }: any) => {
    return (
        <div className="w-full">
            <Tabs
                aria-label="Book Lists"
                color="success"
                variant="bordered"
                classNames={{
                    tabList: "gap-6 bg-white",
                    cursor: "w-full bg-gray-100",
                    tab: "max-w-fit px-4 h-10",
                    tabContent: "group-data-[selected=true]:text-primary"
                }}
            >
                <Tab
                    key="reading"
                    title={
                        <div className="flex items-center space-x-2">
                            <BookMarked className="w-4 h-4" />
                            <span>Okunuyor</span>
                        </div>
                    }
                >
                    <Card className='bg-gradient-to-b from-white to-neutral-50 dark:from-gray-900 dark:to-gray-800 shadow-lg'>
                        <CardBody>
                            <div className="grid gap-4">
                                {bookLists?.data?.filter((book: any) => book.type === "1").map((book: any) => (
                                    <div key={book._id} className="flex items-start space-x-4 p-4 hover:bg-default-100 rounded-lg transition-colors">
                                        <img
                                            src={book.bookId.book_img || "https://picsum.photos/100/150"}
                                            alt={book.bookId.name}
                                            className="w-20 h-28 object-cover rounded-md shadow-md"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{book.bookId.name}</h3>
                                            <p className="text-default-500">Yazar İsmi: {book.bookId.author.name}</p>
                                            <div className="mt-4 space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>
                                                        İlerleme: {book.process?.readCount || 0}/{book.process?.pageCount || book.bookId.pages_count || 0}
                                                    </span>
                                                    <span>
                                                        %{book.process?.percent || "0"}
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={parseFloat(book.process?.percent || "0")}
                                                    className="max-w-full"
                                                    size="sm"
                                                    color="primary"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
                <Tab
                    key="read"
                    title={
                        <div className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4" />
                            <span>Okunan</span>
                        </div>
                    }
                >
                    <Card>
                        <CardBody>
                            <div className="grid gap-4">
                                {bookLists?.data?.filter((book: any) => book.type === "0").map((book: any) => (
                                    <div key={book._id} className="flex items-start space-x-4 p-4 hover:bg-default-100 rounded-lg transition-colors">
                                        <img
                                            src={book.bookId.book_img || "https://picsum.photos/100/150"}
                                            alt={book.bookId.name}
                                            className="w-20 h-28 object-cover rounded-md shadow-md"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{book.bookId.name}</h3>
                                            <p className="text-default-500">Yazar İsmi: {book.bookId.author}</p>
                                            <div className="mt-2 text-sm text-default-400">
                                                <span>Sayfa Sayısı: {book.bookId.pages_count}</span>
                                                <span className="mx-2">•</span>
                                                <span>Yayın Yılı: {book.bookId.publication_year}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
                <Tab
                    key="wishlist"
                    title={
                        <div className="flex items-center space-x-2">
                            <BookPlus className="w-4 h-4" />
                            <span>İstek Listesi</span>
                        </div>
                    }
                >
                    <Card>
                        <CardBody>
                            <div className="grid gap-4">
                                {bookLists?.data?.filter((book: any) => book.type === "2").map((book: any) => (
                                    <div key={book._id} className="flex items-start space-x-4 p-4 hover:bg-default-100 rounded-lg transition-colors">
                                        <img
                                            src={book.bookId.book_img || "https://picsum.photos/100/150"}
                                            alt={book.bookId.name}
                                            className="w-20 h-28 object-cover rounded-md shadow-md"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{book.bookId.name}</h3>
                                            <p className="text-default-500">Yazar İsmi: {book?.bookId?.author?.name}</p>
                                            <div className="mt-2 text-sm text-default-400">
                                                <span>Eklenme: {new Date(book.createdAt).toLocaleDateString('tr-TR')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
                <Tab
                    key="post"
                    title={
                        <div className="flex items-center space-x-2">
                            <BookPlus className="w-4 h-4" />
                            <span>Posts</span>
                        </div>
                    }
                >
                    <Card>
                        <CardBody>
                            <div className="grid gap-4">
                                {bookLists?.data?.filter((book: any) => book.type === "2").map((book: any) => (
                                    <div key={book._id} className="flex items-start space-x-4 p-4 hover:bg-default-100 rounded-lg transition-colors">
                                        <img
                                            src={book.bookId.book_img || "https://picsum.photos/100/150"}
                                            alt={book.bookId.name}
                                            className="w-20 h-28 object-cover rounded-md shadow-md"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{book.bookId.name}</h3>
                                            <p className="text-default-500">Yazar İsmi: {book?.bookId?.author?.name}</p>
                                            <div className="mt-2 text-sm text-default-400">
                                                <span>Eklenme: {new Date(book.createdAt).toLocaleDateString('tr-TR')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    );
};

export default BookListTabs;