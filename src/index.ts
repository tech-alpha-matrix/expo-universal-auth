/**
 * @fileoverview Expo Universal Auth - Main entry point
 * 
 * Universal authentication library for Expo/React Native with support for:
 * - Google Sign-In
 * - Apple Sign-In (iOS)
 * - Multiple backend providers (Supabase, Firebase)
 * - UI-agnostic components
 * - TypeScript support
 */

// Configuration utilities
export { EXAMPLE_CONFIGS, createAuthConfig, validateAuthConfig } from './utils/config';

// Providers
export { SupabaseAuthProvider } from './providers/supabase';

// Context and Hooks
export { AuthContextProvider, useAuth } from './context/AuthContext';

// Components  
export { AppleLogin } from './components/AppleLogin';
export { GoogleLogin } from './components/GoogleLogin';

// Provider factory
export { createAuthProvider } from './utils/factory';

// Re-export commonly used types for convenience
export type {
    AppleLoginProps, AuthConfig, AuthError, AuthProvider, AuthProviderType, AuthSession, AuthState, AuthUser, GoogleLoginProps
} from './types';
