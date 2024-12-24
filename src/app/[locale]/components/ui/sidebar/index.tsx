'use client';
import { useMeMutation } from '@/store/UserStore';
import { Avatar, Tab, Tabs } from '@nextui-org/react';
import axios from 'axios';
import { ImagePlus, KeyRound, Save, User2 } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import ChangePassword from '../../profile/ChangePassword';
import ProfileUpdate from '../../profile/ProfileUpdate';
import Loading from '../loading';
import { useRouter } from 'next/navigation';

const SidebarItems = [
  {
    sidebarTitle: 'Profile',
    sideBarContent: <ProfileUpdate />,
    icon: <User2 className="w-5 h-5" />,
    description: 'Personal information and settings',
    color: 'primary',
    key: 'profile',
  },
  {
    sidebarTitle: 'Change Password',
    sideBarContent: <ChangePassword />,
    icon: <KeyRound className="w-5 h-5" />,
    description: 'Update your password',
    color: 'default',
    key: 'changePassword',
  },
];

let BASE_URL = '';
if (process.env.NODE_ENV === 'development') {
  BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
}
if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://bookarchive-production.up.railway.app';
}

export default function Sidebar() {
  const router = useRouter();
  const [tab, setTab] = useState<any>('profile');
  const [upgradeImage, setUpgradeImage] = useState<null | FileList>(null);
  const [meData, setMeData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [me] = useMeMutation();

  const meHandler = async () => {
    setIsLoggedIn(false);
    const { data }: any = await me();
    if (data) {
      setMeData(data.data as any);
      setIsLoggedIn(true);
    } else {
      router.push('/');
      setIsLoggedIn(false);
    }
  };

  const avatarUpgrade = async () => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];
    try {
      if (!upgradeImage) {
        console.error('No image selected for upload');
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append('image', upgradeImage[0] as any);
      const { data } = await axios.patch(
        `${BASE_URL}/user/uploadProfileImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    meHandler();
  }, []);

  return isLoggedIn ? (
    <div className="w-full mx-auto grid grid-cols-12 gap-2">
      <div className="col-span-12 md:col-span-8">
        <Tabs
          aria-label="Options"
          color="primary"
          variant="solid"
          selectedKey={tab}
          onSelectionChange={setTab}
          classNames={{
            tabList: 'gap-4 p-2 bg-default-100 rounded-lg shadow-sm',
            cursor: 'bg-white dark:bg-default-100',
            tab: 'h-14 md:px-8 px-2 data-[selected=true]:text-primary',
            tabContent: 'group-data-[selected=true]:text-primary',
          }}
        >
          {SidebarItems.map((item) => (
            <Tab
              key={item.key}
              onSelect={(e) => console.log(e)}
              title={
                <div className="flex items-center gap-2">
                  {item.icon}
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium">
                      {item.sidebarTitle}
                    </span>
                    <span className="md:text-xs text-[10px] text-default-500 w-full text-wrap">
                      {item.description}
                    </span>
                  </div>
                </div>
              }
            >
              {item.sideBarContent}
            </Tab>
          ))}
        </Tabs>
      </div>
      <div className="col-span-12 md:col-span-4 flex flex-col pb-3">
        <div className="min-h-[72px] px-2 gap-4 p-2 bg-transparent mb-3 py-4 hidden md:flex items-center">
          {/* <Info className="w-5 h-5" />{' '}
          {tab == 'profile'
            ? 'Profile Information'
            : 'Change Password Information'} */}
        </div>
        {tab == 'profile' ? (
          <div className="gap-4 p-2 py-8 bg-default-100 rounded-large shadow border flex flex-col items-center justify-center min-h-max flex-1 self-stretch">
            <h3>Avatar Update</h3>
            <div className="relative group">
              {!upgradeImage ? (
                <Avatar
                  src={meData?.image || '/assets/avatar.png'}
                  size="lg"
                  name={`${meData?.firstName} ${meData?.lastName}`}
                  className="w-44 h-44 text-large ring-white dark:ring-primary"
                />
              ) : (
                <Avatar
                  src={URL.createObjectURL(upgradeImage[0])}
                  size="lg"
                  name={`${meData?.firstName} ${meData?.lastName}`}
                  className="w-44 h-44 text-large ring-white dark:ring-primary"
                />
              )}

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden group-hover:flex w-44 h-44 bg-white/50 rounded-full justify-center items-center">
                <label
                  htmlFor="upgradeImage"
                  className="bg-white/80 w-10 h-10 rounded-full flex justify-center items-center cursor-pointer transition-all"
                >
                  <ImagePlus />
                </label>
                <input
                  type="file"
                  name=""
                  id="upgradeImage"
                  className="hidden"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const files = e.target.files;
                    if (files) {
                      setUpgradeImage(files as FileList);
                    }
                  }}
                />
              </div>
            </div>
            {upgradeImage && (
              <div className="mt-2">
                <button
                  disabled={loading}
                  onClick={avatarUpgrade}
                  className="flex items-center bg-primary text-white px-2 py-0.5 rounded-md text-sm"
                >
                  {loading ? (
                    <div className="flex items-center gap-0.5">
                      <div className="animate-spin">⌛</div> Yükleniyor...
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Save size={16} className="mr-1" /> Kaydet
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="gap-4 p-2 bg-default-100 rounded-lg shadow-sm border">
            Şifre değiştirme bilgileri{' '}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Loading height={40} width={150} />
    </div>
  );
}
