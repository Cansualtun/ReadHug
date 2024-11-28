"use client";
import React, { useEffect, useState } from "react";
import PostCard from "../postCard";
import Loading from "../../ui/loading";
import axios from "axios";

type Props = {
    data: any;
};

const Posts = ({ data }: Props) => {
    const [post, setPost] = useState<any[]>([]); // Postları tutmak için dizi
    const [page, setPage] = useState(2); // İlk sayfa 2
    const [limit] = useState(10); // Limit sabit
    const [hasMore, setHasMore] = useState(true); // Daha fazla veri olup olmadığını kontrol eder
    const [isLoading, setIsLoading] = useState(false); // Yükleniyor kontrolü

    // İlk veri yükleme
    useEffect(() => {
        if (data?.data) {
            setPost(data.data); // İlk yükleme
        }
    }, [data]);

    // Daha fazla veri yükleme fonksiyonu
    const loadMore = async () => {
        if (isLoading || !hasMore) return; // Zaten yükleniyorsa veya daha fazla veri yoksa dur
        setIsLoading(true);

        try {
            const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
            const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

            const response = await axios.get(`${BASE_URL}/posts/all?page=${page}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const newData = response.data;
            if (!newData.data || newData.data.length === 0) {
                setHasMore(false); // Daha fazla veri yoksa yüklemeyi durdur
                return;
            }

            setPost(prev => [...prev, ...newData.data]); // Mevcut veriye yenilerini ekle
            setPage(prev => prev + 1); // Sonraki sayfaya geç
        } catch (error) {
            console.error("Error loading more posts:", error);
        } finally {
            setIsLoading(false); // Yüklenme durumunu sıfırla
        }
    };

    // Scroll izleme fonksiyonu
    const handleScroll = () => {
        if (!hasMore || isLoading) return; // Daha fazla veri yoksa veya yükleniyorsa dur

        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop; // Scroll üst pozisyonu
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight; // Toplam içerik yüksekliği
        const clientHeight = document.documentElement.clientHeight || window.innerHeight; // Görünen ekran yüksekliği

        // Scroll en alta yaklaştığında yükleme işlemini tetikle
        if (scrollTop + clientHeight >= scrollHeight - 200) {
            loadMore();
        }
    };

    // Scroll dinleyicisini ekleme
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll); // Temizle
        };
    }, [hasMore, isLoading]);

    if (post.length === 0) {
        return (
            <div className="w-full flex justify-center items-center scale-50">
                <Loading />
            </div>
        );
    }

    return (
        <div>
            {post.map((item: any) => (
                <PostCard key={item._id} post={item} />
            ))}
            {isLoading && (
                <div className="w-full flex justify-center my-4 scale-50">
                    <Loading /> {/* Yükleniyor göstergesi */}
                </div>
            )}
            {!hasMore && <div className="w-full text-center mt-8 p-4 bg-default-100 rounded-lg border shadow text-default-700">Tüm paylaşımlar yüklendi</div>}
        </div>
    );
};

export default Posts;
