'use client';
import { useEffect, useState } from 'react';
import {
  Navbar,
  NavbarContent,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarItem,
  Switch,
} from '@nextui-org/react';
import { AcmeLogo } from '../svg/AcmeLogo';
import { SearchIcon } from '../svg/SearchIcon.jsx';
import { useRouter } from 'next/navigation';
import {
  User,
  Settings,
  LogOut,
  Bell,
  ThumbsUp,
  MessageSquareText,
  UserCheck,
  Megaphone,
  MessageCircleMore,
  Monitor,
  Sun,
  Moon,
} from 'lucide-react';
import axios from 'axios';
import { useMeMutation } from '@/store/UserStore';
import { useLogoutMutation } from '@/store/AuthStore';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import Link from 'next/link';
import LanguageDropdown from '../languageDropdown';
import { useTheme } from 'next-themes';
import Image from 'next/image';


const locales = ['tr', 'en'];

const { useRouter: useRouterIntl, usePathname: usePathnameIntl } = createSharedPathnamesNavigation({
  locales,
});

export default function Header() {
  const t = useTranslations('header');
  const [logout] = useLogoutMutation();
  const [me] = useMeMutation();
  const [userData, setUserData] = useState({
    userName: null,
    email: null,
    image: null,
  });
  const [notificatonData, setNotificationData] = useState([]);
  const router = useRouter();
  const routerIntl = useRouterIntl();
  const pathname = usePathnameIntl();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const changeLanguage = (newLocale: string) => {
    routerIntl.push(pathname, { locale: newLocale });
  };

  const getNotificatons = async () => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];
    try {
      const { data } = await axios(
        'http://localhost:4000/notification/all?page=1&limit=10',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setNotificationData(data.data);
    } catch (error) { }
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await me();
        setUserData({
          userName: data?.data?.userName as any,
          email: data?.data?.email as any,
          image: data?.data?.image as any,
        });
      } catch (error) {
        console.error(t('errors.userDataFetch'), error);
      }
    };
    getNotificatons();
    fetchMe();
  }, [me, t]);

  const logouts = async () => {
    await logout();
    router.push('/login');
  };

  const goToProfile = () => {
    if (userData.userName) {
      router.push(`/profile/${userData.userName}`);
    }
  };

  return (
    <Navbar isBordered maxWidth="xl">
      <div className='container mx-auto flex justify-between items-center'>
        <NavbarContent>
          <Link href="/">
            <div className="flex justify-center items-center">
              <Image src={"/assets/logo1.svg"} width={240} height={60} alt='' className='w-[180px] h-[32px]' />
            </div>
          </Link>
          <NavbarContent className="hidden md:flex gap-3">
            <NavbarItem>
              <Link color="foreground" href="/authors" className='text-default-500'>
                {t('navigation.authors')}
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/community" aria-current="page" color="foreground" className='text-default-500'>
                {t('navigation.community')}
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="/stats" className='text-default-500'>
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
            className='hidden lg:block'
          />
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <div className="relative">
                <Bell />
                {notificatonData.filter((i: any) => !i.isRead).length > 0 && (
                  <span className="absolute border-1 border-default-50 -top-1 -right-1 min-w-[16px] min-h-[16px] rounded-full bg-primary text-[8px] text-white flex justify-center items-center p-0 m-0">
                    {notificatonData.filter((i: any) => !i.isRead).length > 9 ? "9+" : notificatonData.filter((i: any) => !i.isRead).length}
                  </span>
                )}
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Notifications" variant="flat">
              {notificatonData?.map((item: any) => (
                <DropdownItem key={item._id} className="h-14 gap-2">
                  <div className="flex items-center">
                    {item.type === 'like' && <ThumbsUp />}
                    {item.type === 'comment' && <MessageSquareText />}
                    {item.type === 'follow' && <UserCheck />}
                    {item.type === 'announcement' && <Megaphone />}
                    {item.type === 'message' && <MessageCircleMore />}
                    <p className="ml-2">{item.content}</p>
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <LanguageDropdown currentLocale={locale} onChangeLanguage={changeLanguage} />
          <Switch
            defaultSelected
            size="sm"
            color="default"
            isSelected={theme === 'dark'}
            onValueChange={(isSelected) => setTheme(isSelected ? 'dark' : 'light')}
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
          </Dropdown>
        </NavbarContent>
      </div>

    </Navbar>
  );
}
