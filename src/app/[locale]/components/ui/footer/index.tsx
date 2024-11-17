"use client"
import React from 'react';
import { Link } from '@nextui-org/react';

const Footer = () => {
    return (
        <footer className="w-full py-6 px-4 border-t border-gray-200 bg-[#F8F7F4]">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="text-2xl font-bold">▲ ACME</div>
                        </div>
                        <p className="text-gray-500 text-sm">
                            Your reading journey starts here
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <div className="flex flex-col space-y-2">
                            <Link href="/authors" className="text-gray-500 hover:text-blue-500">
                                Authors
                            </Link>
                            <Link href="/community" className="text-gray-500 hover:text-blue-500">
                                Community
                            </Link>
                            <Link href="/stats" className="text-gray-500 hover:text-blue-500">
                                Stats
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Community</h3>
                        <div className="flex flex-col space-y-2">
                            <Link href="/discord" className="text-gray-500 hover:text-blue-500">
                                Discord
                            </Link>
                            <Link href="/twitter" className="text-gray-500 hover:text-blue-500">
                                Twitter
                            </Link>
                            <Link href="/github" className="text-gray-500 hover:text-blue-500">
                                GitHub
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <div className="flex flex-col space-y-2">
                            <Link href="/privacy" className="text-gray-500 hover:text-blue-500">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-gray-500 hover:text-blue-500">
                                Terms of Service
                            </Link>
                            <Link href="/cookies" className="text-gray-500 hover:text-blue-500">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-500">
                            © 2024 ACME Reading. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-500">
                                Privacy
                            </Link>
                            <Link href="/terms" className="text-sm text-gray-500 hover:text-blue-500">
                                Terms
                            </Link>
                            <Link href="/contact" className="text-sm text-gray-500 hover:text-blue-500">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;