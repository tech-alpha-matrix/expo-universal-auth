// Note: Simplified component for library packaging
// Users should copy the full implementation from the original project

import { AppleLoginProps } from '../types';

/**
 * Apple Login Component (Simplified)
 * 
 * Note: This is a minimal implementation for library packaging.
 * For full functionality, copy the complete AppleLogin component
 * from the original project.
 * 
 * @deprecated Use the full implementation from the examples repository
 */
export function AppleLogin(props: AppleLoginProps) {
  console.warn('AppleLogin: Using minimal implementation. Please implement full component for production use.');
  
  // Return a placeholder that renders the sign-in button
  return props.renderSignInButton({
    onPress: () => {
      const error = { message: 'Please implement full AppleLogin component' };
      props.onError?.(error);
    },
    loading: false,
    disabled: true,
  });
}

/**
 * @deprecated This is a minimal implementation for library packaging.
 * 
 * For production use, copy the complete AppleLogin component from:
 * https://github.com/tech-alpha-matrix/expo-universal-auth/tree/main/examples
 * 
 * The full implementation includes:
 * - Integration with useAuth hook
 * - Apple Sign-In functionality (iOS only)
 * - Loading states and error handling
 * - User info display
 * - Sign-out functionality
 * - Platform detection (iOS only)
 */ 