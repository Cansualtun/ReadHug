"use client"
import React from 'react';
import { Link } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
const Footer = () => {
    const t = useTranslations('footer');
    return (
        <div className="w-full max-w-2xl mx-auto space-y-4 p-4 pb-0">
            <div className='flex flex-row gap-10'>
                <div>
                    <div className="flex flex-col space-y-2">
                        <Link href="/discord" className="text-default-500 hover:text-primary text-sm">
                            {t('sections.community.items.discord')}
                        </Link>
                        <Link href="/twitter" className="text-default-500 hover:text-primary text-sm">
                            {t('sections.community.items.twitter')}
                        </Link>
                        <Link href="/github" className="text-default-500 hover:text-primary text-sm">
                            {t('sections.community.items.github')}
                        </Link>
                    </div>
                </div>
                <div>
                    <div className="flex flex-col space-y-2">
                        <Link href="/privacy" className="text-default-500 hover:text-primary text-sm">
                            {t('sections.legal.items.privacy')}
                        </Link>
                        <Link href="/terms" className="text-default-500 hover:text-primary text-sm">
                            {t('sections.legal.items.terms')}
                        </Link>
                        <Link href="/cookies" className="text-default-500 hover:text-primary text-sm">
                            {t('sections.legal.items.cookies')}
                        </Link>
                    </div>
                </div>
                <div className='flex flex-row-reverse'>
                    <Image src={"/assets/logo.svg"} alt='logo' width={75} height={20} />
                </div>
            </div>
        </div>
    );
};

export default Footer;