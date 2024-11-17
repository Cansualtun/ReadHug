import "@/styles/globals.css";
import Image from "next/image";
import React from "react";
import { Providers } from "../providers";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";
import { fontSans } from "@/config/fonts";
import { NextIntlClientProvider } from "next-intl";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={clsx(
                "min-h-screen bg-background font-sans antialiased",
                fontSans.variable,
            )}>
                <Toaster position="top-center" />
                <NextIntlClientProvider>
                    <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
                        <div className="flex h-screen">
                            <div className="w-1/2 flex items-center justify-center bg-white">
                                {children}
                            </div>
                            <div className="w-1/2 relative h-full">
                                <Image
                                    priority={true}
                                    src="/assets/library.jpg"
                                    alt="Görsel"
                                    layout="fill"
                                    objectFit="cover"
                                    quality={100}
                                />
                            </div>
                        </div>
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}