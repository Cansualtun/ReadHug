'use client';
import { getAllBookLists } from '@/app/[locale]/client/book';
import { selectUser } from '@/store/UserStore/slice';
import { Card, CardBody, Selection, Tab, Tabs } from '@nextui-org/react';
import { BookType } from 'enums/bookType';
import {
  BookMarked,
  BookOpen,
  BookPlus,
  MessageCircle,
  PlusCircle,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BookSearchModal from '../../ui/modal/BookSearchModal';
import BookPostComponent from '../../ui/widget/BookPostComponent';
import RenderBookList from './RenderBookList';
import RenderPostList from './RenderPostList';
import { UserPostInfoClient } from '@/app/[locale]/client/post';

const BookListTabs = ({ bookLists, slug, post, profileData }: any) => {
  const userData = useSelector(selectUser);
  const t = useTranslations('BookListTabs');
  const [profile, setProfile] = useState(profileData);
  const [serverBooks, setServerBooks] = useState(bookLists.data || []);
  const [additionalBooks, setAdditionalBooks] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState('1');
  const [openBookModal, setOpenBookModal] = useState(false);
  const { isSelf, isLoggedIn } = profile;
  console.log('isLoggedIn', isLoggedIn);

  const [postData, setPostData] = useState(post);

  const handleTabChange = (key: Selection | string) => {
    if (key == 'post') {
      setOpenBookModal(true);
      return;
    }
    setSelectedTab(key as any);
    setAdditionalBooks([]);
  };

  const getLibraryData = async () => {
    const data = await getAllBookLists(slug);
    setServerBooks(data.data);
  };
  const handlePostMount = async () => {
    const { data } = await UserPostInfoClient(slug);
    setPostData({ ...postData, data });
  };

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    }
    if (post) {
      setPostData(post);
    }
  }, [profileData, post]);

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
              <RenderBookList
                mount={getLibraryData}
                serverBooks={serverBooks}
                setAdditionalBooks={setAdditionalBooks}
                additionalBooks={additionalBooks}
                type={BookType.Reading}
                bookLists={bookLists}
                selectedTab={selectedTab}
                slug={slug}
                isSelf={isSelf}
                isLoggedIn={isLoggedIn}
                profileData={profileData}
              />
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
              <RenderBookList
                mount={getLibraryData}
                serverBooks={serverBooks}
                setAdditionalBooks={setAdditionalBooks}
                additionalBooks={additionalBooks}
                type={BookType.Read}
                bookLists={bookLists}
                selectedTab={selectedTab}
                slug={slug}
                isSelf={isSelf}
                isLoggedIn={isLoggedIn}
                profileData={profileData}
              />
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
              <RenderBookList
                mount={getLibraryData}
                serverBooks={serverBooks}
                setAdditionalBooks={setAdditionalBooks}
                additionalBooks={additionalBooks}
                type={BookType.WishList}
                bookLists={bookLists}
                selectedTab={selectedTab}
                slug={slug}
                isSelf={isSelf}
                isLoggedIn={isLoggedIn}
                profileData={profileData}
              />
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
              <BookPostComponent userData={userData} mount={handlePostMount} />
            </div>
          )}

          <Card shadow="none" className="bg-transparent shadow-none w-full p-0">
            <CardBody className="p-0">
              <RenderPostList
                slug={slug}
                post={postData}
                profileData={profileData}
                handlePostMount={handlePostMount}
              />
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
            <></>
          </Tab>
        )}
      </Tabs>
      <BookSearchModal
        isOpen={openBookModal}
        onClose={() => setOpenBookModal(!openBookModal)}
        mount={getLibraryData}
      />
    </div>
  );
};

export default BookListTabs;
