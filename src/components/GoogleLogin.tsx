import React from 'react';
import { GoogleLoginProps } from '../types';
import { useAuth } from '../context/AuthContext';

/**
 * Google Login Component
 * 
 * Provides Google Sign-In functionality with customizable UI rendering.
 * Uses the authentication context to manage sign-in state and user session.
 */
export function GoogleLogin({
  renderSignInButton,
  renderUserInfo,
  onSuccess,
  onError,
  onSignOut,
}: GoogleLoginProps) {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      if (user) {
        onSuccess?.(user);
      }
    } catch (error) {
      const authError = error instanceof Error ? 
        { message: error.message } : 
        { message: 'Google sign-in failed' };
      onError?.(authError);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onSignOut?.();
    } catch (error) {
      const authError = error instanceof Error ? 
        { message: error.message } : 
        { message: 'Sign-out failed' };
      onError?.(authError);
    }
  };

  // If user is authenticated and renderUserInfo is provided, show user info
  if (user && renderUserInfo) {
    return renderUserInfo({
      user,
      onSignOut: handleSignOut,
    });
  }

  // Otherwise, show sign-in button
  return renderSignInButton({
    onPress: handleSignIn,
    loading,
    disabled: loading,
  });
} 