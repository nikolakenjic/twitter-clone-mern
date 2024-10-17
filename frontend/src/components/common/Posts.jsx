import Post from './Post';
import PostSkeleton from '../skeletons/PostSkeleton';
import { POSTS } from '../../utils/db/dummyData';
import { useQuery } from '@tanstack/react-query';
import fetchUrl from '../../utils/axios';
import { useEffect } from 'react';

const Posts = ({ feedType, username, userId }) => {
  const getEndPoint = () => {
    switch (feedType) {
      case 'forYour':
        return '/posts/all';
      case 'following':
        return '/posts/following';
      case 'posts':
        return `/posts/user/${username}`;
      case 'likes':
        return `/posts/likes/${userId}`;
      default:
        return '/posts/all';
    }
  };

  const POST_ENDPOINT = getEndPoint();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const { data, status } = await fetchUrl.get(POST_ENDPOINT);

        if (status !== 200) {
          throw new Error(
            data.error?.response?.data?.message || 'Failed to create account'
          );
        }

        return data;
      } catch (err) {
        console.log('Error 💥', err.response?.data?.message || err.message);
        throw err;
      }
    },
  });

  // Refetch data when state changes
  useEffect(() => {
    refetch();
  }, [feedType, refetch, username]);

  const { status, posts } = data || {};

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
