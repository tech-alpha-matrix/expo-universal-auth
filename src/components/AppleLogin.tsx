import React from 'react';
import { Platform } from 'react-native';
import { AppleLoginProps } from '../types';
import { useAuth } from '../context/AuthContext';

/**
 * Apple Login Component
 * 
 * Provides Apple Sign-In functionality with customizable UI rendering.
 * Only available on iOS platform. Uses the authentication context to manage sign-in state.
 */
export function AppleLogin({
  renderSignInButton,
  renderUserInfo,
  onSuccess,
  onError,
  onSignOut,
}: AppleLoginProps) {
  const { user, loading, signInWithApple, signOut } = useAuth();

  const handleSignIn = async () => {
    if (Platform.OS !== 'ios') {
      const error = { message: 'Apple Sign-In is only available on iOS devices' };
      onError?.(error);
      return;
    }

    try {
      await signInWithApple();
      if (user) {
        onSuccess?.(user);
      }
    } catch (error) {
      const authError = error instanceof Error ? 
        { message: error.message } : 
        { message: 'Apple sign-in failed' };
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

  // Otherwise, show sign-in button (disabled on non-iOS platforms)
  return renderSignInButton({
    onPress: handleSignIn,
    loading,
    disabled: loading || Platform.OS !== 'ios',
  });
} 