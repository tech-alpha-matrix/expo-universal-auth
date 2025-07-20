/**
 * Core authentication interfaces and types for Expo Universal Auth
 * @packageDocumentation
 */

/**
 * User information returned by authentication providers
 */
export interface AuthUser {
  /** Unique user identifier */
  id: string;
  /** User email address */
  email?: string;
  /** Display name */
  name?: string;
  /** First name */
  firstName?: string;
  /** Last name */
  lastName?: string;
  /** Full name (combined first and last) */
  fullName?: string;
  /** Profile image URL (alias for avatarUrl) */
  avatar?: string;
  /** Profile image URL */
  avatarUrl?: string;
  /** Profile image URL (Google specific) */
  profileImage?: string;
  /** Phone number */
  phoneNumber?: string;
  /** Whether email is verified */
  emailVerified?: boolean;
  /** Authentication provider used */
  provider?: string;
  /** Additional provider-specific metadata */
  metadata?: Record<string, any>;
}

/**
 * Authentication session containing user and token information
 */
export interface AuthSession {
  /** Access token for API calls */
  accessToken: string;
  /** Refresh token for session renewal */
  refreshToken?: string;
  /** Token expiration timestamp */
  expiresAt?: number;
  /** Authenticated user */
  user: AuthUser;
}

/**
 * Authentication error information
 */
export interface AuthError {
  /** Error message */
  message: string;
  /** Error code */
  code?: string;
  /** Additional error details */
  details?: any;
}

/**
 * Current authentication state
 */
export interface AuthState {
  /** Current user (null if not authenticated) */
  user: AuthUser | null;
  /** Current session (null if not authenticated) */
  session: AuthSession | null;
  /** Whether authentication is in progress */
  loading: boolean;
  /** Current error (null if no error) */
  error: AuthError | null;
}

/**
 * Google Sign-In result
 */
export interface GoogleSignInResult {
  /** User information */
  user: AuthUser;
  /** Authentication tokens */
  tokens: {
    /** ID token */
    idToken: string;
    /** Access token */
    accessToken?: string;
  };
}

/**
 * Apple Sign-In result
 */
export interface AppleSignInResult {
  /** User information */
  user: AuthUser;
  /** Apple credential */
  credential: {
    /** User identifier */
    user: string;
    /** Identity token */
    identityToken: string | null;
    /** Authorization code */
    authorizationCode: string | null;
    /** Email address */
    email: string | null;
    /** Full name components */
    fullName: {
      givenName?: string | null;
      familyName?: string | null;
      middleName?: string | null;
      namePrefix?: string | null;
      nameSuffix?: string | null;
      nickname?: string | null;
    } | null;
    /** Real user status */
    realUserStatus: number;
    /** State parameter */
    state?: string | null;
  };
}

/**
 * Provider-specific configuration
 */
export interface AuthProviderConfig {
  /** Configuration parameters */
  [key: string]: any;
}

/**
 * Authentication provider interface
 */
export interface AuthProvider {
  /** Configure the provider with settings */
  configure(config: AuthProviderConfig): Promise<void>;
  
  /** Sign in with Google */
  signInWithGoogle(): Promise<AuthSession>;
  
  /** Sign in with Apple (iOS only) */
  signInWithApple?(): Promise<AuthSession>;
  
  /** Sign out current user */
  signOut(): Promise<void>;
  
  /** Get current authentication session */
  getCurrentSession(): Promise<AuthSession | null>;
  
  /** Refresh current session */
  refreshSession(): Promise<AuthSession>;
  
  /** Subscribe to authentication state changes */
  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void;
}

/**
 * Supported authentication provider types
 */
export type AuthProviderType = 'supabase' | 'firebase' | 'apple' | 'auth0' | 'custom';

/**
 * Complete authentication configuration
 */
export interface AuthConfig {
  /** Provider type */
  provider: AuthProviderType;
  
  /** Google OAuth configuration */
  google: {
    /** iOS client ID */
    iosClientId: string;
    /** Android client ID */
    androidClientId: string;
    /** Web client ID */
    webClientId: string;
    /** Requested scopes */
    scopes?: string[];
  };
  
  /** Apple Sign-In configuration (iOS only) */
  apple?: {
    /** Requested scopes */
    scopes?: ('fullName' | 'email')[];
    /** Nonce for security */
    nonce?: string;
    /** State parameter */
    state?: string;
  };
  
  /** Supabase configuration */
  supabase?: {
    /** Supabase project URL */
    url: string;
    /** Anonymous/public key */
    anonKey: string;
  };
  
  /** Firebase configuration */
  firebase?: {
    /** Firebase API key */
    apiKey: string;
    /** Auth domain */
    authDomain: string;
    /** Project ID */
    projectId: string;
    /** Storage bucket */
    storageBucket?: string;
    /** Messaging sender ID */
    messagingSenderId?: string;
    /** App ID */
    appId: string;
    /** Measurement ID (Analytics) */
    measurementId?: string;
  };
  
  /** Extensible for additional providers */
  [key: string]: any;
}

/**
 * Google Login component props
 */
export interface GoogleLoginProps {
  /** Render function for sign-in button */
  renderSignInButton: (props: {
    onPress: () => void;
    loading: boolean;
    disabled: boolean;
  }) => any;
  
  /** Render function for authenticated user info */
  renderUserInfo?: (props: {
    user: AuthUser;
    onSignOut: () => void;
  }) => any;
  
  /** Success callback */
  onSuccess?: (user: AuthUser) => void;
  
  /** Error callback */
  onError?: (error: AuthError) => void;
  
  /** Sign out callback */
  onSignOut?: () => void;
}

/**
 * Apple Login component props
 */
export interface AppleLoginProps {
  /** Render function for sign-in button */
  renderSignInButton: (props: {
    onPress: () => void;
    loading: boolean;
    disabled: boolean;
  }) => any;
  
  /** Render function for authenticated user info */
  renderUserInfo?: (props: {
    user: AuthUser;
    onSignOut: () => void;
  }) => any;
  
  /** Success callback */
  onSuccess?: (user: AuthUser) => void;
  
  /** Error callback */
  onError?: (error: AuthError) => void;
  
  /** Sign out callback */
  onSignOut?: () => void;
} 