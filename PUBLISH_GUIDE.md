# 📦 Publishing Guide for @techalphamatrix/expo-universal-auth

This guide explains how to complete and publish the npm package.

## 🏗️ Current Package Structure

```
expo-universal-auth-lib/
├── src/
│   ├── types.ts                 ✅ Complete
│   ├── utils/
│   │   └── config.ts           ✅ Complete
│   ├── providers/
│   │   └── supabase.ts         ✅ Complete
│   └── index.ts                🔄 Needs completion
├── package.json                ✅ Complete
├── tsconfig.json              ✅ Complete
├── rollup.config.js           ✅ Complete
├── README.md                  ✅ Complete
├── LICENSE                    ✅ Complete
├── .gitignore                ✅ Complete
└── .npmignore                ✅ Complete
```

## 🚧 What Still Needs to Be Done

### 1. Complete Missing Files

You still need to create these files (copy from your original auth module):

```bash
# Context and hooks
src/context/AuthContext.tsx

# UI Components
src/components/GoogleLogin.tsx
src/components/AppleLogin.tsx

# Additional providers (if desired)
src/providers/firebase.ts

# Utilities
src/utils/factory.ts
```

### 2. Copy Files from Original Project

```bash
# From your expo-google-auth/auth/ directory, copy:
cp ../expo-google-auth/auth/context/AuthContext.tsx ./src/context/
cp ../expo-google-auth/auth/components/GoogleLogin.tsx ./src/components/
cp ../expo-google-auth/auth/components/AppleLogin.tsx ./src/components/
cp ../expo-google-auth/auth/providers/firebase.ts ./src/providers/

# Create the factory utility
# This should export createAuthProvider function
```

### 3. Update Import Paths

After copying files, update all imports to use relative paths:
- `./types` instead of `../types`
- `./utils/config` instead of `../utils/config`
- etc.

## 📋 Pre-Publishing Checklist

### Development Setup

1. **Install Dependencies**:
```bash
cd expo-universal-auth-lib
npm install
```

2. **Build Package**:
```bash
npm run build
```

3. **Test Package Locally**:
```bash
# Link locally for testing
npm link

# In your test project
npm link @techalphamatrix/expo-universal-auth
```

### NPM Publishing Setup

1. **Create NPM Account**:
   - Go to https://www.npmjs.com/signup
   - Create account with username: `techalphamatrix` (or your preferred name)
   - Verify email

2. **Login to NPM**:
```bash
npm login
```

3. **Verify Package Name is Available**:
```bash
npm view @techalphamatrix/expo-universal-auth
# Should return "npm ERR! 404 Not found" if available
```

4. **Update Package Details** (if needed):
   Edit `package.json`:
   - Change organization name if desired
   - Update repository URLs
   - Update author information

## 🚀 Publishing Steps

### 1. First Release (v1.0.0)

```bash
# Ensure everything is built
npm run build

# Check package contents
npm pack --dry-run

# Publish to npm
npm publish --access public
```

### 2. Future Releases

```bash
# Update version (patch/minor/major)
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# Build and publish
npm run build
npm publish
```

## 🧪 Testing the Published Package

### 1. Create Test Project

```bash
npx create-expo-app test-auth-lib
cd test-auth-lib
```

### 2. Install Your Package

```bash
npm install @techalphamatrix/expo-universal-auth
npm install @react-native-google-signin/google-signin @supabase/supabase-js
```

### 3. Test Integration

```tsx
// App.tsx
import { AuthContextProvider, createAuthProvider, createAuthConfig } from '@techalphamatrix/expo-universal-auth';

// Test that imports work and library functions
```

## 📖 Documentation

After publishing, consider:

1. **Create GitHub Repository**:
   - Push code to GitHub
   - Add README, issues template, etc.

2. **Write Documentation**:
   - API documentation
   - Integration guides
   - Migration guides

3. **Create Examples**:
   - Example projects showing usage
   - Different UI framework examples

## 🛠️ Package Maintenance

### Updating Dependencies

```bash
# Check outdated packages
npm outdated

# Update dependencies
npm update

# Update peer dependencies as needed
```

### Monitoring Usage

- Check npm download stats
- Monitor GitHub issues
- Respond to community feedback

## ⚡ Quick Commands Reference

```bash
# Development
npm run build           # Build package
npm run build:watch     # Build in watch mode
npm run typecheck      # Type check only
npm run lint           # Lint code

# Publishing
npm version <type>     # Update version
npm publish           # Publish to npm
npm pack --dry-run    # Preview package contents

# Testing
npm link              # Link for local testing
npm unlink            # Unlink when done testing
```

## 🎯 Success Criteria

Your package is ready when:

- ✅ Builds without errors (`npm run build`)
- ✅ Types are generated (`dist/index.d.ts` exists)
- ✅ All exports work (`import { ... } from '@techalphamatrix/expo-universal-auth'`)
- ✅ Local testing works (`npm link`)
- ✅ Documentation is complete
- ✅ Example usage is provided

---

**🚀 Ready to share your auth library with the world!** 