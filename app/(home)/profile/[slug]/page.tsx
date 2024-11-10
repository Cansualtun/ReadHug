import { getAllBookLists } from "@/app/server/book";
import { UserPostInfo } from "@/app/server/post";
import { ProfilInfo } from "@/app/server/profile";
import BookListTabs from "@/components/profile/BookListTab";
import ProfileCard from "@/components/profile/ProfileCard";

export default async function ProfileSlug({ params }: { params: { slug: string } }) {
    const [profileResponse, booksResponse, postResponse] = await Promise.all([
        ProfilInfo(params.slug),
        getAllBookLists(params.slug),
        UserPostInfo(params.slug)
    ]);

    const profile = await profileResponse.json();
    const post = await postResponse.json();
    const books = booksResponse;

    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="sticky top-4">
                        <ProfileCard profileData={profile} />
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <BookListTabs bookLists={books} slug={params.slug} post={post} />
                </div>
            </div>
        </div>
    );
}