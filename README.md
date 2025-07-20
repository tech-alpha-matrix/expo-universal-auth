# 🔐 Expo Universal Auth

[![npm version](https://badge.fury.io/js/%40techalphamatrix%2Fexpo-universal-auth.svg)](https://badge.fury.io/js/%40techalphamatrix%2Fexpo-universal-auth)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-blue)](https://expo.dev)

Universal authentication library for **Expo/React Native** with **Google Sign-In**, **Apple Sign-In** and support for multiple backend providers (**Supabase**, **Firebase**).

## ✨ Features

- 🔐 **Multiple Auth Providers**: Google, Apple Sign-In
- 🏗️ **Multiple Backends**: Supabase, Firebase support
- 🎨 **UI-Agnostic**: Bring your own components
- 📱 **Cross-Platform**: iOS, Android, Web
- 🔒 **TypeScript**: Full type safety
- 🎯 **Production Ready**: Used in real-world applications
- 📖 **Well Documented**: Comprehensive guides and examples

## 📦 Installation

**Simple one-command installation - all dependencies included!**

```bash
npm install @techalphamatrix/expo-universal-auth
```

**That's it!** All required dependencies are automatically installed:
- ✅ `@react-native-google-signin/google-signin` (Google OAuth)
- ✅ `@supabase/supabase-js` (Supabase backend)
- ✅ `firebase` (Firebase backend)
- ✅ `expo-apple-authentication` (Apple Sign-In)

No need to install anything else! 🎉```

## 🚀 Quick Start

### 1. Configure your app.json

```json
{
  "expo": {
    "plugins": [
      [
        "@react-native-google-signin/google-signin",
        {
          "iosClientId": "your-ios-client-id.apps.googleusercontent.com",
          "webClientId": "your-web-client-id.apps.googleusercontent.com",
          "iosUrlScheme": "com.googleusercontent.apps.your-ios-client-id"
        }
      ],
      ["expo-apple-authentication"]
    ],
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp",
      "usesAppleSignIn": true
    }
  }
}
```

### 2. Set up environment variables

```env
# Provider
EXPO_PUBLIC_AUTH_PROVIDER=supabase

# Google OAuth
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com

# Supabase (if using Supabase)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Wrap your app with AuthContextProvider

```tsx
// App.tsx or _layout.tsx
import { AuthContextProvider, createAuthProvider, createAuthConfig } from '@techalphamatrix/expo-universal-auth';

const authProvider = createAuthProvider('supabase');
const authConfig = createAuthConfig();

export default function App() {
  return (
    <AuthContextProvider 
      provider={authProvider} 
      config={authConfig}
      onAuthError={(error) => console.error('Auth Error:', error)}
    >
      <YourApp />
    </AuthContextProvider>
  );
}
```

### 4. Use authentication in your components

```tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { GoogleLogin, AppleLogin, useAuth } from '@techalphamatrix/expo-universal-auth';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

export default function LoginScreen() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <Text>Loading...</Text>;

  if (isAuthenticated) {
    return (
      <View>
        <Text>Welcome, {user.fullName}!</Text>
        <Text>{user.email}</Text>
      </View>
    );
  }

  return (
    <View>
      <GoogleLogin
        renderSignInButton={({ onPress, loading, disabled }) => (
          <GoogleSigninButton
            onPress={onPress}
            disabled={disabled}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
          />
        )}
        onSuccess={(user) => console.log('Google sign-in successful:', user)}
        onError={(error) => console.error('Google sign-in error:', error)}
      />
      
      {Platform.OS === 'ios' && (
        <AppleLogin
          renderSignInButton={({ onPress, loading }) => (
            <Button title="Sign In with Apple" onPress={onPress} />
          )}
          onSuccess={(user) => console.log('Apple sign-in successful:', user)}
          onError={(error) => console.error('Apple sign-in error:', error)}
        />
      )}
    </View>
  );
}
```

## 🔧 Manual Configuration (Alternative)

You can also configure manually instead of using environment variables:

```tsx
import { createAuthConfig, createAuthProvider, AuthContextProvider } from '@techalphamatrix/expo-universal-auth';

const authConfig = createAuthConfig({
  provider: 'supabase',
  google: {
    iosClientId: 'your-ios-client-id.apps.googleusercontent.com',
    androidClientId: 'your-android-client-id.apps.googleusercontent.com',
    webClientId: 'your-web-client-id.apps.googleusercontent.com',
  },
  supabase: {
    url: 'https://your-project.supabase.co',
    anonKey: 'your-anon-key',
  },
});

const authProvider = createAuthProvider('supabase');

export default function App() {
  return (
    <AuthContextProvider provider={authProvider} config={authConfig}>
      <YourApp />
    </AuthContextProvider>
  );
}
```

## 🎨 UI Framework Examples

The library is **UI-agnostic** and works with any design system:

### React Native Elements

```tsx
<GoogleLogin
  renderSignInButton={({ onPress, loading }) => (
    <Button
      title="Sign In with Google"
      onPress={onPress}
      loading={loading}
      icon={{ name: 'google', type: 'font-awesome' }}
    />
  )}
/>
```

### NativeBase

```tsx
<GoogleLogin
  renderSignInButton={({ onPress, loading }) => (
    <Button onPress={onPress} isLoading={loading}>
      Sign In with Google
    </Button>
  )}
/>
```

### Tamagui

```tsx
<GoogleLogin
  renderSignInButton={({ onPress, loading }) => (
    <Button onPress={onPress} disabled={loading}>
      Sign In with Google
    </Button>
  )}
/>
```

## 🍎 Apple Sign-In Setup

Apple Sign-In requires additional setup. See our comprehensive guide:
**[Apple + Supabase Complete Setup Guide](./docs/APPLE_SETUP.md)**

### Quick Apple Setup:

1. **Apple Developer Console**: Create Service ID and configure Sign In with Apple
2. **Supabase Dashboard**: Configure Apple provider with Service ID and private key
3. **Your App**: Add Apple Authentication plugin to app.json

```typescript
// Service ID format (NOT Bundle ID)
Client IDs: com.yourcompany.yourapp.services
```

## 🔄 Switch Providers

To switch from Supabase to Firebase:

```env
# Change provider
EXPO_PUBLIC_AUTH_PROVIDER=firebase

# Add Firebase config
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

No code changes needed! The library automatically uses the correct provider.

## 📖 API Reference

### `useAuth` Hook

```typescript
const {
  user,              // Current user (null if not authenticated)
  session,           // Current session
  isAuthenticated,   // Boolean authentication status
  loading,           // Loading state
  error,             // Current error
  signInWithGoogle,  // Google sign-in method
  signInWithApple,   // Apple sign-in method (iOS only)
  signOut,           // Sign out method
} = useAuth();
```

### `GoogleLogin` Component

```typescript
<GoogleLogin
  renderSignInButton={({ onPress, loading, disabled }) => JSX.Element}
  renderUserInfo={({ user, onSignOut }) => JSX.Element}
  onSuccess={(user: AuthUser) => void}
  onError={(error: AuthError) => void}
  onSignOut={() => void}
/>
```

### `AppleLogin` Component

```typescript
<AppleLogin
  renderSignInButton={({ onPress, loading, disabled }) => JSX.Element}
  renderUserInfo={({ user, onSignOut }) => JSX.Element}
  onSuccess={(user: AuthUser) => void}
  onError={(error: AuthError) => void}
  onSignOut={() => void}
/>
```

## 🛠️ Development Build Required

This library requires a **development build** (not Expo Go) because it uses native modules:

```bash
# Install EAS CLI
npm install -g eas-cli

# Build development client
eas build --profile development --platform ios
eas build --profile development --platform android

# Install and run
npx expo start --dev-client
```

## 📚 Documentation

- **[Apple Setup Guide](./docs/APPLE_SETUP.md)** - Complete Apple Authentication setup
- **[Native Modules Guide](./docs/NATIVE_MODULES.md)** - Development build and troubleshooting
- **[Integration Examples](./docs/INTEGRATION.md)** - Real-world usage examples
- **[Migration Guide](./docs/MIGRATION.md)** - Upgrade from other auth libraries

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🏢 About

Created by **TechAlphaMatrix** for the Expo/React Native community.

- 🌐 **Website**: [techalphamatrix.com](https://techalphamatrix.com)
- 📧 **Email**: contact@techalphamatrix.com
- 🐦 **Twitter**: [@techalphamatrix](https://twitter.com/techalphamatrix)

---

**⭐ If this library helps you, please give it a star!** 