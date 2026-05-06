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

const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || firebaseConfigJson.appId,
  measurementId: (import.meta as any).env.VITE_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID || firebaseConfigJson.measurementId,
  firestoreDatabaseId: (import.meta as any).env.VITE_FIREBASE_DATABASE_ID || process.env.FIREBASE_DATABASE_ID || firebaseConfigJson.firestoreDatabaseId
};

if (!firebaseConfig.apiKey) {
  console.warn("Firebase configuration (specifically apiKey) is missing. Trying to load from window.FIREBASE_CONFIG fallback if available...");
  if ((window as any).FIREBASE_CONFIG) {
    Object.assign(firebaseConfig, (window as any).FIREBASE_CONFIG);
  }
}

if (!firebaseConfig.apiKey) {
  console.error("Firebase API Key is missing! Auth will not work. Please check your .env or firebase-applet-config.json. Current keys in glob: ", Object.keys(configFiles));
}

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

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
