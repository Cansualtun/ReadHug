'use client';
import { selectUser } from '@/store/UserStore/slice';
import {
  Button,
  Card,
  CardBody,
  Selection,
  Tab,
  Tabs,
} from '@nextui-org/react';
import axios from 'axios';
import { BookType } from 'enums/bookType';
import {
  BookMarked,
  BookOpen,
  BookPlus,
  MessageCircle,
  NotebookPen,
  PlusCircle,
  SquareArrowOutUpRight,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import PostCard from '../../home/postCard';
import Loading from '../../ui/loading';
import BookSearchModal from '../../ui/modal/BookSearchModal';
import ProgressBar from '../../ui/progressBar';
import BookPostComponent from '../../ui/widget/BookPostComponent';
import BookNotes from './BookNotes';
import Link from 'next/link';

const BookListTabs = ({ bookLists, slug, post, profileData }: any) => {
  const searchParams = useSearchParams();
  const params = useParams();
  const userData = useSelector(selectUser);
  const tab = searchParams.get('tab');
  const t = useTranslations('BookListTabs');
  const [profile, setProfile] = useState(profileData);
  const [serverBooks] = useState(bookLists.data || []);
  const [userPost, setUserPost] = useState<any[]>([]);
  const [additionalBooks, setAdditionalBooks] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(2);
  const [selectedTab, setSelectedTab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [openBookModal, setOpenBookModal] = useState(false);
  const [postPage, setPostPage] = useState(2);
  const [postLoading, setPostLoading] = useState(false);
  const [postHasMore, setPostHasMore] = useState(true);
  const [openBookNotes, setOpenBookNotes] = useState<any>(null);

  const { isSelf } = profile;

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <p className="text-default-500 text-lg">{message}</p>
    </div>
  );

  useEffect(() => {
    if (post?.data) {
      setUserPost([]);
      setPostPage(1);
      setPostHasMore(true);
      loadMorePosts();
    }
    if (tab) {
      setSelectedTab(tab);
    }
  }, [post]);

  const loadMorePosts = async () => {
    if (postLoading || !postHasMore) return;

    try {
      setPostLoading(true);
      const startIndex = (postPage - 1) * 4;
      const endIndex = startIndex + 4;
      const newPosts = post.data.slice(startIndex, endIndex);
      if (newPosts.length === 0) {
        setPostHasMore(false);
        return;
      }
      setUserPost((prevPosts) => [...prevPosts, ...newPosts]);
      setPostPage((prev) => prev + 1);
      setPostHasMore(endIndex < post.data.length);
    } catch (error) {
      console.error('Error loading more posts:', error);
      setPostHasMore(false);
    } finally {
      setPostLoading(false);
    }
  };

  useEffect(() => {
    setProfile(profileData);
  }, [profileData]);

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
              <InfiniteScroll
                dataLength={post?.length || 0}
                next={loadMore}
                hasMore={hasMore}
                loader={
                  <div className="w-full flex justify-center my-4 scale-50">
                    <Loading />
                  </div>
                }
                endMessage={
                  <div className="w-full text-center mt-8 p-4 bg-default-100 rounded-lg border shadow text-default-700">
                    Tüm paylaşımlar yüklendi
                  </div>
                }
                className="space-y-4"
              >
                <div>
                  {userPost.map((item: any) => (
                    <PostCard key={item._id} post={item} />
                  ))}
                </div>
              </InfiniteScroll>
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
