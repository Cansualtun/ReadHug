import Activities from "@/components/home/activities";
import PostCard from "@/components/home/postCard";

export default function Home() {
    return (
        <section>
            <div className="container mx-auto">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4">
                        <Activities />
                    </div>
                    <div className="col-span-8">
                        <div className="space-y-10">
                            <PostCard />
                            <PostCard />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}