import { fetchWithToken } from "@/app/server/profile";

export default async function ProfileSlug({ params }: any) {
    const response = await fetchWithToken(`http://localhost:4000/user/profile/${params.userName}`);
    console.log(response, "jsdhd")
    const profil = await response.json();
    console.log(profil, "dskf")
    return (
        <div>
            sdhdsjh
        </div>
    );
}
