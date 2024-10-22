import { useMutation, useQueryClient } from '@tanstack/react-query';
import fetchUrl from '../utils/axios';
import toast from 'react-hot-toast';

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async (formData) => {
      try {
        const { data, status } = await fetchUrl.post('/users/update', {
          ...formData,
        });

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
    onSuccess: () => {
      toast.success('Profile updated successfully');
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['authUser'] }),
        queryClient.invalidateQueries({ queryKey: ['userProfile'] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;
