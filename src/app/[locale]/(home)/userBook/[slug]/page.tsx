import UserBookDetailCard from '@/app/[locale]/components/book/bookDetailCard/UserBookDetailCard';
import ProfileCard from '@/app/[locale]/components/profile/ProfileCard';
import { getPersonalBooks } from '@/app/[locale]/server/book';
import { ProfilInfo } from '@/app/[locale]/server/profile';

export default async function PersonalBooksSlug({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const result = await getPersonalBooks(params.slug);
    const [profileResponse] = await Promise.all([
      ProfilInfo(result.data.userId.userName),
    ]);
    const profile = await profileResponse.json();

    if (!result.status) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-500">Kitap yüklenirken bir hata oluştu</p>
        </div>
      );
    }

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
    console.log('error');

    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Bir hata oluştu</p>
      </div>
    );
  }
}
