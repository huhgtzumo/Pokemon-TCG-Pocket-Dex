import { useInfiniteQuery } from '@tanstack/react-query';
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { User } from '../types';

const PAGE_SIZE = 20;

export const useRankings = () => {
  return useInfiniteQuery({
    queryKey: ['rankings'],
    queryFn: async ({ pageParam }) => {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        orderBy('collections.A1.progress', 'desc'),
        pageParam ? startAfter(pageParam) : limit(PAGE_SIZE)
      );
      
      const snapshot = await getDocs(q);
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      
      const rankings = snapshot.docs.map((doc, index) => {
        const data = doc.data() as User;
        return {
          id: data.id,
          rank: index + 1,
          collectedCount: data.collections.A1.collectedPokemon.length,
          progress: data.collections.A1.progress,
          lastUpdated: data.lastUpdated.toDate()
        };
      });

      return {
        rankings,
        lastDoc,
        hasMore: rankings.length === PAGE_SIZE
      };
    },
    getNextPageParam: (lastPage) => lastPage.lastDoc,
    staleTime: 1000 * 60 * 1, // 1 minute
    cacheTime: 1000 * 60 * 5, // 5 minutes
  });
}; 