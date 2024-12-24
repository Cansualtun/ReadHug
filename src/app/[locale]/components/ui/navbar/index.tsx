'use client';
import { useLogoutMutation } from '@/store/AuthStore';
import { useMeMutation } from '@/store/UserStore';
import {
  Avatar,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Navbar,
  NavbarContent,
  Switch,
} from '@nextui-org/react';
import {
  LogIn,
  LogOut,
  Menu,
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
                alt="logo"
                className="w-[180px] h-[32px]"
              />
            </span>
            <span className="flex justify-center items-center md:hidden">
              <Image
                src={'/assets/logo.svg'}
                width={240}
                height={60}
                alt="logo"
                className="w-[180px] min-h-[40px] h-16"
              />
            </span>
          </Link>
          {/* <NavbarContent className="hidden md:flex gap-3">
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
          </NavbarContent> */}
        </NavbarContent>
        <NavbarContent as="div" className="items-center" justify="end">
          {userData.userName && (
            <div className="relative" ref={dropdownRef}>
              <Notifications
                open={openNotification}
                setOpen={setOpenNotification}
              />
            </div>
          )}
          <div className="">
            <LanguageDropdown
              currentLocale={locale}
              onChangeLanguage={changeLanguage}
            />
          </div>
          <div className=" md:block hidden">
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
              aria-label="Toggle theme"
            />
          </div>

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              {userData?.userName ? (
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform ring-primary/80 min-h-8 min-w-8"
                  color="secondary"
                  name="Jason Hughes"
                  size="sm"
                  src={userData?.image ?? '/assets/avatar.png'}
                />
              ) : (
                <div role="button" className="flex text-default-500">
                  <Menu className="w-6 h-6" />
                </div>
              )}
            </DropdownTrigger>
            {userData.userName ? (
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownSection showDivider>
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
                </DropdownSection>
                <DropdownSection>
                  <DropdownItem
                    endContent={
                      <Switch
                        defaultSelected
                        size="sm"
                        color="default"
                        isSelected={theme === 'dark'}
                        onValueChange={(isSelected) =>
                          setTheme(isSelected ? 'dark' : 'light')
                        }
                        startContent={
                          <Sun className="w-3.5 h-3.5 text-warning-400" />
                        }
                        endContent={
                          <Moon className="w-3.5 h-3.5 text-default-500" />
                        }
                        aria-label="Toggle theme"
                      />
                    }
                  >
                    Mode
                  </DropdownItem>
                  {/* <DropdownItem
                    endContent={
                      <LanguageDropdown
                        currentLocale={locale}
                        onChangeLanguage={changeLanguage}
                      />
                    }
                  >
                    Language
                  </DropdownItem> */}
                </DropdownSection>
              </DropdownMenu>
            ) : (
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownSection showDivider>
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
                </DropdownSection>
                <DropdownSection>
                  <DropdownItem
                    endContent={
                      <Switch
                        defaultSelected
                        size="sm"
                        color="default"
                        isSelected={theme === 'dark'}
                        onValueChange={(isSelected) =>
                          setTheme(isSelected ? 'dark' : 'light')
                        }
                        startContent={
                          <Sun className="w-3.5 h-3.5 text-warning-400" />
                        }
                        endContent={
                          <Moon className="w-3.5 h-3.5 text-default-500" />
                        }
                        aria-label="Toggle theme"
                      />
                    }
                  >
                    Mode
                  </DropdownItem>
                  {/* <DropdownItem
                    endContent={
                      <LanguageDropdown
                        currentLocale={locale}
                        onChangeLanguage={changeLanguage}
                      />
                    }
                  >
                    Language
                  </DropdownItem> */}
                </DropdownSection>
              </DropdownMenu>
            )}
          </Dropdown>
        </NavbarContent>
      </div>
    </Navbar>
  );
}
