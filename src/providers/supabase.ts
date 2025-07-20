import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import {
    AuthConfig,
    AuthProvider,
    AuthProviderConfig,
    AuthSession,
    AuthUser
} from '../types';

// Type definitions for optional dependencies
interface SupabaseClient {
  auth: {
    signInWithIdToken: (params: { provider: string; token: string; nonce?: string }) => Promise<{ data: { session: any }, error: any }>;
    signOut: () => Promise<{ error: any }>;
    getSession: () => Promise<{ data: { session: any }, error: any }>;
    refreshSession: () => Promise<{ data: { session: any }, error: any }>;
    onAuthStateChange: (callback: (event: string, session: any) => void) => { data: { subscription: { unsubscribe: () => void } } };
  };
}

interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: SupabaseUser;
}

interface SupabaseUser {
  id: string;
  email?: string;
  phone?: string;
  user_metadata?: any;
  app_metadata?: any;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  last_sign_in_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Dynamic imports for optional dependencies
let supabaseLib: any = null;
let AppleAuthentication: any = null;

try {
  supabaseLib = require('@supabase/supabase-js');
} catch (error) {
  // @supabase/supabase-js not installed
}

try {
  if (Platform.OS === 'ios') {
    AppleAuthentication = require('expo-apple-authentication');
  }
} catch (error) {
  // expo-apple-authentication not available
}

/**
 * Supabase authentication provider
 * 
 * Supports:
 * - Google Sign-In
 * - Apple Sign-In (iOS only)
 * - Session management
 * - Automatic token refresh
 */
export class SupabaseAuthProvider implements AuthProvider {
  private client: SupabaseClient | null = null;
  private authStateCallback: ((session: AuthSession | null) => void) | null = null;
  private unsubscribe: (() => void) | null = null;

  async configure(config: AuthProviderConfig): Promise<void> {
    if (!supabaseLib) {
      throw new Error('@supabase/supabase-js is required but not installed. Please run: npm install @supabase/supabase-js');
    }

    const authConfig = config as AuthConfig;
    
    if (!authConfig.supabase) {
      throw new Error('Supabase configuration is required');
    }

    // Initialize Supabase client
    this.client = supabaseLib.createClient(
      authConfig.supabase.url,
      authConfig.supabase.anonKey
    );

    // Configure Google Sign-In
    await GoogleSignin.configure({
      scopes: authConfig.google.scopes || ['profile', 'email'],
      iosClientId: authConfig.google.iosClientId,
      webClientId: authConfig.google.webClientId,
      // Android client ID is automatically handled when configured in app.json
    });
  }

  async signInWithGoogle(): Promise<AuthSession> {
    if (!this.client) {
      throw new Error('SupabaseAuthProvider not configured. Call configure() first.');
    }

    try {
      // Check Google Play Services
      await GoogleSignin.hasPlayServices();
      
      // Perform Google Sign-In
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens.idToken;

      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      // Authenticate with Supabase using the Google ID token
      const { data, error } = await this.client.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        throw new Error(`Supabase authentication failed: ${error.message}`);
      }

      if (!data.session) {
        throw new Error('No session returned from Supabase');
      }

      return this.transformSession(data.session);
    } catch (error: any) {
      // Handle specific Google Sign-In errors
      if (error.code === '12501') {
        throw new Error('Google Sign-In was cancelled');
      }
      
      throw error;
    }
  }

  async signInWithApple(): Promise<AuthSession> {
    if (!this.client) {
      throw new Error('SupabaseAuthProvider not configured. Call configure() first.');
    }

    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign-In is only available on iOS');
    }

    if (!AppleAuthentication) {
      throw new Error('expo-apple-authentication is not installed. Please install it to use Apple Sign-In: npx expo install expo-apple-authentication');
    }

    try {
      // Check if Apple Authentication is available
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Apple Authentication is not available on this device');
      }

      // Sign in with Apple
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('No identity token received from Apple');
      }

      // Sign in to Supabase with Apple credential
      const { data, error } = await this.client.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
        nonce: credential.state || undefined,
      });

      if (error) {
        throw new Error(`Failed to sign in with Apple: ${error.message}`);
      }

      if (!data.session) {
        throw new Error('No session returned from Supabase');
      }

      return this.transformSession(data.session);
    } catch (error: any) {
      // Handle Apple-specific errors
      if (error.code === 'ERR_REQUEST_CANCELED') {
        throw new Error('Apple Sign-In was cancelled by the user');
      }
      
      throw error;
    }
  }

  async signOut(): Promise<void> {
    if (!this.client) {
      throw new Error('SupabaseAuthProvider not configured');
    }

    try {
      // Sign out from Google
      await GoogleSignin.signOut();
      
      // Sign out from Supabase
      const { error } = await this.client.auth.signOut();
      if (error) {
        throw new Error(`Failed to sign out: ${error.message}`);
      }
    } catch (error: any) {
      throw error;
    }
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    if (!this.client) {
      throw new Error('SupabaseAuthProvider not configured');
    }

    const { data: { session }, error } = await this.client.auth.getSession();
    
    if (error) {
      throw new Error(`Failed to get session: ${error.message}`);
    }

    return session ? this.transformSession(session) : null;
  }

  async refreshSession(): Promise<AuthSession> {
    if (!this.client) {
      throw new Error('SupabaseAuthProvider not configured');
    }

    const { data, error } = await this.client.auth.refreshSession();
    
    if (error) {
      throw new Error(`Failed to refresh session: ${error.message}`);
    }

    if (!data.session) {
      throw new Error('No session returned after refresh');
    }

    return this.transformSession(data.session);
  }

  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void {
    if (!this.client) {
      throw new Error('SupabaseAuthProvider not configured');
    }

    // Store callback for cleanup
    this.authStateCallback = callback;

    // Subscribe to auth state changes
    const { data: { subscription } } = this.client.auth.onAuthStateChange(
      (event, session) => {
        const transformedSession = session ? this.transformSession(session) : null;
        callback(transformedSession);
      }
    );

    // Store unsubscribe function
    this.unsubscribe = () => subscription.unsubscribe();

    return this.unsubscribe;
  }

  /**
   * Transforms Supabase Session to AuthSession
   */
  private transformSession(session: SupabaseSession): AuthSession {
    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at,
      user: this.transformUser(session.user),
    };
  }

  /**
   * Transforms Supabase User to AuthUser
   */
  private transformUser(user: SupabaseUser): AuthUser {
    const userMeta = user.user_metadata || {};
    const appMeta = user.app_metadata || {};
    
    return {
      id: user.id,
      email: user.email,
      name: userMeta.name || userMeta.full_name,
      firstName: userMeta.given_name,
      lastName: userMeta.family_name,
      fullName: userMeta.full_name || userMeta.name,
      avatar: userMeta.avatar_url || userMeta.picture,
      avatarUrl: userMeta.avatar_url,
      profileImage: userMeta.picture,
      phoneNumber: user.phone,
      emailVerified: user.email_confirmed_at != null,
      provider: appMeta.provider || 'supabase',
      metadata: {
        ...userMeta,
        provider: appMeta.provider,
        providers: appMeta.providers,
        lastSignIn: user.last_sign_in_at,
        emailVerified: user.email_confirmed_at != null,
        phoneVerified: user.phone_confirmed_at != null,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    } as AuthUser;
  }

  /**
   * Cleanup method to unsubscribe from auth state changes
   */
  cleanup(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.authStateCallback = null;
  }
} 