'use client';
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { Tabs, Tab, Avatar } from '@nextui-org/react';
import { User2, KeyRound, Info, ImagePlus, Save } from 'lucide-react';
import ProfileUpdate from '../../profile/ProfileUpdate';
import ChangePassword from '../../profile/ChangePassword';
import { useMeMutation, useUserProfileQuery } from '@/store/UserStore';
import axios from 'axios';

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

export default function Sidebar() {
  const [tab, setTab] = useState<any>('profile');
  const [upgradeImage, setUpgradeImage] = useState<null | FileList>(null);
  const [meData, setMeData] = useState<any>({});
  const [me] = useMeMutation();

  const meHandler = async () => {
    const { data }: any = await me();
    setMeData(data.data as any);
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
      const formData = new FormData();
      formData.append('image', upgradeImage[0] as any);
      const { data } = await axios.patch(
        `http://localhost:4000/user/uploadProfileImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      //   await ProfilInfo(params.slug as string);
    } catch (error) {}
  };
  useEffect(() => {
    meHandler();
  }, []);

  return (
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
                  onClick={avatarUpgrade}
                  className="flex items-center bg-primary text-white px-2 py-0.5 rounded-md text-sm"
                >
                  <Save size={16} className="mr-1" /> Kaydet
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
  );
}
