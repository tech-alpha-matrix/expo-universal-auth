import { AuthConfig, AuthProviderType } from '../types';

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  google: {
    scopes: ['profile', 'email'],
  },
  apple: {
    scopes: ['fullName', 'email'] as ('fullName' | 'email')[],
  },
};

/**
 * Gets environment variable with optional fallback
 */
const getEnvVar = (key: string, fallback?: string): string => {
  // @ts-ignore - process.env will be available in React Native/Expo
  const value = (typeof process !== 'undefined' && process.env) ? process.env[key] : undefined;
  if (!value && !fallback) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value || fallback || '';
};

/**
 * Creates authentication configuration from environment variables or manual config
 * 
 * Expected environment variables:
 * - EXPO_PUBLIC_AUTH_PROVIDER: 'supabase' | 'firebase' | 'auth0' | 'custom'
 * - EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: iOS client ID for Google OAuth
 * - EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID: Android client ID for Google OAuth
 * - EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: Web client ID for Google OAuth
 * - EXPO_PUBLIC_SUPABASE_URL: Supabase project URL (if using Supabase)
 * - EXPO_PUBLIC_SUPABASE_ANON_KEY: Supabase anon key (if using Supabase)
 * - EXPO_PUBLIC_FIREBASE_API_KEY: Firebase API key (if using Firebase)
 * - EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: Firebase auth domain (if using Firebase)
 * - EXPO_PUBLIC_FIREBASE_PROJECT_ID: Firebase project ID (if using Firebase)
 * - EXPO_PUBLIC_FIREBASE_APP_ID: Firebase app ID (if using Firebase)
 */
export const createAuthConfig = (manualConfig?: Partial<AuthConfig>): AuthConfig => {
  // If manual config is provided with all required fields, use it
  if (manualConfig && manualConfig.provider && manualConfig.google?.iosClientId) {
      return {
    google: {
      scopes: DEFAULT_CONFIG.google.scopes,
      ...manualConfig.google,
    },
    apple: {
      scopes: DEFAULT_CONFIG.apple.scopes,
      ...manualConfig.apple,
    },
    ...manualConfig,
  } as AuthConfig;
  }

  // Otherwise, create from environment variables
  const provider = (getEnvVar('EXPO_PUBLIC_AUTH_PROVIDER', 'supabase')) as AuthProviderType;
  
  const baseConfig: AuthConfig = {
    provider,
    google: {
      iosClientId: getEnvVar('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID'),
      androidClientId: getEnvVar('EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID'),
      webClientId: getEnvVar('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID'),
      scopes: DEFAULT_CONFIG.google.scopes,
      ...manualConfig?.google,
    },
    apple: {
      scopes: DEFAULT_CONFIG.apple.scopes,
      // @ts-ignore - process.env will be available in React Native/Expo
      nonce: (typeof process !== 'undefined' && process.env) ? process.env.EXPO_PUBLIC_APPLE_NONCE : undefined,
      // @ts-ignore - process.env will be available in React Native/Expo
      state: (typeof process !== 'undefined' && process.env) ? process.env.EXPO_PUBLIC_APPLE_STATE : undefined,
      ...manualConfig?.apple,
    },
  };

  // Add provider-specific configuration
  switch (provider) {
    case 'supabase':
      baseConfig.supabase = {
        url: getEnvVar('EXPO_PUBLIC_SUPABASE_URL'),
        anonKey: getEnvVar('EXPO_PUBLIC_SUPABASE_ANON_KEY'),
        ...manualConfig?.supabase,
      };
      break;
      
    case 'firebase':
      baseConfig.firebase = {
        apiKey: getEnvVar('EXPO_PUBLIC_FIREBASE_API_KEY'),
        authDomain: getEnvVar('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
        projectId: getEnvVar('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
        appId: getEnvVar('EXPO_PUBLIC_FIREBASE_APP_ID'),
        // @ts-ignore - process.env will be available in React Native/Expo
        storageBucket: (typeof process !== 'undefined' && process.env) ? process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET : undefined,
        // @ts-ignore - process.env will be available in React Native/Expo
        messagingSenderId: (typeof process !== 'undefined' && process.env) ? process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID : undefined,
        // @ts-ignore - process.env will be available in React Native/Expo
        measurementId: (typeof process !== 'undefined' && process.env) ? process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID : undefined,
        ...manualConfig?.firebase,
      };
      break;
      
    // Add cases for other providers
    default:
      break;
  }

  return {
    ...baseConfig,
    ...manualConfig,
  };
};

/**
 * Validates that all required configuration is present
 */
export const validateAuthConfig = (config: AuthConfig): void => {
  if (!config.provider) {
    throw new Error('Auth provider must be specified');
  }

  if (!config.google.iosClientId || !config.google.webClientId) {
    throw new Error('Google OAuth client IDs (iOS and Web) are required');
  }

  switch (config.provider) {
    case 'supabase':
      if (!config.supabase?.url || !config.supabase?.anonKey) {
        throw new Error('Supabase URL and anon key are required when using Supabase provider');
      }
      break;
      
    case 'firebase':
      if (!config.firebase?.apiKey || !config.firebase?.projectId) {
        throw new Error('Firebase API key and project ID are required when using Firebase provider');
      }
      break;
  }
};

/**
 * Example configurations for different providers
 */

export const EXAMPLE_CONFIGS = {
  supabase: {
    provider: 'supabase' as AuthProviderType,
    google: {
      iosClientId: 'your-ios-client-id.apps.googleusercontent.com',
      androidClientId: 'your-android-client-id.apps.googleusercontent.com',
      webClientId: 'your-web-client-id.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    },
    apple: {
      scopes: ['fullName', 'email'] as ('fullName' | 'email')[],
    },
    supabase: {
      url: 'https://your-project.supabase.co',
      anonKey: 'your-anon-key',
    },
  },

  firebase: {
    provider: 'firebase' as AuthProviderType,
    google: {
      iosClientId: 'your-ios-client-id.apps.googleusercontent.com',
      androidClientId: 'your-android-client-id.apps.googleusercontent.com',
      webClientId: 'your-web-client-id.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    },
    apple: {
      scopes: ['fullName', 'email'] as ('fullName' | 'email')[],
    },
    firebase: {
      apiKey: 'your-api-key',
      authDomain: 'your-project.firebaseapp.com',
      projectId: 'your-project-id',
      appId: '1:123456789:web:abcdef123456',
    },
  },
}; 