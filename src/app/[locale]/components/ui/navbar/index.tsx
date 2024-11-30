'use client';
import { useLogoutMutation } from '@/store/AuthStore';
import { useMeMutation } from '@/store/UserStore';
import {
  Avatar,
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
  LogIn,
  LogOut,
  Milestone,
  Moon,
  Settings,
  Sun,
  User,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import LanguageDropdown from '../languageDropdown';
import { SearchIcon } from '../svg/SearchIcon.jsx';
import Notifications from './Notifications';

const locales = ['tr', 'en'];

const { useRouter: useRouterIntl, usePathname: usePathnameIntl } =
  createSharedPathnamesNavigation({
    locales,
  });

export default function Header() {
  const t = useTranslations('header');
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
  const [openNotification, setOpenNotification] = useState(false);
  const changeLanguage = (newLocale: string) => {
    routerIntl.push(pathname, { locale: newLocale });
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
    } catch (error) {
      console.error(t('errors.userDataFetch'), error);
    }
  };
  useEffect(() => {
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
            <span className="hidden justify-center items-center md:flex">
              <Image
                src={'/assets/logo1.svg'}
                width={240}
                height={60}
                alt=""
                className="w-[180px] h-[32px]"
              />
            </span>
            <span className="flex justify-center items-center md:hidden">
              <Image
                src={'/assets/logo.svg'}
                width={240}
                height={60}
                alt=""
                className="w-[180px] min-h-[40px] h-16"
              />
            </span>
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
              <Notifications
                open={openNotification}
                setOpen={setOpenNotification}
              />
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
