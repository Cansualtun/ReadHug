'use client';
import { clientBookTypeChange } from '@/app/[locale]/client/book';
import { setProfileStore } from '@/store/ProfileStore/slice';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
} from '@nextui-org/react';
import axios from 'axios';
import { BookType } from 'enums/bookType';
import {
  BookMarked,
  BookOpen,
  BookPlus,
  NotebookPen,
  Save,
  Settings2,
  SquareArrowOutUpRight,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import ProgressBar from '../../ui/progressBar';
import BookNotes from './BookNotes';
type Props = {
  type: any;
  bookLists: any;
  selectedTab: any;
  slug: string;
  isSelf: boolean;
  profileData: any;
  additionalBooks: any;
  setAdditionalBooks: any;
  serverBooks: any;
  mount: () => void;
};

const RenderBookList = ({
  type,
  bookLists,
  selectedTab,
  slug,
  isSelf,
  profileData,
  additionalBooks,
  setAdditionalBooks,
  serverBooks,
  mount,
}: Props) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const t = useTranslations('BookListTabs');
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [openBookNotes, setOpenBookNotes] = useState<any>(null);
  const [selectedKeys, setSelectedKeys] = useState(type);
  const loadMore = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
      let BASE_URL = '';
      if (process.env.NODE_ENV === 'development') {
        BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
      }
      if (process.env.NODE_ENV === 'production') {
        BASE_URL = 'https://bookarchive-production.up.railway.app';
      }

      const response = await axios.get(
        `${BASE_URL}/book/user/books/${slug}/${selectedTab}?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const newData = response.data;

      if (!newData.data || newData.data.length === 0) {
        setHasMore(false);
        return;
      }
      setPage((prev) => prev + 1);
      setAdditionalBooks((prev: any) => [...prev, ...newData.data]);
    } catch (error) {
      console.error('Error loading more books:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookLists) {
      const key = tab === '0' ? 'read' : tab === '2' ? 'wishlist' : 'reading';
      dispatch(setProfileStore({ key, data: bookLists }));
    }
  }, [bookLists]);
  const changeBookType = async (book: any) => {
    // 0-okundu, 1-okunmakta olan, 2-okumak istenilen
    const payload: any = {
      userBookId: book._id,
      type: selectedKeys,
    };

    if (selectedKeys == '1') {
      payload.readCount = 0;
    }
    await clientBookTypeChange(payload);
    await mount();
  };
  const serverFilteredData = serverBooks.filter(
    (book: any) => book.type === type,
  );
  const additionalFilteredData = selectedTab === type ? additionalBooks : [];
  const allData = [...serverFilteredData, ...additionalFilteredData];
  return allData.length > 0 ? (
    <InfiniteScroll
      dataLength={allData.length}
      next={loadMore}
      hasMore={hasMore}
      loader={loading && <h4 className="text-center py-4">{t('loading')}</h4>}
      endMessage={
        !hasMore && <p className="text-center py-4">{t('allBooksLoaded')}</p>
      }
      scrollableTarget="scrollableDiv"
      className=""
    >
      <div className="grid gap-4">
        {allData.map((book: any) => {
          return (
            <Fragment key={book._id}>
              <div className="flex items-start space-x-4 p-4 hover:bg-default-100 rounded-lg transition-colors">
                <div className="relative group">
                  <Link
                    href={`/${params.locale}/userBook/${book?.slug}`}
                    className="group-hover:block hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <SquareArrowOutUpRight className="" />
                  </Link>
                  <img
                    src={
                      book?.bookId?.images?.thumbnail ||
                      '/assets/book-placeholder.png'
                    }
                    alt={book?.bookId?.name}
                    className="w-20 h-28 object-cover rounded-md shadow-md"
                  />
                </div>
                <div className="flex-1 relative">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-md">
                      {book?.bookId?.name}
                    </h3>
                    <div className="flex gap-2 items-center">
                      <Button
                        onClick={() => {
                          if (openBookNotes?._id === book._id) {
                            setOpenBookNotes(null);
                          } else {
                            setOpenBookNotes(book);
                          }
                        }}
                        className={`max-w-8 max-h-8 h-8 w-8 min-w-8 min-h-8 p-0 ${openBookNotes?._id === book._id ? 'bg-primary text-white' : 'bg-default-50'}`}
                        size="sm"
                      >
                        <NotebookPen size={16} />
                      </Button>
                      <div>
                        <Popover
                          classNames={{
                            content: 'p-1',
                          }}
                          placement="bottom-end"
                          showArrow
                          offset={5}
                        >
                          <PopoverTrigger>
                            <Button
                              className={`max-w-8 max-h-8 h-8 w-8 min-w-8 min-h-8 p-0 ${openBookNotes?._id === book._id ? 'bg-primary text-white' : 'bg-default-50'}`}
                              size="sm"
                            >
                              <Settings2 size={16} />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="w-[300px] flex items-center gap-2">
                              <Select
                                className="max-w-xs"
                                label="Select Library"
                                defaultSelectedKeys={selectedKeys}
                                value={[selectedKeys]}
                                size="sm"
                                onChange={(e) => {
                                  setSelectedKeys(e.target.value);
                                }}
                              >
                                <SelectItem
                                  key={'1'}
                                  startContent={<BookOpen size={14} />}
                                >
                                  Okunuyor
                                </SelectItem>
                                <SelectItem
                                  key={'0'}
                                  startContent={<BookMarked size={14} />}
                                >
                                  Okunan
                                </SelectItem>
                                <SelectItem
                                  key={'2'}
                                  startContent={<BookPlus size={14} />}
                                >
                                  İstek Listesi
                                </SelectItem>
                              </Select>
                              <Button
                                onClick={() => changeBookType(book)}
                                className="bg-primary text-white disabled:bg-default-500 w-12 h-12 min-w-12 min-h-12 max-w-12 max-h-12 p-1"
                                disabled={type === selectedKeys}
                              >
                                <Save size={16} />
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>

                  <p className="text-default-500 text-sm">
                    {t('bookInfo.author', {
                      name: book.bookId?.authors
                        .map((i: any) => i.name)
                        .join(' & '),
                    })}
                  </p>
                  {type === BookType.Reading && (
                    <div className="mt-4 space-y-3 text-default-400">
                      <ProgressBar
                        value={parseFloat(book.process?.percent) || 0}
                        total={book.process?.pageCount || 0}
                        currentValue={book.process?.readCount || 0}
                        showChip
                        bookId={book._id}
                        showCompletedMessage
                        progressColor="success"
                        chipColor="success"
                        isSelf={isSelf}
                      />
                    </div>
                  )}
                  {type === BookType.Read && (
                    <div className="mt-2 text-sm text-default-400">
                      <span>
                        {t('bookInfo.pageCount', {
                          count: book?.bookId?.pageCount,
                        })}
                      </span>
                      <span className="mx-2">•</span>
                      <span>
                        {t('bookInfo.publicationYear', {
                          year: book?.bookId?.publishedDate,
                        })}
                      </span>
                    </div>
                  )}
                  {type === BookType.WishList && (
                    <div className="mt-2 text-sm text-default-400">
                      <span>
                        {t('bookInfo.addedDate', {
                          date: new Date(book.createdAt).toLocaleDateString(),
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {openBookNotes?._id === book._id && (
                <BookNotes
                  openBookNotes={openBookNotes}
                  book={book}
                  profileData={profileData}
                />
              )}
            </Fragment>
          );
        })}
        {!loading && hasMore && allData.length >= 10 && (
          <button onClick={loadMore}>Daha fazla</button>
        )}
      </div>
    </InfiniteScroll>
  ) : (
    <EmptyState
      message={t(
        `emptyStates.${
          type === BookType.Reading
            ? 'reading'
            : type === BookType.Read
              ? 'read'
              : 'wishlist'
        }`,
      )}
    />
  );
};

export default RenderBookList;

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <p className="text-default-500 text-lg">{message}</p>
  </div>
);
