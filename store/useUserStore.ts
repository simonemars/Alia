import { create } from 'zustand';
import { UserProfile } from '@/types';

import { getNearbyUsers as fetchNearbyUsersFromAPI } from '@/services/users';

type UserState = {
  users: UserProfile[];
  nearbyUsers: UserProfile[];
  isLoading: boolean;
  error: string | null;
  searchRadius: number;
};

type UserActions = {
  fetchNearbyUsers: (latitude: number, longitude: number) => Promise<void>;
  updateSearchRadius: (radius: number) => void;
  rateUser: (userId: string, rating: number) => Promise<void>;
};

export const useUserStore = create<UserState & UserActions>((set) => ({
  users: [],
  nearbyUsers: [],
  isLoading: false,
  error: null,
  searchRadius: 5,

  fetchNearbyUsers: async (latitude, longitude) => {
    set({ isLoading: true, error: null });
    try {
      const users = await fetchNearbyUsersFromAPI(latitude, longitude, 5); // 5km radius
      
      set({ 
        users,
        nearbyUsers: users,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: (error as Error).message 
      });
    }
  },

  updateSearchRadius: (radius) => {
    set({ searchRadius: radius });
  },

  rateUser: async (userId, rating) => {
    set({ isLoading: true });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => {
        const users = state.users.map(user =>
          user.id === userId
            ? {
                ...user,
                rating: {
                  average: (user.rating.average * user.rating.count + rating) / (user.rating.count + 1),
                  count: user.rating.count + 1
                }
              }
            : user
        );
        
        return {
          users,
          nearbyUsers: users,
          isLoading: false
        };
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: (error as Error).message 
      });
    }
  }
}));