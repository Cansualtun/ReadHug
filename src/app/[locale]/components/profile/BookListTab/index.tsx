'use client';
import { selectUser } from '@/store/UserStore/slice';
import {
  Card,
  CardBody,
  Selection,
  Slider,
  Tab,
  Tabs,
} from '@nextui-org/react';
import { BookType } from 'enums/bookType';
import {
  BookMarked,
  BookOpen,
  BookPlus,
  CheckCircleIcon,
  MessageCircle,
  PlusCircle,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import PostCard from '../../home/postCard';
import BookSearchModal from '../../ui/modal/BookSearchModal';
import ProgressBar from '../../ui/progressBar';
import BookPostComponent from '../../ui/widget/BookPostComponent';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

const BookListTabs = ({ bookLists, slug, post, profileData }: any) => {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  console.log('bookLists', bookLists);

  const t = useTranslations('BookListTabs');
  const [serverBooks] = useState(bookLists.data || []);
  const [userPost, setUserPost] = useState([]);
  const [additionalBooks, setAdditionalBooks] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(2);
  const [selectedTab, setSelectedTab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [openBookModal, setOpenBookModal] = useState(false);
  const userData = useSelector(selectUser);

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <p className="text-default-500 text-lg">{message}</p>
    </div>
  );

  useEffect(() => {
    setUserPost(post.data);
    if (tab) {
      setSelectedTab(tab);
    }
  }, [post]);

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
        BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
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
      setAdditionalBooks((prev) => [...prev, ...newData.data]);
    } catch (error) {
      console.error('Error loading more books:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };
  const handleTabChange = (key: Selection | string) => {
    const selectedKey = Array.from(key)[0] as string;
    if (key == 'post') {
      setOpenBookModal(true);
      return;
    }
    setSelectedTab(key as any);
    setAdditionalBooks([]);
    setPage(2);
    setHasMore(true);
  };

  const renderBookList = (type: BookType) => {
    const serverFilteredData = serverBooks.filter(
      (book: any) => book.type === type,
    );
    const additionalFilteredData = selectedTab === type ? additionalBooks : [];
    const allData = [...serverFilteredData, ...additionalFilteredData];

    return allData.length > 0 ? (
      <InfiniteScroll
        dataLength={allData.length}
        next={() => {}}
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
              <div
                key={book._id}
                className="flex items-start space-x-4 p-4 hover:bg-default-100 rounded-lg transition-colors"
              >
                <img
                  src={
                    book?.bookId?.images?.thumbnail ||
                    '/assets/book-placeholder.png'
                  }
                  alt={book?.bookId?.name}
                  className="w-20 h-28 object-cover rounded-md shadow-md"
                />
                <div className="flex-1 relative">
                  <h3 className="font-semibold text-md">
                    {book?.bookId?.name}
                  </h3>
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
                      />

                      {/* {parseFloat(book.process?.percent || "0") >= 100 && (
                                            <div className="flex items-center gap-1.5 text-tiny text-success">
                                                <CheckCircleIcon size={14} />
                                                <span className="font-medium">{t('bookInfo.bookCompleted')}</span>
                                            </div>
                                        )} */}
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
            );
          })}
          {!loading && hasMore && (
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

  return (
    <div className="w-full">
      <Tabs
        aria-label="Book Lists"
        color="success"
        variant="bordered"
        selectedKey={selectedTab}
        onSelectionChange={handleTabChange as any}
        classNames={{
          base: 'bg-default-50 w-full',
          tabList: 'gap-6 bg-default-50 w-full flex justify-evenly',
          cursor: 'w-full bg-default-200',
          tab: 'max-w-fit px-4 h-10',
          tabContent: 'group-data-[selected=true]:text-primary',
        }}
      >
        <Tab
          key="1"
          title={
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-success" />
              <span className="lg:block hidden">{t('tabs.reading')}</span>
            </div>
          }
        >
          <Card>
            <CardBody
              id="scrollableDiv"
              className="overflow-auto scroll-container"
            >
              {renderBookList(BookType.Reading)}
            </CardBody>
          </Card>
        </Tab>
        <Tab
          key="0"
          title={
            <div className="flex items-center space-x-2">
              <BookMarked className="w-4 h-4 text-warning" />
              <span className="lg:block hidden">{t('tabs.read')}</span>
            </div>
          }
        >
          <Card>
            <CardBody
              id="scrollableDiv"
              className="overflow-auto scroll-container"
            >
              {renderBookList(BookType.Read)}
            </CardBody>
          </Card>
        </Tab>
        <Tab
          key="2"
          title={
            <div className="flex items-center space-x-2">
              <BookPlus className="w-4 h-4 text-secondary" />
              <span className="lg:block hidden">{t('tabs.wishlist')}</span>
            </div>
          }
        >
          <Card>
            <CardBody
              id="scrollableDiv"
              className="overflow-auto scroll-container"
            >
              {renderBookList(BookType.WishList)}
            </CardBody>
          </Card>
        </Tab>
        <Tab
          key="3"
          className="w-full"
          title={
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-info" />
              <span className="lg:block hidden">{t('tabs.posts')}</span>
            </div>
          }
        >
          {userData && profileData.user._id === userData._id && (
            <div className="sticky top-[70px] z-50 w-full my-2 p-0">
              <BookPostComponent userData={userData} />
            </div>
          )}

          <Card shadow="none" className="bg-transparent shadow-none w-full p-0">
            <CardBody className="p-0">
              {userPost?.map((item: any) => (
                <PostCard key={item.id} post={item} />
              ))}
            </CardBody>
          </Card>
        </Tab>
        {userData && profileData.user._id === userData._id && (
          <Tab
            key="post"
            className="bg-primary"
            aria-label="Added Book"
            title={
              <div className="flex items-center space-x-2">
                <PlusCircle className="w-4 h-4 text-white" />
              </div>
            }
          >
            <Card
              shadow="none"
              className="bg-transparent shadow-none w-full p-0"
            >
              <CardBody className="p-0">asd</CardBody>
            </Card>
          </Tab>
        )}
      </Tabs>
      <BookSearchModal
        isOpen={openBookModal}
        onClose={() => setOpenBookModal(!openBookModal)}
      />
    </div>
  );
};

export default BookListTabs;
