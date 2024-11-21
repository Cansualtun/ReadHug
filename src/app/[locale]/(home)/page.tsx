import { cookies } from "next/headers";
import ReadingTracker from "../components/home/activities";
import PostCard from "../components/home/postCard";
import { getAllBookLists } from "../server/book";
import { GetAllPost } from "../server/post";


export default async function Home() {
    const cookieStore = cookies();
    const userName = cookieStore.get('userName')?.value || '';
    const [allPost] = await Promise.all([
        GetAllPost()
    ])
    const [allBook] = await Promise.all([
        getAllBookLists(userName)
    ])
    const post = await allPost.json();
    return (
        <section>
            <div className="container mx-auto">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4">
                        <ReadingTracker books={allBook.data} />
                    </div>
                    <div className="col-span-8">
                        <div className="space-y-10">
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