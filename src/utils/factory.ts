import { SupabaseAuthProvider } from '../providers/supabase';
import { AuthProvider, AuthProviderType } from '../types';

/**
 * Factory function to create authentication providers
 * 
 * @param providerType - The type of provider to create
 * @returns Configured authentication provider instance
 */
export function createAuthProvider(providerType: AuthProviderType): AuthProvider {
  switch (providerType) {
    case 'supabase':
      return new SupabaseAuthProvider();
      
    case 'firebase':
      // TODO: Implement Firebase provider
      throw new Error('Firebase provider not yet implemented. Use Supabase provider for now.');
      
    case 'auth0':
      // TODO: Implement Auth0 provider
      throw new Error('Auth0 provider not yet implemented. Use Supabase provider for now.');
      
    case 'custom':
      // TODO: Allow custom provider implementations
      throw new Error('Custom provider not yet implemented. Use Supabase provider for now.');
      
    default:
      throw new Error(`Unsupported auth provider: ${providerType}. Supported providers: supabase`);
  }
} 