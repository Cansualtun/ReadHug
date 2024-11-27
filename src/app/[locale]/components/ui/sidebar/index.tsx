'use client';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import { User2, KeyRound, Info } from 'lucide-react';
import ProfileUpdate from '../../profile/ProfileUpdate';
import ChangePassword from '../../profile/ChangePassword';

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
  console.log('tab', tab);

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
            tab: 'h-14 px-8 data-[selected=true]:text-primary',
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
                    <span className="text-xs text-default-500">
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
      <div className="col-span-12 md:col-span-4">
        <div className="h-[72px] px-2 text-primary gap-4 p-2 bg-default-100 rounded-lg shadow-sm mb-3 py-4 border flex items-center">
          <Info className="w-5 h-5" />{' '}
          {tab == 'profile'
            ? 'Profile Information'
            : 'Change Password Information'}
        </div>
        {tab == 'profile' ? (
          <div className="gap-4 p-2 bg-default-100 rounded-lg shadow-sm border">
            Profil bilgileri
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
