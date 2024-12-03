import { useInfiniteQuery } from '@tanstack/react-query';
import { collection, query, orderBy, limit, startAfter, getDocs, QueryConstraint } from 'firebase/firestore';
import { db } from '../services/firebase';
import { User } from '../types';

const PAGE_SIZE = 20;

interface RankingPage {
  rankings: Array<{
    id: string;
    rank: number;
    collectedCount: number;
    progress: number;
    lastUpdated: Date;
  }>;
  lastDoc: any;
  hasMore: boolean;
}

export const useRankings = () => {
  return useInfiniteQuery<RankingPage>({
    queryKey: ['rankings'],
    queryFn: async ({ pageParam }) => {
      const usersRef = collection(db, 'users');
      
      const queryConstraints: QueryConstraint[] = [
        orderBy('collections.A1.progress', 'desc'),
        limit(PAGE_SIZE)
      ];

      if (pageParam) {
        queryConstraints.push(startAfter(pageParam));
      }

      const q = query(usersRef, ...queryConstraints);

      const snapshot = await getDocs(q);
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      
      const rankings = snapshot.docs.map((doc) => {
        const data = doc.data() as User;
        const collectedPokemon = data.collections.A1.collectedPokemon;
        
        const collectedCount = collectedPokemon.length;
        const progress = (collectedCount / 150) * 100;

        return {
          id: doc.id,
          rank: 0,
          collectedCount,
          progress,
          lastUpdated: data.lastUpdated
        };
      });

      return {
        rankings,
        lastDoc,
        hasMore: rankings.length === PAGE_SIZE
      };
    },
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.lastDoc : undefined,
    initialPageParam: null,
    gcTime: 1000 * 60 * 5,
  });
}; 