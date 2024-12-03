import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

async function fetchUserData(userId: string): Promise<User | null> {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() as User : null;
}

export function useUser(user?: { id: string }) {
  const queryClient = useQueryClient();

  return {
    ...useQuery<User | null>({
      queryKey: ['userData', user?.id],
      queryFn: async () => {
        if (!user?.id) return null;
        return fetchUserData(user.id);
      },
      gcTime: 1000 * 60 * 30,
      enabled: !!user?.id,
    }),
    invalidateUserData: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['userData', user?.id] 
      });
    }
  };
} 