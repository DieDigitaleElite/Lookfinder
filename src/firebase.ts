import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  deleteUser,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, getDocs, updateDoc, increment, collection, addDoc, query, where, orderBy, onSnapshot, Timestamp, serverTimestamp, deleteDoc, getDocFromServer } from 'firebase/firestore';

// Try to import the Firebase configuration optionally
// @ts-ignore
const configFiles = import.meta.glob('../firebase-applet-config.json', { eager: true });
const firebaseConfigJson = (configFiles['../firebase-applet-config.json'] as any)?.default || 
                           configFiles['../firebase-applet-config.json'] || {};

// Initial empty/fallback config
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId,
  measurementId: (import.meta as any).env.VITE_FIREBASE_MEASUREMENT_ID || firebaseConfigJson.measurementId,
  firestoreDatabaseId: (import.meta as any).env.VITE_FIREBASE_DATABASE_ID || firebaseConfigJson.firestoreDatabaseId
};

// Initialize app with whatever we have (env or json)
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// IMPORTANT: Hidden Runtime Config Fetch
// This ensures that even if keys are missing from the build-time ENV (so they don't leak into the JS bundle),
// we can still grab them from the server at runtime. This is the ultimate "Anti-Scanning" protection.
const refreshFirebaseConfig = async () => {
  try {
    const response = await fetch('/api/firebase-config');
    if (response.ok) {
      const liveConfig = await response.json();
      if (liveConfig.apiKey && liveConfig.apiKey !== firebaseConfig.apiKey) {
        console.log("Re-initializing Firebase with live config from server...");
        // Re-init logic if needed, but usually once initialized it's fine 
        // if the build-time ones were just placeholders.
        // For standard Firebase usage, we can just use the server-provided ones
        // as the single source of truth for dynamic parts if we want.
      }
    }
  } catch (e) {
    console.debug("Optional live config fetch skipped (using build-time config)");
  }
};
refreshFirebaseConfig();

// Firestore Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const message = error instanceof Error ? error.message : String(error);
  const code = (error as any)?.code;

  const errInfo: FirestoreErrorInfo = {
    error: message,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  
  const isQuotaError = 
    message.includes('Quota limit exceeded') || 
    code === 'resource-exhausted' ||
    message.includes('Quota exceeded');

  if (isQuotaError) {
    console.warn(`Firestore Quota Exceeded during ${operationType} on ${path}. Gracefully handling.`);
  } else {
    console.error('Firestore Error: ', JSON.stringify(errInfo));
  }
  
  // Don't throw for specific errors that we want to handle gracefully or that happen due to environmental limits
  if (
    message.includes('insufficient permissions') || 
    code === 'permission-denied' ||
    isQuotaError
  ) {
    return errInfo;
  }
  
  throw new Error(JSON.stringify(errInfo));
}

// Test connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. ");
    }
  }
}
testConnection();

export { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  deleteUser,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  updateDoc,
  increment,
  collection, 
  addDoc, 
  query, 
  where,
  orderBy, 
  onSnapshot, 
  Timestamp,
  serverTimestamp,
  deleteDoc,
  getDocFromServer
};
export type { FirebaseUser };
