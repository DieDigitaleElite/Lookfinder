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
import { getFirestore, doc, setDoc, getDoc, getDocs, updateDoc, increment, arrayUnion, collection, addDoc, query, where, orderBy, onSnapshot, Timestamp, serverTimestamp, deleteDoc, getDocFromServer } from 'firebase/firestore';

// Try to import the Firebase configuration optionally
// @ts-ignore
const configFiles = import.meta.glob('../firebase-applet-config.json', { eager: true });
const firebaseConfigJson = (configFiles['../firebase-applet-config.json'] as any)?.default || 
                           configFiles['../firebase-applet-config.json'] || {};

// Initial search for config
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

// Initialize app - simple and stable
const app = initializeApp(firebaseConfig.apiKey ? firebaseConfig : {
  apiKey: "PLACEHOLDER",
  authDomain: "PLACEHOLDER",
  projectId: "PLACEHOLDER"
});

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// TESTED: No top-level async fetch to avoid blocking the main bundle load.

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
  let message = error instanceof Error ? error.message : String(error);
  const code = (error as any)?.code;

  // Scrub potential API keys from message (Red Team Audit finding)
  message = message.replace(/AIza[0-9A-Za-z-_]{35}/g, "[HIDDEN_KEY]");

  const errInfo: FirestoreErrorInfo = {
    error: message,
    authInfo: {
      userId: auth.currentUser?.uid,
      // Scrub PII for production security
      email: auth.currentUser?.email ? "[HIDDEN_EMAIL]" : null,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: [] // Removed PII for logs
    },
    operationType,
    path
  }
  
  const isQuotaError = 
    message.includes('Quota limit exceeded') || 
    code === 'resource-exhausted' ||
    message.includes('Quota exceeded');

  if (isQuotaError) {
    console.warn(`Firestore Quota Exceeded during ${operationType} on ${path}.`);
  } else {
    // Only log if not a standard permission/quota error to keep console clean
    if (code !== 'permission-denied' && !message.includes('insufficient permissions')) {
      console.error('Firestore Error context:', { operationType, path, code });
    }
  }
  
  // Don't throw for specific errors that we want to handle gracefully or that happen due to environmental limits
  if (
    message.includes('insufficient permissions') || 
    code === 'permission-denied' ||
    isQuotaError
  ) {
    return errInfo;
  }
  
  // Safe stringification for bubble up
  throw new Error(`Firestore Error (${code || 'unknown'}): ${message}`);
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
  arrayUnion,
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
