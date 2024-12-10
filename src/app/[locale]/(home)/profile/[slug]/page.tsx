import BlockedUserMessage from '@/app/[locale]/components/profile/BlockedUser';
import BookListTabs from '@/app/[locale]/components/profile/BookListTab';
import ProfileCard from '@/app/[locale]/components/profile/ProfileCard';
import ProfileFooter from '@/app/[locale]/components/ui/profileFooter';
import { getAllBookLists } from '@/app/[locale]/server/book';
import { UserPostInfo } from '@/app/[locale]/server/post';
import { ProfilInfo } from '@/app/[locale]/server/profile';

export default async function ProfileSlug({
  params,
}: {
  params: { slug: string };
}) {
  const [profileResponse, booksResponse, postResponse] = await Promise.all([
    ProfilInfo(params.slug),
    getAllBookLists(params.slug),
    UserPostInfo(params.slug),
  ]);

  const profile = await profileResponse.json();
  const post = await postResponse.json();
  const books = booksResponse;

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
                bookLists={books}
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
