'use client';
import { useMorePostsMutation, usePostsMutation } from '@/store/PostStore';
import { selectPost } from '@/store/PostStore/slice';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loading from '../../ui/loading';
import PostCard from '../postCard';

type Props = {
  data: any;
};

const Posts = ({ data }: Props) => {
  const selectPosts = useSelector(selectPost);

  const [posts] = usePostsMutation();
  const [morePost] = useMorePostsMutation();
  const [page, setPage] = useState(2);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const firstLoadPosts = async () => {
    await posts({ page: 1, limit });
  };

  useEffect(() => {
    if (data?.status) {
      firstLoadPosts();
    }
  }, [data]);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const { data } = await morePost({ page, limit });
      if (data?.data?.length === 0) {
        setHasMore(false);
        return;
      }
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

    if (scrollTop + clientHeight >= scrollHeight - 25) loadMore();
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, isLoading]);

  if (selectPosts?.length === 0) {
    return (
      <div className="w-full flex justify-center items-center scale-50">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      {selectPosts?.map((item: any) => <PostCard key={item._id} post={item} />)}
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
