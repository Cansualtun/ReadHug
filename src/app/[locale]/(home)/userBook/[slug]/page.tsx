import UserBookDetailCard from '@/app/[locale]/components/book/bookDetailCard/UserBookDetailCard';
import ProfileCard from '@/app/[locale]/components/profile/ProfileCard';
import {
  getAllPersonalBooks,
  getPersonalBooks,
} from '@/app/[locale]/server/book';
import { ProfilInfo } from '@/app/[locale]/server/profile';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

interface PageProps {
  params: { slug: string; locale: string };
}

// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 60
 
// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true // or false, to 404 on unknown paths

// 🔹 **SEO için Metadata Dinamik Olarak Belirleniyor**
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  setRequestLocale(params.locale);
  try {
    const bookData = await getPersonalBooks(params.slug);
    if (!bookData.status) {
      return {
        title: 'Kitap Bulunamadı',
        description: 'Bu kitap sayfası mevcut değil.',
      };
    }

    return {
      title: bookData.data?.bookId?.name,
      description:
        bookData.data?.bookId?.description ||
        'Bu kitap hakkında detaylı bilgi.',
      openGraph: {
        title: bookData.data?.bookId?.name,
        description:
          bookData.data?.bookId?.description ||
          'Bu kitap hakkında detaylı bilgi.',
        url: `https://readhug.com/${params.locale}/userBook/${params.slug}`,
        images: [
          {
            url: bookData.data?.bookId?.images?.[0] || '/default-image.jpg',
            alt: bookData.data?.bookId?.name || 'Kitap Resmi',
          },
        ],
      },
    };
  } catch (error) {
    console.error('generateMetadata Hata:', error);
    return {
      title: 'Bilinmeyen Hata',
      description: 'Metadata oluşturulurken bir hata oluştu.',
    };
  }
}

// 🔹 **Statik Sayfa için Slug'ları Build Zamanında Oluştur**
export async function generateStaticParams() {
  try {
    const books = await getAllPersonalBooks();
    return books?.data?.map((book: any) => ({
      slug: book.slug,
      locale: book.locale, // locale parametresini ekleyin
    }));
  } catch (error) {
    console.error('generateStaticParams Hata:', error);
    return [];
  }
}

// 🔹 **Sayfa Bileşeni**
export default async function PersonalBooksSlug({ params }: {
  params: Promise<{ slug: string }>
}) {
  try {
    const slug = (await params).slug
    const result = await getPersonalBooks(slug);
    
    if (!result.status) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-500">Kitap yüklenirken bir hata oluştu</p>
        </div>
      );
    }

    // Kullanıcı profili getiriliyor
    const profileResponse = await ProfilInfo(result.data.userId.userName);
    const profile = await profileResponse.json();

    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4">
          <ProfileCard profileData={profile} />
        </div>
        <div className="col-span-12 lg:col-span-8">
          <UserBookDetailCard book={result.data} profileData={profile} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Hata:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Bir hata oluştu</p>
      </div>
    );
  }
}
