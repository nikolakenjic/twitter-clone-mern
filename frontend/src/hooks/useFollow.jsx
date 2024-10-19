import { useMutation, useQueryClient } from '@tanstack/react-query';
import fetchUrl from '../utils/axios';
import toast from 'react-hot-toast';

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const { data, status } = await fetchUrl.post(`/users/follow/${userId}`);

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
    onSuccess: (data) => {
      toast.success(data.message);
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['suggestedUsers'] }),
        queryClient.invalidateQueries({ queryKey: ['authUser'] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { follow, isPending };
};

export default useFollow;
