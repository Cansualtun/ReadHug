import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
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
    );
}
