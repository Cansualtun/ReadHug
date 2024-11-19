"use client"
import React from 'react';
import { Link } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const Footer = () => {
    const t = useTranslations('footer');

    return (
        <footer className="w-full py-6 px-4 border-t border-default-200 text-default-100">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2 h-full flex-1 justify-center ">
                            <Image src={"/assets/logo1.svg"} width={256} height={90} alt='' />
                        </div>

                    </div>
                    <div>
                        <h3 className="font-semibold mb-4 text-default-500">{t('sections.quickLinks.title')}</h3>
                        <div className="flex flex-col space-y-2">
                            <Link href="/authors" className="text-default-500 hover:text-primary">
                                {t('sections.quickLinks.items.authors')}
                            </Link>
                            <Link href="/community" className="text-default-500 hover:text-primary">
                                {t('sections.quickLinks.items.community')}
                            </Link>
                            <Link href="/stats" className="text-default-500 hover:text-primary">
                                {t('sections.quickLinks.items.stats')}
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4 text-default-500">{t('sections.community.title')}</h3>
                        <div className="flex flex-col space-y-2">
                            <Link href="/discord" className="text-default-500 hover:text-primary">
                                {t('sections.community.items.discord')}
                            </Link>
                            <Link href="/twitter" className="text-default-500 hover:text-primary">
                                {t('sections.community.items.twitter')}
                            </Link>
                            <Link href="/github" className="text-default-500 hover:text-primary">
                                {t('sections.community.items.github')}
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4 text-default-500">{t('sections.legal.title')}</h3>
                        <div className="flex flex-col space-y-2">
                            <Link href="/privacy" className="text-default-500 hover:text-primary">
                                {t('sections.legal.items.privacy')}
                            </Link>
                            <Link href="/terms" className="text-default-500 hover:text-primary">
                                {t('sections.legal.items.terms')}
                            </Link>
                            <Link href="/cookies" className="text-default-500 hover:text-primary">
                                {t('sections.legal.items.cookies')}
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-default-200">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-default-500">
                            {t('copyright.text')}
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link href="/privacy" className="text-sm text-default-500 hover:text-primary">
                                {t('bottomLinks.privacy')}
                            </Link>
                            <Link href="/terms" className="text-sm text-default-500 hover:text-primary">
                                {t('bottomLinks.terms')}
                            </Link>
                            <Link href="/contact" className="text-sm text-default-500 hover:text-primary">
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