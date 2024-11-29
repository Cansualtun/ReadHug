'use client';
import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button } from '@nextui-org/react';
import { Book, BookOpen, BookPlus, CheckCircle, Library } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ProgressBar from '../../ui/progressBar';
import { BookType } from 'enums/bookType';
import { Books } from '@/types/book';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/UserStore/slice';
import NonLoginSidebar from './NonLoginSidebar';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface BookProps {
  books: Books[];
}

export default function ReadingTracker({ books }: BookProps) {
  const t = useTranslations('ReadingTracker');
  const me = useSelector(selectUser);
  const params = useParams();
  const currentBook = books
    .filter((book) => book.type === BookType.Reading.toString())
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];
  const [progress, setProgress] = useState(
    currentBook ? parseInt(currentBook.process.percent) : 0,
  );
  const [openList, setOpenList] = useState<string>('');
  const shelves = [
    {
      icon: BookOpen,
      label: t('library.shelves.reading'),
      count: books.filter((book) => book.type === BookType.Reading.toString())
        .length,
      list: books.filter((book) => book.type === BookType.Reading.toString()),
      key: 'reading',
      tab: '1',
    },
    {
      icon: Book,
      label: t('library.shelves.completed'),
      count: books.filter((book) => book.type === BookType.Read.toString())
        .length,
      list: books.filter((book) => book.type === BookType.Read.toString()),
      key: 'read',
      tab: '0',
    },
    {
      icon: BookPlus,
      label: t('library.shelves.toRead'),
      count: books.filter((book) => book.type === BookType.WishList.toString())
        .length,
      list: books.filter((book) => book.type === BookType.WishList.toString()),
      key: 'wishlist',
      tab: '2',
    },
  ];

  if (!currentBook && me) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-4 p-4 pb-0 sticky top-[55px]">
        <Card className="bg-default-100">
          <CardBody className="p-6">
            <p className="text-center text-default-500">
              {t('currentlyReading.noBook')}
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return me ? (
    <div className="w-full max-w-2xl mx-auto space-y-4 p-4 pb-0 sticky top-[55px]">
      <Card className="bg-default-100">
        <CardHeader className="border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {t('currentlyReading.title')}
          </h2>
        </CardHeader>
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative group w-[120px] h-[160px]">
              <Image
                src={currentBook.bookId.images.thumbnail}
                alt={`${currentBook.bookId.name} book cover`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg transition-all duration-200"
              />
              <div className="absolute px-2 inset-0 bg-default-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                <Link
                  href={`/${params.locale}/personalBooks/${currentBook.bookId.slug}`}
                  className="text-sm bg-default-50/80 text-center rounded-lg px-2 py-1"
                >
                  {t('currentlyReading.viewDetails')}
                </Link>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {currentBook.bookId.name}
                </h3>
                <p className="text-default-500">
                  {t('currentlyReading.by')}{' '}
                  {currentBook.bookId.authors
                    .map((author: any) => author.name)
                    .join(', ')}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <ProgressBar
              value={progress}
              total={currentBook.process.pageCount}
              currentValue={currentBook.process.readCount}
              showChip
              showCompletedMessage
              progressColor="warning"
              labelPosition="bottom"
              showPage={false}
              bookId={currentBook._id as string}
            />
          </div>
        </CardBody>
      </Card>

      <Card className="bg-default-100">
        <CardHeader className="border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Library className="h-5 w-5" />
            {t('library.title')}
          </h2>
        </CardHeader>
        <CardBody className="p-4">
          <div className="">
            {shelves.map((item) => (
              <div
                key={item.key}
                className="flex flex-col items-start justify-between p-3 py-1 rounded-lg hover:bg-default-100 transition-colors cursor-pointer"
              >
                <div className="w-full flex items-start justify-between rounded-lg hover:bg-default-100 transition-colors cursor-pointer">
                  <div
                    className="flex items-center gap-2"
                    onClick={() => {
                      if (item.key === openList) {
                        setOpenList('');
                      } else {
                        setOpenList(item.key);
                      }
                    }}
                  >
                    <item.icon
                      className={`h-4 w-4 ${item.key == openList ? 'text-primary' : 'text-default-500'}`}
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.list.length > 0 ? (
                    <Link
                      href={`/${params.locale}/profile/${me.userName}?tab=${item.tab}`}
                      className={`p-2 min-w-11 flex justify-center items-center rounded-t-md hover:text-primary ${item.key === openList && 'bg-default-200/20 text-primary'}`}
                    >
                      {item.count}
                    </Link>
                  ) : (
                    <div
                      className={`p-2 min-w-11 flex justify-center items-center rounded-t-md ${item.key === openList && 'bg-default-200/20 text-primary'}`}
                    >
                      {item.count}
                    </div>
                  )}
                </div>

                <div
                  className={`p-4 bg-default-200/20 border-l-3 border-l-primary ${item.key === openList ? 'animate-appearance-in block' : 'hidden animate-appearance-in delay-1000'}`}
                >
                  <div className="marker:text-primary list-outside list-disc ml-2 text-sm space-y-2">
                    {item.list.slice(0, 5).map((i, index) => {
                      return (
                        <div key={i._id} className="flex items-center gap-2">
                          <div>
                            <Image
                              src={i.bookId.images.smallThumbnail}
                              width={28}
                              height={36}
                              className="min-w-7 min-h-9"
                              alt={i.bookName}
                            />
                          </div>
                          <p key={index}>{i.bookName}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  ) : (
    <div className="w-full max-w-2xl mx-auto space-y-4 p-4 pb-0 sticky top-[55px]">
      <NonLoginSidebar />
    </div>
  );
}
