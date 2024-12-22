'use client';
import { Card, CardBody, Progress, Button, Tabs, Tab } from '@nextui-org/react';
import {
  BookOpen,
  Heart,
  NotebookPen,
  Share2,
  Notebook,
  MessageCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import BookNotes from '../../profile/BookListTab/BookNotes';
import { getClientBookPosts } from '@/app/[locale]/client/post';
import PostCard from '../../home/postCard';
interface UserBookDetailCardProps {
  book: any;
  profileData: any;
}

export default function UserBookDetailCard({
  book,
  profileData,
}: UserBookDetailCardProps) {
  const [selectedTab, setSelectedTab] = useState('1');
  const [posts, setPosts] = useState<any>([]);

  const handleTabChange = (key: Selection | string) => {
    setSelectedTab(key as any);
  };
  const getBookPosts = async () => {
    const { data } = await getClientBookPosts(book._id);
    setPosts(data);
  };

  useEffect(() => {
    if (selectedTab === '2') {
      getBookPosts();
    }
  }, [selectedTab]);
  return (
    <Card className="bg-gradient-to-r from-default-100 to-default-200 shadow-xl">
      <CardBody className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-3 space-y-6">
            <div className="flex justify-start">
              <div className="relative">
                <Image
                  src={
                    book?.bookId?.images?.thumbnail ||
                    book?.bookId?.images?.smallThumbnail ||
                    '/assets/book-placeholder.png'
                  }
                  alt={book.bookId?.name}
                  width={120}
                  height={200}
                  className="rounded-xl shadow-lg"
                  objectFit="cover"
                />
                <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-2">
                  <Button
                    isIconOnly
                    variant="flat"
                    size="sm"
                    className="bg-default-50/70 backdrop-blur-md"
                  >
                    <Heart
                      className={`w-3 h-3 ${book.isFavorite ? 'fill-red-500 text-red-500' : 'text-primary'}`}
                    />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    className="bg-default-50/70 backdrop-blur-md"
                  >
                    <Share2 className="w-3 h-3 text-primary" />
                  </Button>
                </div>
              </div>

              <div className="ml-4">
                <h1 className="text-3xl font-bold mb-2">{book.bookId?.name}</h1>
                <div className="flex flex-col items-start justify-start gap-4 mb-6">
                  <p className="text-xl text-default-700">
                    {book?.bookId?.authors.map((i: any) => i.name).join(' & ')}
                  </p>
                  <p className="text-default-700">
                    {book?.bookId?.publishers
                      .map((i: any) => i.name)
                      .join(' & ')}
                  </p>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-r from-default-100 to-default-200 border-none">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-orange-600" />
                    <h3 className="text-lg font-semibold">Okuma İlerlemen</h3>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">
                    {book.process.percent}%
                  </p>
                </div>
                <Progress
                  value={parseFloat(book.process.percent)}
                  className="mb-3"
                  classNames={{
                    indicator: 'bg-gradient-to-r from-primary to-amber-500',
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
                  <span className="font-semibold">Yayın Yılı:</span>{' '}
                  {book?.bookId?.publishedDate}
                </p>
                <p className="text-default-700">
                  <span className="font-semibold">ISBN:</span>{' '}
                  {book?.bookId?.ISBNS[0]?.identifier ?? ''}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-default-700">
                  <span className="font-semibold">Sayfa Sayısı:</span>{' '}
                  {book?.process?.pageCount}
                </p>
                <p className="text-default-700">
                  <span className="font-semibold">Ekleme Tarihi:</span>{' '}
                  {new Date(book.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>

            <div>
              <Tabs
                aria-label="User Book"
                variant="bordered"
                selectedKey={selectedTab}
                onSelectionChange={handleTabChange as any}
              >
                <Tab
                  key="1"
                  title={
                    <div className="flex items-center space-x-2">
                      <NotebookPen
                        className={`w-4 h-4 ${selectedTab === '1' && 'text-primary'}`}
                      />
                      <span
                        className={` ${selectedTab === '1' && 'text-primary'}`}
                      >
                        Notlar
                      </span>
                    </div>
                  }
                >
                  <div>
                    <BookNotes
                      openBookNotes={book}
                      book={book}
                      profileData={profileData}
                    />
                  </div>
                </Tab>
                <Tab
                  key="2"
                  title={
                    <div className="flex items-center space-x-2">
                      <MessageCircle
                        className={`w-4 h-4 ${selectedTab === '2' && 'text-primary'}`}
                      />
                      <span
                        className={` ${selectedTab === '2' && 'text-primary'}`}
                      >
                        Paylaşımlar
                      </span>
                    </div>
                  }
                >
                  <div>
                    {posts.map((item: any) => {
                      return (
                        <PostCard
                          post={item}
                          isOpenComment={true}
                          isProfileCard={false}
                        />
                      );
                    })}
                  </div>
                </Tab>
                <Tab
                  key="3"
                  title={
                    <div className="flex items-center space-x-2">
                      <Notebook
                        className={`w-4 h-4 ${selectedTab === '3' && 'text-primary'}`}
                      />
                      <span
                        className={` ${selectedTab === '3' && 'text-primary'}`}
                      >
                        Kitap Hakkında
                      </span>
                    </div>
                  }
                >
                  <p className="text-default-900 leading-relaxed">
                    {book?.bookId?.description}
                  </p>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
