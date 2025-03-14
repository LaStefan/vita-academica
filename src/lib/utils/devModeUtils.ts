
import { User, UserCredential } from 'firebase/auth';

/**
 * Simple utility to create a delay in asynchronous operations
 * for simulating network requests in development mode
 */
export const simulateAsyncOperation = <T>(result: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(result);
    }, 500); // 500ms delay to simulate network request
  });
};

/**
 * Get a consistent user ID for mocking purposes
 */
export const getMockUserId = (): string => {
  return 'dev-user-123456789';
};

/**
 * Log development mode warning to console
 */
export const logDevModeWarning = (feature: string): void => {
  console.warn(
    `🚧 Development Mode: ${feature} is bypassed. Firebase credentials not set.` +
    `\n   📝 To enable real Firebase services, update firebase config in src/lib/firebase/config.ts`
  );
};

/**
 * Get a mock user object for development mode
 */
export const getMockUser = (): User => {
  return {
    uid: getMockUserId(),
    email: 'dev@example.com',
    displayName: 'Development User',
    photoURL: null,
    emailVerified: true,
    isAnonymous: false,
    metadata: {
      creationTime: Date.now().toString(),
      lastSignInTime: Date.now().toString()
    },
    providerData: [],
    refreshToken: 'mock-refresh-token',
    tenantId: null,
    delete: () => Promise.resolve(),
    getIdToken: () => Promise.resolve('mock-id-token'),
    getIdTokenResult: () => Promise.resolve({
      token: 'mock-id-token',
      authTime: new Date().toISOString(),
      expirationTime: new Date(Date.now() + 3600000).toISOString(),
      issuedAtTime: new Date().toISOString(),
      signInProvider: 'password',
      signInSecondFactor: null,
      claims: {}
    }),
    reload: () => Promise.resolve(),
    toJSON: () => ({ uid: getMockUserId() }),
    phoneNumber: null,
    providerId: 'password'
  };
};

/**
 * Get a mock user credential for development mode
 */
export const getMockUserCredential = (): UserCredential => {
  return {
    user: getMockUser(),
    providerId: 'password',
    operationType: 'signIn'
  };
};
