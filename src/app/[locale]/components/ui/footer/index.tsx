"use client"
import React from 'react';
import { Link } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

const Footer = () => {
    const t = useTranslations('footer');

    return (
        <footer className="w-full py-6 px-4 border-t border-gray-200 bg-[#F8F7F4]">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="text-2xl font-bold">▲ ACME</div>
                        </div>
                        <p className="text-gray-500 text-sm">
                            {t('slogan')}
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">{t('sections.quickLinks.title')}</h3>
                        <div className="flex flex-col space-y-2">
                            <Link href="/authors" className="text-gray-500 hover:text-blue-500">
                                {t('sections.quickLinks.items.authors')}
                            </Link>
                            <Link href="/community" className="text-gray-500 hover:text-blue-500">
                                {t('sections.quickLinks.items.community')}
                            </Link>
                            <Link href="/stats" className="text-gray-500 hover:text-blue-500">
                                {t('sections.quickLinks.items.stats')}
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">{t('sections.community.title')}</h3>
                        <div className="flex flex-col space-y-2">
                            <Link href="/discord" className="text-gray-500 hover:text-blue-500">
                                {t('sections.community.items.discord')}
                            </Link>
                            <Link href="/twitter" className="text-gray-500 hover:text-blue-500">
                                {t('sections.community.items.twitter')}
                            </Link>
                            <Link href="/github" className="text-gray-500 hover:text-blue-500">
                                {t('sections.community.items.github')}
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">{t('sections.legal.title')}</h3>
                        <div className="flex flex-col space-y-2">
                            <Link href="/privacy" className="text-gray-500 hover:text-blue-500">
                                {t('sections.legal.items.privacy')}
                            </Link>
                            <Link href="/terms" className="text-gray-500 hover:text-blue-500">
                                {t('sections.legal.items.terms')}
                            </Link>
                            <Link href="/cookies" className="text-gray-500 hover:text-blue-500">
                                {t('sections.legal.items.cookies')}
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-500">
                            {t('copyright.text')}
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-500">
                                {t('bottomLinks.privacy')}
                            </Link>
                            <Link href="/terms" className="text-sm text-gray-500 hover:text-blue-500">
                                {t('bottomLinks.terms')}
                            </Link>
                            <Link href="/contact" className="text-sm text-gray-500 hover:text-blue-500">
                                {t('bottomLinks.contact')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;