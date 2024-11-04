import { fetchWithToken } from "@/app/server/profile";

export default async function ProfileSlug({ params }: any) {
    const response = await fetchWithToken(`http://localhost:4000/user/profile/${params.slug}`);
    const profil = await response.json();
    console.log(profil, "dobis")
    return (
        <div>
            {profil?.user?.userName}
        </div>
    );
}
