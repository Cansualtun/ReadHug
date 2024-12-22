import SinglePost from '@/app/[locale]/components/post/SinglePost';
import { getSingleBook } from '@/app/[locale]/server/book';
import { ProfilInfo } from '@/app/[locale]/server/profile';

export default async function PostPage({ params }: any) {
  const [singlePost] = await Promise.all([getSingleBook(params.slug)]);
  const [profileResponse] = await Promise.all([
    ProfilInfo(singlePost.data.user.userName),
  ]);
  const profile = await profileResponse.json();

  return (
    <div>
      <SinglePost post={singlePost} profile={profile} locale={params.locale} />
    </div>
  );
}
