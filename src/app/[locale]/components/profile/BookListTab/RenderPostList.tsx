import axios from 'axios';
import { useEffect, useState } from 'react';
import PostCard from '../../home/postCard';
import Loading from '../../ui/loading';
type Props = {
  post: any;
  slug: string;
  profileData: any;
  handlePostMount: () => void;
};

const RenderPostList = ({ post, slug, profileData,handlePostMount }: Props) => {
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [userPost, setUserPost] = useState<any[]>(post.data);
  const loadMore = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
      let BASE_URL = '';
      if (process.env.NODE_ENV === 'development') {
        BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
      }
      if (process.env.NODE_ENV === 'production') {
        BASE_URL = 'https://bookarchive-production.up.railway.app';
      }

      const response = await axios.get(
        `${BASE_URL}/posts/user/${slug}?page=${page}&limit=10`,
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
      setUserPost((prev) => [...prev, ...newData.data]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error loading more books:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (post?.data) {
      setUserPost(post?.data);
      setHasMore(true);
    }
  }, [post]);
  const handleScroll = () => {
    if (!hasMore || loading) return;
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || window.innerHeight;

    if (scrollTop + clientHeight >= scrollHeight - 25) loadMore();
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, loading]);
  return (
    <div>
      <div>
        {userPost.map((item: any) => (
          <PostCard
            key={item._id}
            post={item}
            profileData={profileData}
            mount={handlePostMount}
          />
        ))}
      </div>
      {loading && (
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

export default RenderPostList;
