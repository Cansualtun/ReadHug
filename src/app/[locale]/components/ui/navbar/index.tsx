'use client';
import { useLogoutMutation } from '@/store/AuthStore';
import { useNotificationMutation } from '@/store/NotificationStore';
import { selectNotification } from '@/store/NotificationStore/slice';
import { useMeMutation } from '@/store/UserStore';
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Navbar,
  NavbarContent,
  NavbarItem,
  Switch,
} from '@nextui-org/react';
import {
  Bell,
  LogIn,
  LogOut,
  Megaphone,
  MessageCircleMore,
  MessageSquareText,
  Milestone,
  Moon,
  Settings,
  Sun,
  ThumbsUp,
  User,
  UserCheck,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import LanguageDropdown from '../languageDropdown';
import { SearchIcon } from '../svg/SearchIcon.jsx';
import { setNotification } from '@/store/NotificationStore/slice';
import { NotificationState } from '@/store/MessageStore/type';
import Loading from '../loading';
import { getClientCookie } from '@/utils/getClientCookie';

const locales = ['tr', 'en'];

const { useRouter: useRouterIntl, usePathname: usePathnameIntl } =
  createSharedPathnamesNavigation({
    locales,
  });

export default function Header() {
  const t = useTranslations('header');
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [logout] = useLogoutMutation();
  const [me] = useMeMutation();
  const [userData, setUserData] = useState({
    userName: null,
    email: null,
    image: null,
  });
  const router = useRouter();
  const routerIntl = useRouterIntl();
  const pathname = usePathnameIntl();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [notificationData, setNotificationData] = useState<any>({
    data: [],
  });
  const [notification] = useNotificationMutation();
  const changeLanguage = (newLocale: string) => {
    routerIntl.push(pathname, { locale: newLocale });
  };
  const selectNotifications: NotificationState =
    useSelector(selectNotification);

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2);

  const getNotifications = async () => {
    try {
      await notification(1 as any);
    } catch (error) {}
  };
  const loadMore = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const token = getClientCookie();
      const BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

      const response = await fetch(
        `${BASE_URL}/notification/all?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const newData = await response.json();
      const combineData = {
        ...notificationData,
        data: [...notificationData?.data, ...newData.data],
      };
      setNotificationData(combineData);
      setPage((prev) => prev + 1);
      setHasMore(false);
    } catch (error) {
      console.error('Error loading more books:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const readAllNotifications = async () => {
    console.log('read notifications');
  };

  const fetchMe = async () => {
    try {
      const { data } = await me();
      setUserData({
        userName: data?.data?.userName as any,
        email: data?.data?.email as any,
        image: data?.data?.image as any,
      });
      document.cookie = `userName=${data?.data.userName}; path=/; max-age=${60 * 60 * 24 * 7}`;
      if (data && data.status) {
        getNotifications();
      }
    } catch (error) {
      console.error(t('errors.userDataFetch'), error);
    }
  };
  useEffect(() => {
    fetchMe();
  }, [me, t]);

  useEffect(() => {
    setNotificationData(selectNotifications);
  }, [selectNotifications]);

  const logouts = async () => {
    await logout();
    router.push('/login');
  };

  const goToProfile = () => {
    if (userData.userName) {
      router.push(`/profile/${userData.userName}`);
    }
  };
  // console.log('selectNotifications', selectNotifications);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenNotification(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Navbar isBordered maxWidth="xl">
      <div className="container mx-auto flex justify-between items-center">
        <NavbarContent>
          <Link href="/">
            <div className="flex justify-center items-center">
              <Image
                src={'/assets/logo1.svg'}
                width={240}
                height={60}
                alt=""
                className="w-[180px] h-[32px]"
              />
            </div>
          </Link>
          <NavbarContent className="hidden md:flex gap-3">
            <NavbarItem>
              <Link
                color="foreground"
                href="/authors"
                className="text-default-500"
              >
                {t('navigation.authors')}
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link
                href="/community"
                aria-current="page"
                color="foreground"
                className="text-default-500"
              >
                {t('navigation.community')}
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link
                color="foreground"
                href="/stats"
                className="text-default-500"
              >
                {t('navigation.stats')}
              </Link>
            </NavbarItem>
          </NavbarContent>
        </NavbarContent>
        <NavbarContent as="div" className="items-center" justify="end">
          <Input
            classNames={{
              base: 'max-w-full sm:max-w-[18rem] h-10',
              mainWrapper: 'h-full',
              input: 'text-small',
              inputWrapper:
                'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
            }}
            placeholder={t('search.placeholder')}
            size="sm"
            startContent={<SearchIcon size={12} width={12} height={12} />}
            type="search"
            className="hidden lg:block"
          />
          {userData.userName && (
            <div className="relative" ref={dropdownRef}>
              <div
                className="relative cursor-pointer select-none"
                onClick={() => setOpenNotification(!openNotification)}
              >
                <Bell />
                {selectNotifications?.data?.filter((i: any) => !i.isRead)
                  .length > 0 && (
                  <span className="absolute border-1 border-default-50 -top-1 -right-1 min-w-[16px] min-h-[16px] rounded-full bg-primary text-[8px] text-white flex justify-center items-center p-0 m-0">
                    {selectNotifications?.data?.filter((i: any) => !i.isRead)
                      .length > 9
                      ? '9+'
                      : selectNotifications?.data?.filter((i: any) => !i.isRead)
                          .length}
                  </span>
                )}
              </div>

              <div
                className={`absolute top-10 right-0 ${openNotification ? 'block  animate-fadeindown' : 'hidden'}`}
              >
                <div className="max-h-[300px] w-[300px] overflow-y-auto scroll-container p-4 bg-default-50 rounded-lg shadow">
                  {notificationData?.data?.length > 0 && (
                    <InfiniteScroll
                      dataLength={notificationData?.data?.length}
                      next={loadMore}
                      hasMore={hasMore}
                      className='mb-10'
                      loader={
                        <div className="w-full flex justify-center items-center">
                          <Loading className="pb-2" width={120} height={40} />
                        </div>
                      }
                      endMessage={
                        <p className="text-center py-4">
                          Tüm Bildirimler Yüklendi.
                        </p>
                      }
                    >
                      {notificationData?.data?.map((item: any) => (
                        <div
                          key={item._id}
                          className="flex items-start space-x-4 p-4 hover:bg-default-100 rounded-lg transition-colors"
                        >
                          {item.type === 'like' && <ThumbsUp />}
                          {item.type === 'comment' && <MessageSquareText />}
                          {item.type === 'follow' && <UserCheck />}
                          {item.type === 'announcement' && <Megaphone />}
                          {item.type === 'message' && <MessageCircleMore />}
                          <p className="ml-2 text-sm">{item.content}</p>
                        </div>
                      ))}
                    </InfiniteScroll>
                  )}
                  {/* {hasMore && (
                    <div className="w-full flex justify-center items-center">
                      <Button size="sm" onClick={loadMore}>
                        Daha Fazla
                      </Button>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          )}

          <LanguageDropdown
            currentLocale={locale}
            onChangeLanguage={changeLanguage}
          />
          <Switch
            defaultSelected
            size="sm"
            color="default"
            isSelected={theme === 'dark'}
            onValueChange={(isSelected) =>
              setTheme(isSelected ? 'dark' : 'light')
            }
            startContent={<Sun className="w-3.5 h-3.5 text-warning-400" />}
            endContent={<Moon className="w-3.5 h-3.5 text-default-500" />}
            className="ml-2"
            aria-label="Toggle theme"
          />
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform ring-primary/80 min-h-8 min-w-8"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src={userData?.image ?? '/assets/avatar.png'}
              />
            </DropdownTrigger>
            {userData.userName ? (
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  onClick={goToProfile}
                  startContent={<User className="w-4 h-4" />}
                >
                  {t('profile.profile')}
                </DropdownItem>
                <DropdownItem
                  key="/settings"
                  href="/settings"
                  startContent={<Settings className="w-4 h-4" />}
                >
                  {t('profile.settings')}
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  href="/login"
                  onClick={() => logouts()}
                  startContent={<LogOut className="w-4 h-4" />}
                >
                  {t('profile.logout')}
                </DropdownItem>
              </DropdownMenu>
            ) : (
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="login"
                  href="/login"
                  startContent={<LogIn className="w-4 h-4" />}
                >
                  {t('profile.login')}
                </DropdownItem>
                <DropdownItem
                  key="/register"
                  href="/register"
                  startContent={<Milestone className="w-4 h-4" />}
                >
                  {t('profile.register')}
                </DropdownItem>
              </DropdownMenu>
            )}
          </Dropdown>
        </NavbarContent>
      </div>
    </Navbar>
  );
}
