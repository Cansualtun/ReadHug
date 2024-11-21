import { cookies } from "next/headers";
import ReadingTracker from "../components/home/activities";
import PostCard from "../components/home/postCard";
import { getAllBookLists } from "../server/book";
import { GetAllPost } from "../server/post";


export default async function Home() {
    const cookieStore = cookies();
    const userName = cookieStore.get('userName')?.value || '';
    const [allPost] = await Promise.all([GetAllPost()]);
    const [allBook] = await Promise.all([getAllBookLists(userName)]);
    const post = await allPost.json();

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
                        <div className="space-y-6 md:space-y-8 lg:space-y-10">
                            {post?.data?.map((item: any) => (
                                <PostCard key={item._id} post={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}