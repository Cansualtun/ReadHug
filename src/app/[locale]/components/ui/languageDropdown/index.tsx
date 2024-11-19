'use client';

import React from 'react';
import { Dropdown, DropdownMenu, DropdownTrigger, DropdownItem } from '@nextui-org/react';
import { Languages } from 'lucide-react';
import { useLocale } from 'next-intl';

interface LanguageDropdownProps {
    currentLocale: string;
    onChangeLanguage: (newLocale: string) => void;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ currentLocale, onChangeLanguage }) => {
    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-default-100 hover:bg-default-200 cursor-pointer">
                    <Languages className="w-4 h-4 text-primary/80" />
                    <span className="text-sm font-medium">{currentLocale.toUpperCase()}</span>
                </div>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Language selection"
                selectedKeys={new Set([currentLocale])}
                selectionMode="single"
                onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0];
                    if (typeof selectedKey === 'string') {
                        onChangeLanguage(selectedKey);
                    }
                }}
                className="min-w-[120px]"
            >
                <DropdownItem key="tr" className="text-sm" description="Türkçe">
                    TR
                </DropdownItem>
                <DropdownItem key="en" className="text-sm" description="English">
                    EN
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

export default LanguageDropdown;
