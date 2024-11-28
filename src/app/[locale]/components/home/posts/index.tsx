'use client';
import React, { useEffect, useState } from 'react';
import PostCard from '../postCard';
import Loading from '../../ui/loading';
import axios from 'axios';

type Props = {
  data: any;
};

const Posts = ({ data }: Props) => {
  const [post, setPost] = useState<any[]>([]);
  const [page, setPage] = useState(2);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data?.data) {
      setPost(data.data);
    }
  }, [data]);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
      const BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

      const response = await axios.get(
        `${BASE_URL}/posts/all?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const newData = response.data;
      if (!newData.data || newData.data.length === 0) {
        setHasMore(false);
        return;
      }

      setPost((prev) => [...prev, ...newData.data]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    if (!hasMore || isLoading) return;
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || window.innerHeight;

    if (scrollTop + clientHeight >= scrollHeight - 200) {
      loadMore();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
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
          <Loading />
        </div>
      )}
      {!hasMore && (
        <div className="w-full text-center mt-8 p-4 bg-default-100 rounded-lg border shadow text-default-700">
          Tüm paylaşımlar yüklendi
        </div>
      )}
    </div>
  );
};

export default Posts;
