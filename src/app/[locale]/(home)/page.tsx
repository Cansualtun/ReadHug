import { cookies } from 'next/headers';
import ReadingTracker from '../components/home/activities';
import Posts from '../components/home/posts';
import BookPostComponent from '../components/ui/widget/BookPostComponent';
import { getAllBookLists } from '../server/book';
import { Me } from '../server/me';
import { GetAllPost } from '../server/post';

export default async function Home() {

  let page = 1;
  let limit = 10;
  const cookieStore = cookies();
  const userName = cookieStore.get('userName')?.value || '';
  const [allPost] = await Promise.all([GetAllPost({ page, limit })]);
  const [allBook] = await Promise.all([getAllBookLists(userName)]);
  const [userGet] = await Promise.all([Me()]);
  const post = await allPost.json();
  const userData = await userGet.json();

  return (
    <section>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="order-1 lg:order-1 lg:col-span-4">
            <div className="sticky top-[55px]">
              <ReadingTracker books={allBook.data} />
            </div>
          </div>
          <div className="order-2 lg:order-2 lg:col-span-8">
            {userData.data && (
              <div className="sticky top-[70px] z-30 mt-4 p-2 pt-0 mb-10">
                <BookPostComponent userData={userData.data} />
              </div>
            )}
            <div className="space-y-6 md:space-y-8 lg:space-y-10">
              <Posts data={post} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
