import { useMeMutation } from "@/store/UserStore";
import Activities from "../components/home/activities";
import PostCard from "../components/home/postCard";
import BookPostComponent from "../components/ui/widget/BookPostComponent";
import { GetAllPost } from "../server/post";
import { Me } from "../server/me";


export default async function Home() {
    const [allPost, userGet] = await Promise.all([
        GetAllPost(),
        Me()
    ])
    const post = await allPost.json();
    const userData = await userGet.json();

    return (
        <section>
            <div className="container mx-auto ">
                <div className="grid grid-cols-12 gap-4 relative">
                    <div className="col-span-4 ">
                        <Activities />
                    </div>
                    <div className="col-span-8">
                        {
                            userData.data && <div className="sticky top-[70px] z-50 max-w-2xl mt-4 p-2 pt-0 mb-10">
                                <BookPostComponent userData={userData.data} />
                            </div>
                        }

                        <div className="space-y-10">
                            {post?.data?.map((item: any) => (
                                <PostCard post={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}