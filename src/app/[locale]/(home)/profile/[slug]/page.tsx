import { getLibraryLists } from '@/app/[locale]/client/book';
import BlockedUserMessage from '@/app/[locale]/components/profile/BlockedUser';
import BookListTabs from '@/app/[locale]/components/profile/BookListTab';
import ProfileCard from '@/app/[locale]/components/profile/ProfileCard';
import ProfileFooter from '@/app/[locale]/components/ui/profileFooter';
import { getAllBookLists } from '@/app/[locale]/server/book';
import { UserPostInfo } from '@/app/[locale]/server/post';
import { ProfilInfo } from '@/app/[locale]/server/profile';

export default async function ProfileSlug({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { tab: '0' | '1' | '2' };
}) {
  console.log('searchParams', searchParams.tab);
  const [profileResponse, postResponse, libraryResponse] = await Promise.all([
    ProfilInfo(params.slug),
    UserPostInfo(params.slug),
    getLibraryLists(
      params.slug,
      (parseInt(searchParams.tab) as 0 | 1 | 2) || 1,
    ),
  ]);

  const profile = await profileResponse.json();
  const post = await postResponse.json();
  const library = libraryResponse;
  return (
    <>
      <div className="mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <ProfileCard profileData={profile} />
            </div>
          </div>
          <div className="lg:col-span-2">
            {profile.isBlocked === '0' ? (
              <BookListTabs
                profileData={profile}
                bookLists={library}
                slug={params.slug}
                post={post}
              />
            ) : (
              <BlockedUserMessage
                blockType={profile.isBlocked}
                blockedUsername={profile.user.userName}
              />
            )}
          </div>
        </div>
      </div>
      <ProfileFooter />
    </>
  );
}
