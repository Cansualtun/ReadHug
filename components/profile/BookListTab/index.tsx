"use client"
import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { BookOpen, BookMarked, BookPlus, MessageCircle, CheckCircleIcon } from "lucide-react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { BookType } from '@/enums/bookType';
import { Selection } from "@nextui-org/react";
import ProgressBar from '@/components/ui/progressBar';
import PostCard from '@/components/home/postCard';

const BookListTabs = ({ bookLists, slug, post }: any) => {
    const [serverBooks] = useState(bookLists.data || []);
    const [userPost, setUserPost] = useState([]);
    const [additionalBooks, setAdditionalBooks] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(2);
    const [selectedTab, setSelectedTab] = useState("1");
    const [loading, setLoading] = useState(false);

    // Todo -- Componenti ayır
    const EmptyState = ({ message }: { message: string }) => (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <p className="text-default-500 text-lg">{message}</p>
        </div>
    );

    useEffect(() => {
        setUserPost(post.data)
    }, [post])

    // client api servisine yaz
    const loadMore = async () => {
        if (loading) return;

        try {
            setLoading(true);
            const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

            const response = await fetch(`${BASE_URL}/user/books/${slug}/${selectedTab}?page=${page}&limit=10`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            const newData = await response.json();

            if (!newData.data || newData.data.length === 0) {
                setHasMore(false);
                return;
            }

            setAdditionalBooks(prev => [...prev, ...newData.data]);
            setPage(prev => prev + 1);
        } catch (error) {
            console.error("Error loading more books:", error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (key: Selection) => {
        const selectedKey = Array.from(key)[0] as string;
        setSelectedTab(key as any);
        setAdditionalBooks([]);
        setPage(2);
        setHasMore(true);
    };


    const renderBookList = (type: BookType) => {
        const serverFilteredData = serverBooks.filter((book: any) => book.type === type);
        const additionalFilteredData = selectedTab === type ? additionalBooks : [];
        const allData = [...serverFilteredData, ...additionalFilteredData];

        return allData.length > 0 ? (
            <InfiniteScroll
                dataLength={allData.length}
                next={loadMore}
                hasMore={hasMore}
                loader={loading && <h4 className="text-center py-4">Yükleniyor...</h4>}
                endMessage={!hasMore && (
                    <p className="text-center py-4">Tüm kitaplar yüklendi.</p>
                )}
                scrollableTarget="scrollableDiv"
            >
                <div className="grid gap-4">
                    {allData.map((book: any) => (
                        <div key={book._id} className="flex items-start space-x-4 p-4 hover:bg-default-100 rounded-lg transition-colors">
                            <img
                                src={book.bookId.book_img || "https://picsum.photos/100/150"}
                                alt={book.bookId.name}
                                className="w-20 h-28 object-cover rounded-md shadow-md"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{book.bookId.name}</h3>
                                <p className="text-default-500">Yazar İsmi: {book.bookId.author.name}</p>
                                {type === BookType.Reading && (
                                    <div className="mt-4 space-y-3">
                                        <ProgressBar
                                            value={parseFloat(book.process?.percent || "0")}
                                            total={book.process?.pageCount || book.bookId.pages_count || 0}
                                            currentValue={book.process?.readCount || 0}
                                            showChip
                                            showCompletedMessage
                                            progressColor="success"
                                            chipColor="success"
                                        />
                                        {parseFloat(book.process?.percent || "0") >= 100 && (
                                            <div className="flex items-center gap-1.5 text-tiny text-success">
                                                <CheckCircleIcon size={14} />
                                                <span className="font-medium">Kitap tamamlandı!</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {type === BookType.Read && (
                                    <div className="mt-2 text-sm text-default-400">
                                        <span>Sayfa Sayısı: {book.bookId.pages_count}</span>
                                        <span className="mx-2">•</span>
                                        <span>Yayın Yılı: {book.bookId.publication_year}</span>
                                    </div>
                                )}
                                {type === BookType.WishList && (
                                    <div className="mt-2 text-sm text-default-400">
                                        <span>Eklenme: {new Date(book.createdAt).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </InfiniteScroll>
        ) : (
            <EmptyState message={
                type === BookType.Reading ? "Henüz okumakta olduğunuz kitap bulunmamaktadır." :
                    type === BookType.Read ? "Henüz okuduğunuz kitap bulunmamaktadır." :
                        "İstek listenizde henüz kitap bulunmamaktadır."
            } />
        );
    };
    // tabi dinamikleştir
    return (
        <div className="w-full">
            <Tabs
                aria-label="Book Lists"
                color="success"
                variant="bordered"
                selectedKey={selectedTab}
                onSelectionChange={handleTabChange as any}
                classNames={{
                    tabList: "gap-6 bg-white",
                    cursor: "w-full bg-gray-100",
                    tab: "max-w-fit px-4 h-10",
                    tabContent: "group-data-[selected=true]:text-primary"
                }}
            >
                <Tab
                    key="1"
                    title={
                        <div className="flex items-center space-x-2">
                            <BookMarked className="w-4 h-4" />
                            <span>Okunuyor</span>
                        </div>
                    }
                >
                    <Card className='bg-gradient-to-b from-white to-neutral-50 dark:from-gray-900 dark:to-gray-800 shadow-lg'>
                        <CardBody id="scrollableDiv" className="overflow-auto max-h-[800px]">
                            {renderBookList(BookType.Reading)}
                        </CardBody>
                    </Card>
                </Tab>

                <Tab
                    key="0"
                    title={
                        <div className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4" />
                            <span>Okunan</span>
                        </div>
                    }
                >
                    <Card>
                        <CardBody id="scrollableDiv" className="overflow-auto max-h-[800px]">
                            {renderBookList(BookType.Read)}
                        </CardBody>
                    </Card>
                </Tab>

                <Tab
                    key="2"
                    title={
                        <div className="flex items-center space-x-2">
                            <BookPlus className="w-4 h-4" />
                            <span>İstek Listesi</span>
                        </div>
                    }
                >
                    <Card>
                        <CardBody id="scrollableDiv" className="overflow-auto max-h-[800px]">
                            {renderBookList(BookType.WishList)}
                        </CardBody>
                    </Card>
                </Tab>

                <Tab
                    key="3"
                    title={
                        <div className="flex items-center space-x-2">
                            <MessageCircle className="w-4 h-4" />
                            <span>Posts</span>
                        </div>
                    }
                >
                    <Card className='bg-transparent shadow-none p-0'>
                        <CardBody>
                            {userPost?.map((item: any) => (
                                <PostCard post={item} />
                            ))}
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    );
};

export default BookListTabs;