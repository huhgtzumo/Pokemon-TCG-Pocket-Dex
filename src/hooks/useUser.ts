import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserData } from '../services/firebase';
import { useUserStore } from '../stores/userStore';

export const useUser = () => {
  const queryClient = useQueryClient();
  const user = useUserStore(state => state.user);

  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['userData', user?.id],
    queryFn: () => getUserData(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });

  const invalidateUserData = () => {
    queryClient.invalidateQueries(['userData', user?.id]);
  };

  return {
    userData,
    isLoading,
    error,
    invalidateUserData
  };
}; 