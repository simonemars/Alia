import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/utils/api';
import { ApiError } from '@/types';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: ApiError | null;
};

type AuthActions = {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  sendSignInLinkToEmail: (email: string) => Promise<void>;
  signInWithEmailLink: (email: string, link: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
};

type AuthStore = AuthState & AuthActions;

const AUTH_TOKEN_KEY = 'auth_token';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<{ token: string; user: User }>('/auth/login', {
            email,
            password,
          });

          if (response.error) {
            throw new Error(response.error.message);
          }

          await SecureStore.setItemAsync(AUTH_TOKEN_KEY, response.data!.token);
          
          set({ 
            isAuthenticated: true, 
            user: response.data!.user,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: {
              message: (error as Error).message,
              code: 'LOGIN_ERROR'
            }
          });
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<{ token: string; user: User }>('/auth/register', {
            name,
            email,
            password,
          });

          if (response.error) {
            throw new Error(response.error.message);
          }

          await SecureStore.setItemAsync(AUTH_TOKEN_KEY, response.data!.token);
          
          set({ 
            isAuthenticated: true, 
            user: response.data!.user,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: {
              message: (error as Error).message,
              code: 'REGISTER_ERROR'
            }
          });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await api.post('/auth/logout', {});
          await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
          set({ 
            isAuthenticated: false, 
            user: null,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: {
              message: (error as Error).message,
              code: 'LOGOUT_ERROR'
            }
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      sendSignInLinkToEmail: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const actionCodeSettings = {
            url: 'https://alia-65f2e.firebaseapp.com/finishSignIn',
            handleCodeInApp: true,
            iOS: {
              bundleId: 'com.yourcompany.alia'
            },
            dynamicLinkDomain: process.env.FIREBASE_DYNAMIC_LINKS_DOMAIN
          };

          await auth.sendSignInLinkToEmail(email, actionCodeSettings);
          
          // Save the email locally so you don't need to ask the user for it again
          await SecureStore.setItemAsync('emailForSignIn', email);
          
          set({ isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: {
              message: (error as Error).message,
              code: 'EMAIL_LINK_ERROR'
            }
          });
        }
      },

      signInWithEmailLink: async (email: string, link: string) => {
        set({ isLoading: true, error: null });
        try {
          if (auth.isSignInWithEmailLink(link)) {
            const result = await auth.signInWithEmailLink(email, link);
            
            if (result.user) {
              set({ 
                isAuthenticated: true, 
                user: {
                  id: result.user.uid,
                  email: result.user.email || '',
                  name: result.user.displayName || ''
                },
                isLoading: false 
              });
            }
          } else {
            throw new Error('Invalid sign in link');
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: {
              message: (error as Error).message,
              code: 'EMAIL_LINK_SIGN_IN_ERROR'
            }
          });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
          if (!token) {
            set({ isAuthenticated: false, user: null, isLoading: false });
            return;
          }

          const response = await api.get<{ user: User }>('/auth/me');
          if (response.error) {
            throw new Error(response.error.message);
          }

          set({ 
            isAuthenticated: true, 
            user: response.data!.user,
            isLoading: false 
          });
        } catch (error) {
          await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
          set({ 
            isAuthenticated: false, 
            user: null,
            isLoading: false,
            error: {
              message: (error as Error).message,
              code: 'AUTH_CHECK_ERROR'
            }
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state: AuthState) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
      storage: {
        getItem: async (name: string): Promise<string | null> => {
          return await SecureStore.getItemAsync(name);
        },
        setItem: async (name: string, value: string): Promise<void> => {
          await SecureStore.setItemAsync(name, value);
        },
        removeItem: async (name: string): Promise<void> => {
          await SecureStore.deleteItemAsync(name);
        },
      },
    }
  )
);