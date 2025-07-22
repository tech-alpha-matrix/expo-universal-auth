import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import {
    AuthConfig,
    AuthError,
    AuthProvider,
    AuthSession,
    AuthState,
    AuthUser
} from '../types';

interface AuthContextType extends AuthState {
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export interface AuthContextProps {
  provider: AuthProvider;
  config: AuthConfig;
  onAuthError?: (error: AuthError) => void;
  children: React.ReactNode;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: AuthUser; session: AuthSession } }
  | { type: 'AUTH_ERROR'; payload: AuthError }
  | { type: 'AUTH_SIGNOUT' }
  | { type: 'CLEAR_ERROR' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        user: action.payload.user,
        session: action.payload.session,
        loading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        user: null,
        session: null,
        loading: false,
        error: action.payload,
      };
    case 'AUTH_SIGNOUT':
      return {
        user: null,
        session: null,
        loading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthContextProvider({ provider, config, onAuthError, children }: AuthContextProps) {
  const initialState: AuthState = {
    user: null,
    session: null,
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | null = null;

    const initializeAuth = async () => {
      try {
        await provider.configure(config);
        
        const currentSession = await provider.getCurrentSession();
        if (currentSession && isMounted) {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: currentSession.user, session: currentSession },
          });
        } else if (isMounted) {
          dispatch({ type: 'AUTH_SIGNOUT' });
        }

        unsubscribe = provider.onAuthStateChange((session) => {
          if (!isMounted) return;
          
          if (session) {
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: { user: session.user, session },
            });
          } else {
            dispatch({ type: 'AUTH_SIGNOUT' });
          }
        });
      } catch (error) {
        if (isMounted) {
          const authError = error instanceof Error ? 
            { message: error.message } : 
            { message: 'Failed to initialize authentication' };
          dispatch({ type: 'AUTH_ERROR', payload: authError });
          onAuthError?.(authError);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [provider, config, onAuthError]);

  const signInWithGoogle = useCallback(async () => {
    dispatch({ type: 'AUTH_START' });
    try {
      const session = await provider.signInWithGoogle();
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: session.user, session },
      });
    } catch (error) {
      const authError = error instanceof Error ? 
        { message: error.message } : 
        { message: 'Google sign-in failed' };
      dispatch({ type: 'AUTH_ERROR', payload: authError });
      onAuthError?.(authError);
      throw error;
    }
  }, [provider, onAuthError]);

  const signInWithApple = useCallback(async () => {
    if (!provider.signInWithApple) {
      const error = { message: 'Apple Sign-In not supported by this provider' };
      dispatch({ type: 'AUTH_ERROR', payload: error });
      onAuthError?.(error);
      throw new Error(error.message);
    }

    dispatch({ type: 'AUTH_START' });
    try {
      const session = await provider.signInWithApple();
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: session.user, session },
      });
    } catch (error) {
      const authError = error instanceof Error ? 
        { message: error.message } : 
        { message: 'Apple sign-in failed' };
      dispatch({ type: 'AUTH_ERROR', payload: authError });
      onAuthError?.(authError);
      throw error;
    }
  }, [provider, onAuthError]);

  const signOut = useCallback(async () => {
    dispatch({ type: 'AUTH_START' });
    try {
      await provider.signOut();
      dispatch({ type: 'AUTH_SIGNOUT' });
    } catch (error) {
      const authError = error instanceof Error ? 
        { message: error.message } : 
        { message: 'Sign-out failed' };
      dispatch({ type: 'AUTH_ERROR', payload: authError });
      onAuthError?.(authError);
      throw error;
    }
  }, [provider, onAuthError]);

  const refreshSession = useCallback(async () => {
    if (!state.session) {
      throw new Error('No session to refresh');
    }

    try {
      const newSession = await provider.refreshSession();
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: newSession.user, session: newSession },
      });
    } catch (error) {
      const authError = error instanceof Error ? 
        { message: error.message } : 
        { message: 'Session refresh failed' };
      dispatch({ type: 'AUTH_ERROR', payload: authError });
      onAuthError?.(authError);
      throw error;
    }
  }, [provider, state.session, onAuthError]);

  const value: AuthContextType = {
    ...state,
    isAuthenticated: !!state.user && !!state.session,
    signInWithGoogle,
    signInWithApple,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
} 