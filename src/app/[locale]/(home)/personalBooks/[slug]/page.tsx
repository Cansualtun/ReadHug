import BookDetailCard from "@/app/[locale]/components/book/bookDetailCard";
import { getPersonalBooks } from "@/app/[locale]/server/book";

export default async function PersonalBooksSlug({ params }: { params: { slug: string } }) {
    try {
        const result = await getPersonalBooks(params.slug);

        if (!result.status) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-red-500">Kitap yüklenirken bir hata oluştu</p>
                </div>
            );
        }

        return (
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <BookDetailCard book={result.data} />
            </div>
        );
    } catch (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">Bir hata oluştu</p>
            </div>
        );
    }
}